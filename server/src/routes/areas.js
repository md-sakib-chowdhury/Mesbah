const router = require('express').Router();
const Area = require('../models/Area');
const auth = require('../middleware/auth');
const adminOnly = require('../middleware/adminOnly');

// Public — সব active areas
router.get('/', async (req, res) => {
    try {
        const areas = await Area.find({ isActive: true }).sort('createdAt');
        res.json(areas);
    } catch (err) { res.status(500).json({ message: err.message }); }
});

// Admin — সব areas
router.get('/all', auth, adminOnly, async (req, res) => {
    try {
        const areas = await Area.find().sort('createdAt');
        res.json(areas);
    } catch (err) { res.status(500).json({ message: err.message }); }
});

// Add
router.post('/', auth, adminOnly, async (req, res) => {
    try {
        const area = await Area.create(req.body);
        res.status(201).json(area);
    } catch (err) { res.status(500).json({ message: err.message }); }
});

// Update
router.put('/:id', auth, adminOnly, async (req, res) => {
    try {
        const area = await Area.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(area);
    } catch (err) { res.status(500).json({ message: err.message }); }
});

// Delete
router.delete('/:id', auth, adminOnly, async (req, res) => {
    try {
        await Area.findByIdAndDelete(req.params.id);
        res.json({ message: 'Deleted' });
    } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;