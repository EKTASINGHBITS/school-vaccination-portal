const mongoose = require('mongoose');

const driveSchema = new mongoose.Schema({
  vaccineName: { type: String, required: true },
  date: { type: Date, required: true }, // renamed from driveDate
  doses: { type: Number, required: true }, // renamed from totalDoses
  classes: [{ type: String }], // renamed from applicableClasses
  completed: { type: Boolean, default: false }
});

module.exports = mongoose.model('Drive', driveSchema);
