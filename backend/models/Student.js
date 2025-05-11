const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  studentId: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  age: Number,
  studentClass: String,
  vaccinated: {
    type: Boolean,
    default: false
  }
});

module.exports = mongoose.model('Student', studentSchema);
