const router = require('express').Router();
const Message = require('../models/Message');
const auth = require('../middleware/auth');

router.get('/conversations', auth, async (req, res) => {
    try {
        const userId = req.user.id;
        const msgs = await Message.find({
            $or: [{ from: userId }, { to: userId }]
        }).populate('from to', 'name').sort('-createdAt');

        const seen = new Set();
        const conversations = [];
        for (const m of msgs) {
            const other = m.from._id.toString() === userId ? m.to : m.from;
            if (!seen.has(other._id.toString())) {
                seen.add(other._id.toString());
                const unread = await Message.countDocuments({ from: other._id, to: userId, read: false });
                conversations.push({
                    _id: other._id,
                    name: other.name,
                    lastMessage: m.text,
                    time: m.createdAt,
                    unread,
                });
            }
        }
        res.json(conversations);
    } catch (err) { res.status(500).json({ message: err.message }); }
});

router.get('/:userId', auth, async (req, res) => {
    try {
        const me = req.user.id;
        const other = req.params.userId;
        const messages = await Message.find({
            $or: [
                { from: me, to: other },
                { from: other, to: me }
            ]
        }).sort('createdAt');
        await Message.updateMany({ from: other, to: me, read: false }, { read: true });
        res.json(messages);
    } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;