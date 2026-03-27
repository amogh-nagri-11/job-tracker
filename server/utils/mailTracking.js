import crypto from 'crypto';

const STATUS_PATTERNS = [
    { status: 'Offer', patterns: [/offer/i, /compensation/i, /joining/i] },
    { status: 'Rejected', patterns: [/regret/i, /not moving forward/i, /unfortunately/i, /rejected/i] },
    { status: 'Interview', patterns: [/interview/i, /screen/i, /assessment/i, /take-home/i, /technical round/i] },
    { status: 'Applied', patterns: [/application received/i, /thanks for applying/i, /applied/i, /submitted/i] },
];

const ROLE_PATTERNS = [
    /for\s+the\s+([A-Z][A-Za-z0-9/&(),.\- ]{2,80})\s+(?:role|position)/i,
    /position[:\s]+([A-Z][A-Za-z0-9/&(),.\- ]{2,80})/i,
    /role[:\s]+([A-Z][A-Za-z0-9/&(),.\- ]{2,80})/i,
    /job title[:\s]+([A-Z][A-Za-z0-9/&(),.\- ]{2,80})/i,
];

const COMPANY_PATTERNS = [
    /at\s+([A-Z][A-Za-z0-9&.,' -]{1,80})/i,
    /from\s+([A-Z][A-Za-z0-9&.,' -]{1,80})/i,
    /company[:\s]+([A-Z][A-Za-z0-9&.,' -]{1,80})/i,
];

export const createMailTrackingToken = () => crypto.randomBytes(12).toString('hex');

export const buildForwardingAddress = (token) => {
    const domain = process.env.MAIL_TRACKER_INBOX_DOMAIN;
    if (!domain || !token) {
        return null;
    }

    return `jobs+${token}@${domain}`;
};

const cleanMatch = (value) => value?.replace(/\s+/g, ' ').trim().replace(/[.!,;:]+$/, '');

export const inferStatusFromEmail = (content) => {
    const normalized = content || '';

    for (const entry of STATUS_PATTERNS) {
        if (entry.patterns.some((pattern) => pattern.test(normalized))) {
            return entry.status;
        }
    }

    return 'Applied';
};

export const inferRoleFromEmail = (subject, text) => {
    const haystack = `${subject || ''}\n${text || ''}`;

    for (const pattern of ROLE_PATTERNS) {
        const match = haystack.match(pattern);
        if (match?.[1]) {
            return cleanMatch(match[1]);
        }
    }

    const subjectMatch = (subject || '').match(/(?:application|interview|offer|update)\s+(?:for|regarding)\s+([A-Z][A-Za-z0-9/&(),.\- ]{2,80})/i);
    if (subjectMatch?.[1]) {
        return cleanMatch(subjectMatch[1]);
    }

    return 'Unknown role';
};

export const inferCompanyFromEmail = ({ subject, text, fromName, fromAddress }) => {
    const haystack = `${subject || ''}\n${text || ''}`;

    for (const pattern of COMPANY_PATTERNS) {
        const match = haystack.match(pattern);
        if (match?.[1]) {
            return cleanMatch(match[1]);
        }
    }

    if (fromName && !/no-?reply/i.test(fromName)) {
        return cleanMatch(fromName);
    }

    if (fromAddress) {
        const domain = fromAddress.split('@')[1] || '';
        const companyGuess = domain.split('.')[0];
        if (companyGuess) {
            return companyGuess.charAt(0).toUpperCase() + companyGuess.slice(1);
        }
    }

    return 'Unknown company';
};

export const parseJobFromMail = ({ subject, text, fromName, fromAddress, date, messageId }) => {
    const normalizedText = text?.slice(0, 5000) || '';
    const combined = `${subject || ''}\n${normalizedText}`;
    const status = inferStatusFromEmail(combined);
    const company = inferCompanyFromEmail({ subject, text: normalizedText, fromName, fromAddress });
    const role = inferRoleFromEmail(subject, normalizedText);

    return {
        company,
        role,
        status,
        appliedDate: date || new Date(),
        notes: `Auto-imported from email: ${subject || 'No subject'}`,
        source: 'email',
        mailMetadata: {
            messageId,
            from: fromAddress || fromName || '',
            subject: subject || '',
            receivedAt: date || new Date(),
        },
    };
};
