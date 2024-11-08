// seedRooms.js - Script to seed initial room data into MongoDB

const mongoose = require('mongoose');
require('dotenv').config();
const Room = require('./models/Room');

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Could not connect to MongoDB', err));

// Seed Rooms Data
const seedRooms = async () => {
    try {
        // Define initial rooms data (rooms 10-21, 35-50, 51-62)
        const rooms = [];

        // Rooms for Left Building (10-21)
        for (let i = 10; i <= 21; i++) {
            rooms.push({
                roomNumber: i,
                type: 'Queen Room',
                price: 49,
                isAvailable: true
            });
        }

        // Rooms for Center Building (35-50)
        for (let i = 35; i <= 50; i++) {
            rooms.push({
                roomNumber: i,
                type: 'Double Room',
                price: 52,
                isAvailable: true
            });
        }

        // Rooms for Office Building (51-62)
        for (let i = 51; i <= 62; i++) {
            rooms.push({
                roomNumber: i,
                type: 'King Bed',
                price: 55,
                isAvailable: true
            });
        }

        // Delete existing rooms to avoid duplication
        await Room.deleteMany({});
        
        // Insert new room data
        await Room.insertMany(rooms);
        console.log('Rooms seeded successfully');
    } catch (error) {
        console.error('Error seeding rooms:', error);
    } finally {
        mongoose.connection.close();
    }
};

// Execute the seeding function
seedRooms();
