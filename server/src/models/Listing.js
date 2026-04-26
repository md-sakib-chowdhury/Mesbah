const mongoose = require('mongoose');

const listingSchema = new mongoose.Schema({
    title: String,
    area: String,
    type: String,
    gender: String,
    rent: Number,
    description: String,
    images: [String],
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Listing', listingSchema);