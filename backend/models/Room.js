// models/Room.js - Room Schema Definition

const mongoose = require('mongoose');

const RoomSchema = new mongoose.Schema({
    roomNumber: { type: Number, required: true, unique: true },
    type: { type: String, required: true },
    price: { type: Number, required: true },
    isAvailable: { type: Boolean, default: true },
    checkedInAt: { type: Date, default: null },
});

module.exports = mongoose.model('Room', RoomSchema);
