const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    password: String,
    university: String,
    gender: String,
    phone: String,
    role: { type: String, default: 'user' },
    isBlocked: { type: Boolean, default: false },
    preferences: {
        smoking: String,
        sleepSchedule: String,
        social: String,
        diet: String,
        prayers: String
    }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);