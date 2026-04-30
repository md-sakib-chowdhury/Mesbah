const router = require('express').Router();
const User = require('../models/User');
const auth = require('../middleware/auth');

router.get('/me', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (err) { res.status(500).json({ message: err.message }); }
});

router.put('/me', auth, async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.user.id, req.body, { new: true }).select('-password');
        res.json(user);
    } catch (err) { res.status(500).json({ message: err.message }); }
});

router.get('/match', auth, async (req, res) => {
    try {
        const me = await User.findById(req.user.id);
        const others = await User.find({ _id: { $ne: req.user.id }, role: 'user' }).select('-password');
        const scored = others.map(u => {
            let score = 0;
            const prefs = ['smoking', 'sleepSchedule', 'social', 'diet', 'prayers'];
            if (me.preferences && u.preferences) {
                prefs.forEach(p => {
                    if (me.preferences[p] && me.preferences[p] === u.preferences[p]) score += 20;
                });
            }
            return { ...u.toObject(), matchScore: score };
        }).sort((a, b) => b.matchScore - a.matchScore);
        res.json(scored);
    } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;