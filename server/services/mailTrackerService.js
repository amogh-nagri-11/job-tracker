import { SMTPServer } from 'smtp-server';
import { simpleParser } from 'mailparser';
import User from '../models/User.js';
import Job from '../models/Job.js';
import { buildForwardingAddress, createMailTrackingToken, parseJobFromMail } from '../utils/mailTracking.js';
import { sendMail } from '../utils/mailer.js';

export const ensureMailTrackingUser = async (user) => {
    if (!user.mailTrackingToken) {
        user.mailTrackingToken = createMailTrackingToken();
        await user.save();
    }

    return {
        token: user.mailTrackingToken,
        forwardingAddress: buildForwardingAddress(user.mailTrackingToken),
        enabled: user.mailTrackingEnabled,
        lastMailSyncAt: user.lastMailSyncAt || null,
    };
};

const resolveUserFromRecipient = async (recipient) => {
    const localPart = recipient?.split('@')[0] || '';
    const token = localPart.startsWith('jobs+') ? localPart.slice(5) : '';

    if (!token) {
        return null;
    }

    return User.findOne({ mailTrackingToken: token, mailTrackingEnabled: true });
};

const createOrUpdateMailJob = async ({ user, parsedMail, recipient }) => {
    const fromAddress = parsedMail.from?.value?.[0]?.address || '';
    const fromName = parsedMail.from?.value?.[0]?.name || '';
    const jobPayload = parseJobFromMail({
        subject: parsedMail.subject,
        text: parsedMail.text,
        fromName,
        fromAddress,
        date: parsedMail.date,
        messageId: parsedMail.messageId,
    });

    const existingJob = parsedMail.messageId
        ? await Job.findOne({
            user: user._id,
            'mailMetadata.messageId': parsedMail.messageId,
        })
        : null;

    if (existingJob) {
        existingJob.status = jobPayload.status;
        existingJob.notes = jobPayload.notes;
        existingJob.mailMetadata = jobPayload.mailMetadata;
        await existingJob.save();
        return { job: existingJob, created: false };
    }

    const recentMatch = await Job.findOne({
        user: user._id,
        source: 'email',
        company: jobPayload.company,
        role: jobPayload.role,
    }).sort({ createdAt: -1 });

    if (recentMatch) {
        recentMatch.status = jobPayload.status;
        recentMatch.notes = `${recentMatch.notes}\nUpdate from ${recipient}: ${parsedMail.subject || 'No subject'}`.trim();
        recentMatch.mailMetadata = jobPayload.mailMetadata;
        await recentMatch.save();
        return { job: recentMatch, created: false };
    }

    const job = await Job.create({
        user: user._id,
        ...jobPayload,
    });

    return { job, created: true };
};

export const processInboundMail = async ({ rawEmail, recipient }) => {
    const user = await resolveUserFromRecipient(recipient);
    if (!user) {
        throw new Error('No mail-tracking user found for recipient');
    }

    const parsedMail = await simpleParser(rawEmail);
    const result = await createOrUpdateMailJob({ user, parsedMail, recipient });

    user.lastMailSyncAt = new Date();
    await user.save();

    return {
        user,
        ...result,
    };
};

export const sendMailTrackingSetupEmail = async (user) => {
    const settings = await ensureMailTrackingUser(user);

    if (!settings.forwardingAddress) {
        return { skipped: true, reason: 'MAIL_TRACKER_INBOX_DOMAIN is not configured' };
    }

    return sendMail({
        to: user.email,
        subject: 'Set up automatic job tracking',
        text: `Forward recruiter emails to ${settings.forwardingAddress} and we will add or update applications automatically.`,
        html: `<p>Forward recruiter emails to <strong>${settings.forwardingAddress}</strong> and the tracker will add or update applications automatically.</p>`,
    });
};

export const startMailTrackingServer = () => {
    const port = Number(process.env.MAIL_TRACKER_SMTP_PORT || 2525);
    const host = process.env.MAIL_TRACKER_SMTP_HOST || '0.0.0.0';
    const domain = process.env.MAIL_TRACKER_INBOX_DOMAIN;

    if (!domain) {
        console.log('Mail tracking SMTP disabled: MAIL_TRACKER_INBOX_DOMAIN is not configured');
        return null;
    }

    const server = new SMTPServer({
        disabledCommands: ['AUTH'],
        authOptional: true,
        onRcptTo(address, _session, callback) {
            if (address.address?.endsWith(`@${domain}`)) {
                callback();
                return;
            }

            callback(new Error('Recipient not accepted'));
        },
        onData(stream, session, callback) {
            const chunks = [];

            stream.on('data', (chunk) => chunks.push(chunk));
            stream.on('end', async () => {
                try {
                    const rawEmail = Buffer.concat(chunks);
                    const recipient = session.envelope.rcptTo?.[0]?.address;
                    await processInboundMail({ rawEmail, recipient });
                    callback();
                } catch (error) {
                    callback(error);
                }
            });
        },
    });

    server.listen(port, host, () => {
        console.log(`Mail tracking SMTP listening on ${host}:${port}`);
    });

    return server;
};
