const mongoose = require('mongoose');
const settingsSchema = new mongoose.Schema({
    siteName: { type: String, default: 'মেসবাহ' },
    tagline: { type: String, default: 'তোমার পছন্দের মেস খোঁজো' },
    logo: { type: String, default: '' },
    heroBanner: { type: String, default: '' },
    primaryColor: { type: String, default: '#6C63FF' },
    contactEmail: { type: String, default: '' },
    contactPhone: { type: String, default: '' },
    footerText: { type: String, default: '' },
    maintenanceMode: { type: Boolean, default: false },
    allowRegistration: { type: Boolean, default: true },
}, { timestamps: true });
module.exports = mongoose.model('Settings', settingsSchema);