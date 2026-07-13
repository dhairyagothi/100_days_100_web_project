const express = require('express');
const router = express.Router();
const Destination = require('../models/Destination');

// Seed data – 3 curated Indian destinations for global travelers
const seedDestinations = [
  {
    title: 'Varanasi',
    region: 'Uttar Pradesh, North India',
    description:
      'One of the world\'s oldest continuously inhabited cities, Varanasi is the spiritual heartbeat of India. Pilgrims and seekers from every continent come to witness the ancient Ganga Aarti ceremony at dawn — a transcendent ritual of fire, prayer, and devotion performed on the sacred ghats of the River Ganges. Walk through labyrinthine alleys, meditate in centuries-old ashrams, and experience the profound philosophy of life, death, and liberation that has drawn mystics for over 3,000 years.',
    image: 'https://images.unsplash.com/photo-1561361058-c24e021e2979?w=800&q=80',
    category: 'Spiritual',
    globalAppeal:
      'A UNESCO-recognized cradle of civilization and the world capital of spiritual wellness retreats, drawing over 1 million international visitors annually.',
    rating: 4.8,
    bestTimeToVisit: 'October – March',
  },
  {
    title: 'Western Ghats',
    region: 'Kerala & Karnataka, South India',
    description:
      'A UNESCO World Heritage Site and one of the world\'s eight "hottest" biodiversity hotspots, the Western Ghats stretch over 1,600 km of pristine rainforest, mist-draped mountains, and cascading waterfalls. Home to Bengal tigers, Indian elephants, and thousands of endemic plant species, this is eco-tourism at its most pristine. Explore carbon-neutral jungle lodges, kayak through backwater lagoons, and rejuvenate with authentic Ayurvedic forest therapies in one of Earth\'s last untouched wilderness corridors.',
    image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800&q=80',
    category: 'Eco-Tourism',
    globalAppeal:
      'Ranked among the top 5 global eco-tourism destinations by National Geographic, offering zero-carbon trail experiences and rare wildlife encounters.',
    rating: 4.9,
    bestTimeToVisit: 'September – February',
  },
  {
    title: 'Hampi',
    region: 'Karnataka, South India',
    description:
      'The ruins of Hampi, once the imperial capital of the Vijayanagara Empire — the richest city on Earth in the 16th century — rise dramatically from a surreal boulder-strewn landscape. Over 1,600 monuments including colossal temple complexes, royal elephant stables, and intricate stone chariots are scattered across 4,100 hectares. This UNESCO World Heritage Site offers one of the most extraordinary open-air museum experiences on the planet, where ancient civilization meets breathtaking geological drama.',
    image: 'https://images.unsplash.com/photo-1600100397608-4b7e7e26e48b?w=800&q=80',
    category: 'Heritage',
    globalAppeal:
      'A UNESCO World Heritage Site consistently ranked among Asia\'s top archaeological wonders, attracting historians, architects, and photographers worldwide.',
    rating: 4.7,
    bestTimeToVisit: 'November – February',
  },
];

// Seed function – runs once if collection is empty
const seedIfEmpty = async () => {
  try {
    const count = await Destination.countDocuments();
    if (count === 0) {
      await Destination.insertMany(seedDestinations);
      console.log('Database seeded with 3 initial destinations.');
    }
  } catch (err) {
    console.error('Seeding error:', err.message);
  }
};

seedIfEmpty();

// GET /api/destinations – Fetch all destinations
router.get('/', async (req, res) => {
  try {
    const { category, region } = req.query;
    const filter = {};
    if (category) filter.category = category;
    if (region) filter.region = new RegExp(region, 'i');

    const destinations = await Destination.find(filter).sort({ rating: -1 });
    res.status(200).json({
      success: true,
      count: destinations.length,
      data: destinations,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
});

// GET /api/destinations/:id – Fetch single destination
router.get('/:id', async (req, res) => {
  try {
    const destination = await Destination.findById(req.params.id);
    if (!destination) {
      return res.status(404).json({ success: false, message: 'Destination not found' });
    }
    res.status(200).json({ success: true, data: destination });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
});

module.exports = router;