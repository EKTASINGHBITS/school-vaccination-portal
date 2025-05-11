const mongoose = require('mongoose');

const VaccinationDriveSchema = new mongoose.Schema({
  location: { type: String, required: true },
  date: { type: Date, required: true },
  vaccineType: { type: String, required: true },
  notes: { type: String }
});

module.exports = mongoose.model('VaccinationDrive', VaccinationDriveSchema);
