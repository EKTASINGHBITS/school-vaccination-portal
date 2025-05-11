const express = require('express');
const router = express.Router();
const Student = require('../models/Student');
const Drive = require('../models/Drive');

// GET: Summary report with percentage
router.get('/summary', async (req, res) => {
  try {
    const totalStudents = await Student.countDocuments();
    const vaccinatedStudents = await Student.countDocuments({ vaccinated: true });
    const totalDrives = await Drive.countDocuments();
    
    const percentageVaccinated = totalStudents === 0
      ? 0
      : ((vaccinatedStudents / totalStudents) * 100).toFixed(2);

    res.json({
      totalStudents,
      vaccinatedStudents,
      pendingVaccination: totalStudents - vaccinatedStudents,
      totalDrives,
      percentageVaccinated  // ✅ aligned key
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate summary report' });
  }
});

// GET: Upcoming drives within next 30 days
router.get('/upcoming-drives', async (req, res) => {
  try {
    const today = new Date();
    const thirtyDaysLater = new Date();
    thirtyDaysLater.setDate(today.getDate() + 30);

    const upcomingDrives = await Drive.find({
      date: { $gte: today, $lte: thirtyDaysLater }
    }).sort({ date: 1 });

    res.json(upcomingDrives);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch upcoming drives' });
  }
});

module.exports = router;
