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
        // Define initial rooms data (50 rooms)
        const rooms = Array.from({ length: 50 }, (_, i) => ({
            roomNumber: i + 1,
            type: i < 10 ? 'Queen Room' : i < 20 ? 'Double Room' : i < 30 ? 'Two Queen Beds Room' : i < 40 ? 'Disability Room' : 'King Bed',
            price: i < 10 ? 49 : i < 20 ? 52 : i < 30 ? 55 : i < 40 ? 55 : 55,
            isAvailable: true
        }));

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
