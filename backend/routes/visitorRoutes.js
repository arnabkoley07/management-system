const express = require('express');
const router = express.Router();
const Visitor = require('../models/Visitor');

// 1. GET ALL VISITORS (with optional search by name or mobile)
router.get('/', async (req, res) => {
  try {
    const { search } = req.query;
    let query = {};

    if (search) {
      const searchRegex = new RegExp(search, 'i');
      query = {
        $or: [
          { name: searchRegex },
          { mobile: searchRegex },
          { company: searchRegex },
        ],
      };
    }

    const visitors = await Visitor.find(query).sort({ checkInTime: -1 }).lean();
    res.json(visitors);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching visitors', error: error.message });
  }
});

// 2. ADD A NEW VISITOR
router.post('/', async (req, res) => {
  try {
    const { name, mobile, company, personToMeet, purpose } = req.body;

    // Validation
    if (!name || !mobile || !company || !personToMeet || !purpose) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const newVisitor = new Visitor({
      name,
      mobile,
      company,
      personToMeet,
      purpose,
      checkInTime: new Date(), // Auto Date & Time
      status: 'In Premises',
    });

    const savedVisitor = await newVisitor.save();
    res.status(201).json(savedVisitor);
  } catch (error) {
    res.status(500).json({ message: 'Error adding visitor', error: error.message });
  }
});

// 3. EDIT VISITOR DETAILS
router.put('/:id', async (req, res) => {
  try {
    const { name, mobile, company, personToMeet, purpose } = req.body;

    const updatedVisitor = await Visitor.findByIdAndUpdate(
      req.params.id,
      { name, mobile, company, personToMeet, purpose },
      { new: true, runValidators: true }
    );

    if (!updatedVisitor) {
      return res.status(404).json({ message: 'Visitor not found' });
    }

    res.json(updatedVisitor);
  } catch (error) {
    res.status(500).json({ message: 'Error updating visitor', error: error.message });
  }
});

// 4. CHECK OUT VISITOR
router.patch('/:id/checkout', async (req, res) => {
  try {
    const updatedVisitor = await Visitor.findByIdAndUpdate(
      req.params.id,
      {
        status: 'Checked Out',
        checkOutTime: new Date(),
      },
      { new: true }
    );

    if (!updatedVisitor) {
      return res.status(404).json({ message: 'Visitor not found' });
    }

    res.json(updatedVisitor);
  } catch (error) {
    res.status(500).json({ message: 'Error checking out visitor', error: error.message });
  }
});

// 5. DELETE VISITOR RECORD
router.delete('/:id', async (req, res) => {
  try {
    const deletedVisitor = await Visitor.findByIdAndDelete(req.params.id);

    if (!deletedVisitor) {
      return res.status(404).json({ message: 'Visitor not found' });
    }

    res.json({ message: 'Visitor deleted successfully', id: req.params.id });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting visitor', error: error.message });
  }
});

module.exports = router;
