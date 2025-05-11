const express = require('express');
const multer = require('multer');
const csv = require('csv-parser');
const fs = require('fs');
const path = require('path');
const Student = require('../models/Student');

const router = express.Router();

// Setup multer for file upload
const upload = multer({ dest: 'uploads/' });

// POST route to handle CSV upload
router.post('/upload-csv', upload.single('file'), async (req, res) => {
  const results = [];

  fs.createReadStream(req.file.path)
    .pipe(csv())
    .on('data', (data) => {
      // Optional: Basic validation on each row
      if (data.studentId && data.name && data.age && data.studentClass) {
        results.push({
          studentId: data.studentId.trim(),
          name: data.name.trim(),
          age: parseInt(data.age),
          studentClass: data.studentClass.trim(),
          vaccinated: data.vaccinated?.toLowerCase() === 'yes',
        });
      }
    })
    .on('end', async () => {
      try {
        // Insert all students at once
        await Student.insertMany(results);
        fs.unlinkSync(req.file.path); // Remove the uploaded file
        res.status(200).json({ message: 'CSV uploaded successfully!', count: results.length });
      } catch (err) {
        res.status(500).json({ message: 'Error saving data', error: err.message });
      }
    });
});

module.exports = router;
