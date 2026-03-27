import nodemailer from 'nodemailer';

let transporter;

const createTransporter = () => {
    if (transporter) {
        return transporter;
    }

    const host = process.env.SMTP_HOST;
    const port = Number(process.env.SMTP_PORT || 587);
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;

    if (!host || !user || !pass) {
        return null;
    }

    transporter = nodemailer.createTransport({
        host,
        port,
        secure: port === 465,
        auth: {
            user,
            pass,
        },
    });

    return transporter;
};

export const sendMail = async ({ to, subject, text, html }) => {
    const activeTransporter = createTransporter();

    if (!activeTransporter) {
        return { skipped: true, reason: 'SMTP credentials not configured' };
    }

    await activeTransporter.sendMail({
        from: process.env.MAIL_FROM || process.env.SMTP_USER,
        to,
        subject,
        text,
        html,
    });

    return { skipped: false };
};
