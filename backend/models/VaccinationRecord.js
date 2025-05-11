const mongoose = require('mongoose');

const vaccinationRecordSchema = new mongoose.Schema({
  studentId: {
    type: String,
    required: true
  },
  studentName: {
    type: String,
    required: true
  },
  vaccineName: {
    type: String,
    required: true
  },
  vaccinationDate: {
    type: Date,
    required: true
  }
});

module.exports = mongoose.model('VaccinationRecord', vaccinationRecordSchema);
