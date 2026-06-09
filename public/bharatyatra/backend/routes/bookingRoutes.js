const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Destination = require('../models/Destination');

// POST /api/bookings – Create a new booking
router.post('/', async (req, res) => {
  try {
    const { userEmail, destinationId, travelersCount, travelDate, specialRequests } = req.body;

    // Validate destination exists
    const destination = await Destination.findById(destinationId);
    if (!destination) {
      return res.status(404).json({
        success: false,
        message: 'Selected destination not found. Please choose a valid destination.',
      });
    }

    // Validate travel date is in the future
    const selectedDate = new Date(travelDate);
    if (selectedDate <= new Date()) {
      return res.status(400).json({
        success: false,
        message: 'Travel date must be a future date.',
      });
    }

    const booking = await Booking.create({
      userEmail,
      destinationId,
      travelersCount,
      travelDate: selectedDate,
      specialRequests: specialRequests || '',
      status: 'Pending',
    });

    // Populate destination details for response
    const populatedBooking = await booking.populate('destinationId', 'title region category');

    res.status(201).json({
      success: true,
      message: `Your journey to ${destination.title} has been reserved! Confirmation will be sent to ${userEmail}.`,
      data: populatedBooking,
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ success: false, message: messages.join('. ') });
    }
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
});

// GET /api/bookings – Fetch all bookings (admin view)
router.get('/', async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('destinationId', 'title region category')
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: bookings.length, data: bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
});

module.exports = router;