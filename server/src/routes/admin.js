const router = require('express').Router();
const User = require('../models/User');
const Listing = require('../models/Listing');
const auth = require('../middleware/auth');
const adminOnly = require('../middleware/adminOnly');

router.get('/stats', auth, adminOnly, async (req, res) => {
    try {
        const users = await User.countDocuments({ role: 'user' });
        const listings = await Listing.countDocuments();
        const activeListings = await Listing.countDocuments({ isActive: true });
        res.json({ users, listings, activeListings });
    } catch (err) { res.status(500).json({ message: err.message }); }
});

router.get('/users', auth, adminOnly, async (req, res) => {
    try {
        const users = await User.find({ role: 'user' }).select('-password');
        res.json(users);
    } catch (err) { res.status(500).json({ message: err.message }); }
});

router.put('/users/:id/block', auth, adminOnly, async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, { isBlocked: req.body.isBlocked }, { new: true });
        res.json(user);
    } catch (err) { res.status(500).json({ message: err.message }); }
});

router.get('/listings', auth, adminOnly, async (req, res) => {
    try {
        const listings = await Listing.find().populate('owner', 'name email');
        res.json(listings);
    } catch (err) { res.status(500).json({ message: err.message }); }
});

router.delete('/listings/:id', auth, adminOnly, async (req, res) => {
    try {
        await Listing.findByIdAndDelete(req.params.id);
        res.json({ message: 'Deleted' });
    } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;