// routes/roomRoutes.js - Room Routes

const express = require('express');
const router = express.Router();
const { getAllRooms, checkInRoom, checkOutRoom } = require('../controllers/roomController');

// Define Routes
router.get('/', getAllRooms);             // Get all rooms
router.post('/checkin/:id', checkInRoom); // Check in a room
router.post('/checkout/:id', checkOutRoom); // Check out a room

module.exports = router;
