const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Default route to confirm server is working
app.get('/', (req, res) => {
  res.send('Training Module API is working!');
});

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error(' MongoDB connection error:', err));

// Schema & Model
const trainingSchema = new mongoose.Schema({
  title: String,
  description: String,
  imageUrl: String,
  videoUrl: String,
});

const Training = mongoose.model('Training', trainingSchema);

// Multer config for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const upload = multer({ storage });

// Upload Route
app.post('/api/upload', upload.single('file'), (req, res) => {
  res.json({ filePath: `/uploads/${req.file.filename}` });
});

// Get All Trainings
app.get('/api/trainings', async (req, res) => {
  const trainings = await Training.find();
  res.json(trainings);
});

// Add Training
app.post('/api/trainings', async (req, res) => {
  const newTraining = new Training(req.body);
  await newTraining.save();
  res.json(newTraining);
});

// Delete Training
app.delete('/api/trainings/:id', async (req, res) => {
  await Training.findByIdAndDelete(req.params.id);
  res.sendStatus(200);
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(` Server running on port ${PORT}`);
});
