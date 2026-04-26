const router = require('express').Router();
const Settings = require('../models/Settings');
const auth = require('../middleware/auth');
const adminOnly = require('../middleware/adminOnly');

router.get('/', async (req, res) => {
    try {
        let settings = await Settings.findOne();
        if (!settings) settings = await Settings.create({});
        res.json(settings);
    } catch (err) { res.status(500).json({ message: err.message }); }
});

router.put('/', auth, adminOnly, async (req, res) => {
    try {
        let settings = await Settings.findOne();
        if (!settings) settings = await Settings.create(req.body);
        else settings = await Settings.findByIdAndUpdate(settings._id, req.body, { new: true });
        res.json(settings);
    } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;