const router = require('express').Router();
const Listing = require('../models/Listing');
const auth = require('../middleware/auth');

router.get('/', async (req, res) => {
    try {
        const { area, type, gender, minRent, maxRent } = req.query;
        let filter = { isActive: true };
        if (area) filter.area = area;
        if (type) filter.type = type;
        if (gender) filter.gender = gender;
        if (minRent || maxRent) filter.rent = {};
        if (minRent) filter.rent.$gte = Number(minRent);
        if (maxRent) filter.rent.$lte = Number(maxRent);
        const listings = await Listing.find(filter).populate('owner', 'name phone').sort('-createdAt');
        res.json(listings);
    } catch (err) { res.status(500).json({ message: err.message }); }
});

router.get('/:id', async (req, res) => {
    try {
        const listing = await Listing.findById(req.params.id).populate('owner', 'name phone email');
        if (!listing) return res.status(404).json({ message: 'Not found' });
        res.json(listing);
    } catch (err) { res.status(500).json({ message: err.message }); }
});

router.post('/', auth, async (req, res) => {
    try {
        const listing = await Listing.create({ ...req.body, owner: req.user.id });
        res.status(201).json(listing);
    } catch (err) { res.status(500).json({ message: err.message }); }
});

router.put('/:id', auth, async (req, res) => {
    try {
        const listing = await Listing.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(listing);
    } catch (err) { res.status(500).json({ message: err.message }); }
});

router.delete('/:id', auth, async (req, res) => {
    try {
        await Listing.findByIdAndDelete(req.params.id);
        res.json({ message: 'Deleted' });
    } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;