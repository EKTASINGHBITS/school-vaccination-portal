// === server.js (CLEANED) ===
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// ===== Middleware =====
app.use(cors());
app.use(express.json());

// ===== Root Health Route =====
app.get('/', (req, res) => {
  res.send('School Vaccination Portal Backend Running');
});

// ===== Route Imports =====
const reportRoutes = require('./routes/reportRoutes');
const bulkUploadRoute = require('./routes/bulkUploadRoute');
const vaccinationRoutes = require('./routes/vaccinationRoutes');

// ===== Route Handlers =====
app.use('/report', reportRoutes);
app.use('/api', bulkUploadRoute);
app.use('/vaccination', vaccinationRoutes);

// ===== Student Routes =====
const Student = require('./models/Student');

app.post('/students', async (req, res) => {
  try {
    const student = new Student(req.body);
    await student.save();
    res.status(201).send(student);
  } catch (err) {
    res.status(400).send(err);
  }
});

app.get('/students', async (req, res) => {
  try {
    const students = await Student.find();
    res.status(200).send(students);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
});

app.put('/students/:id', async (req, res) => {
  try {
    const updatedStudent = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedStudent) return res.status(404).send('Student not found');
    res.send(updatedStudent);
  } catch (err) {
    res.status(400).send(err);
  }
});

app.delete('/students/:id', async (req, res) => {
  try {
    const result = await Student.findByIdAndDelete(req.params.id);
    if (!result) return res.status(404).send({ message: 'Student not found' });
    res.status(200).send({ message: 'Student deleted successfully' });
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});
// GET: Find student by custom studentId (not Mongo _id)
app.get('/students/by-id/:studentId', async (req, res) => {
  try {
    const student = await Student.findOne({ studentId: req.params.studentId });
    if (!student) return res.status(404).send({ message: 'Student not found' });
    res.status(200).send(student);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

// ===== Drive Routes =====
const Drive = require('./models/Drive');

app.post('/drives', async (req, res) => {
  try {
    const newDrive = new Drive(req.body);
    await newDrive.save();
    res.status(201).send(newDrive);
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});

app.get('/drives', async (req, res) => {
  try {
    const drives = await Drive.find();
    res.send(drives);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

app.put('/drives/:id', async (req, res) => {
  try {
    const updatedDrive = await Drive.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.send(updatedDrive);
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});

app.delete('/drives/:id', async (req, res) => {
  try {
    await Drive.findByIdAndDelete(req.params.id);
    res.send({ message: 'Drive deleted successfully' });
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});
app.get('/drives/:id', async (req, res) => {
  try {
    const drive = await Drive.findById(req.params.id);
    if (!drive) return res.status(404).send({ message: 'Drive not found' });
    res.send(drive);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});


// ===== DB Connect and Server Boot =====
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.log(err));
