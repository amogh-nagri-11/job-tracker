import express from 'express';
import User from '../models/User.js';
import protect from '../middleware/authMiddleware.js';
import { ensureMailTrackingUser, processInboundMail, sendMailTrackingSetupEmail } from '../services/mailTrackerService.js';

const router = express.Router();

router.get('/settings', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const settings = await ensureMailTrackingUser(user);
        res.json(settings);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.patch('/settings', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        if (typeof req.body.enabled === 'boolean') {
            user.mailTrackingEnabled = req.body.enabled;
        }

        await user.save();
        const settings = await ensureMailTrackingUser(user);
        res.json(settings);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/send-setup-email', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const result = await sendMailTrackingSetupEmail(user);
        res.json({
            message: result.skipped ? result.reason : 'Setup email sent',
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/inbound', express.raw({ type: '*/*', limit: '10mb' }), async (req, res) => {
    try {
        const webhookSecret = process.env.MAIL_TRACKER_WEBHOOK_SECRET;
        if (webhookSecret && req.headers['x-mail-tracker-secret'] !== webhookSecret) {
            return res.status(401).json({ error: 'Invalid mail tracker secret' });
        }

        const recipient = req.headers['x-tracker-recipient'] || req.query.recipient;
        if (!recipient) {
            return res.status(400).json({ error: 'Recipient is required' });
        }

        await processInboundMail({
            rawEmail: req.body,
            recipient,
        });

        res.status(202).json({ message: 'Email processed' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
