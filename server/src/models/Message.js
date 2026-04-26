const mongoose = require('mongoose');
const messageSchema = new mongoose.Schema({
    room: { type: String, required: true },
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    text: { type: String, required: true },
}, { timestamps: true });
module.exports = mongoose.model('Message', messageSchema);