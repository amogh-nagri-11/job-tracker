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

export const sendVerificationMail = async (to, token) => {
    const verifyUrl = `${process.env.CLIENT_URL}/verify-email?token=${token}`;

    return sendMail ({
        to, 
        subject: "Verify your mail - Job Tracker", 
        html: `
            <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 2rem;">
                <h2 style="color: #6366f1;">Verify your email</h2>
                <p>Thanks for registering. Click the button below to verify your email address.</p>
                <a href="${verifyUrl}"
                style="display: inline-block; margin-top: 1rem; padding: 0.75rem 1.5rem;
                        background: #6366f1; color: white; border-radius: 8px;
                        text-decoration: none; font-weight: 500;">
                Verify Email
                </a>
                <p style="margin-top: 1.5rem; color: #6b7280; font-size: 0.85rem;">
                This link expires in 24 hours. If you didn't create an account, ignore this email.
                </p>
            </div>
        `,
    }); 
}; 

export const sendResetMail = async (to, token) => {
    const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${token}`

    return sendMail({
        to,
        subject: 'Reset your password — Job Tracker',
        html: `
        <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 2rem;">
            <h2 style="color: #6366f1;">Reset your password</h2>
            <p>You requested a password reset. Click the button below to set a new password.</p>
            <a href="${resetUrl}"
            style="display: inline-block; margin-top: 1rem; padding: 0.75rem 1.5rem;
                    background: #6366f1; color: white; border-radius: 8px;
                    text-decoration: none; font-weight: 500;">
            Reset Password
            </a>
            <p style="margin-top: 1.5rem; color: #6b7280; font-size: 0.85rem;">
            This link expires in 1 hour. If you didn't request a reset, ignore this email.
            </p>
        </div>
        `,
    });
}; 