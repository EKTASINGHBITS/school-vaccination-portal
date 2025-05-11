const express = require('express');
const router = express.Router();
const VaccinationRecord = require('../models/VaccinationRecord');

// Create a new vaccination record
router.post('/records', async (req, res) => {
  try {
    const { studentId, studentName, vaccineName, vaccinationDate } = req.body;

    // Prevent duplicate vaccination for same student and vaccine
    const existing = await VaccinationRecord.findOne({ studentId, vaccineName });
    if (existing) {
      return res.status(400).json({ message: 'This student is already vaccinated with this vaccine.' });
    }

    const newRecord = new VaccinationRecord({
      studentId,
      studentName,
      vaccineName,
      vaccinationDate
    });

    await newRecord.save();
    res.status(201).json({ message: 'Vaccination recorded successfully', data: newRecord });
  } catch (err) {
    res.status(400).json({ message: 'Failed to record vaccination', error: err.message });
  }
});

// Get all vaccination records (with optional filter by vaccine name)
router.get('/records', async (req, res) => {
  try {
    const { vaccineName } = req.query;
    const filter = vaccineName ? { vaccineName } : {};
    const records = await VaccinationRecord.find(filter).sort({ vaccinationDate: -1 });
    res.status(200).json(records);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch records', error: err.message });
  }
});

// Delete a vaccination record by ID
router.delete('/records/:id', async (req, res) => {
  try {
    const deleted = await VaccinationRecord.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Record not found' });
    res.status(200).json({ message: 'Record deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete record', error: err.message });
  }
});

module.exports = router;
