// controllers/roomController.js - Room Controller Logic

const Room = require('../models/Room');

// Get all rooms
const getAllRooms = async (req, res) => {
    try {
        const rooms = await Room.find();
        res.json(rooms);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Check in a room
const checkInRoom = async (req, res) => {
    try {
        const room = await Room.findById(req.params.id);
        if (room && room.isAvailable) {
            room.isAvailable = false;
            room.checkedInAt = new Date();
            await room.save();
            console.log(`Room ${room.roomNumber} checked in at ${room.checkedInAt}`);
            res.json({ message: `Room ${room.roomNumber} checked in successfully!` });
        } else {
            res.status(400).json({ message: 'Room is not available or does not exist.' });
        }
    } catch (err) {
        console.error('Error checking in room:', err);
        res.status(500).json({ message: err.message });
    }
};

// Check out a room
const checkOutRoom = async (req, res) => {
    try {
        const room = await Room.findById(req.params.id);
        if (room && !room.isAvailable) {
            room.isAvailable = true;
            room.checkedInAt = null;
            await room.save();
            console.log(`Room ${room.roomNumber} checked out successfully`);
            res.json({ message: `Room ${room.roomNumber} checked out successfully!` });
        } else {
            res.status(400).json({ message: 'Room is already available or does not exist.' });
        }
    } catch (err) {
        console.error('Error checking out room:', err);
        res.status(500).json({ message: err.message });
    }
};

// Create a new room
const createRoom = async (req, res) => {
    try {
        const room = new Room(req.body);
        const newRoom = await room.save();
        res.status(201).json(newRoom);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

module.exports = { getAllRooms, checkInRoom, checkOutRoom, createRoom };
