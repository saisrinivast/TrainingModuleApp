const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const multer = require('multer');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const app = express();

// CORS Setup
const allowedOrigins = [
  'https://training-module-k6kn8821v-sai-srinivas-ts-projects.vercel.app',
  'http://localhost:3000'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.error('Blocked by CORS:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: false
}));

app.options('*', cors());

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// MongoDB Connection
mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// File Upload Setup
const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});
const upload = multer({ storage });

// Mongoose Schema and Model
const trainingSchema = new mongoose.Schema({
  title: String,
  description: String,
  imageUrl: String,
  videoUrl: String
});
const Training = mongoose.model('Training', trainingSchema);

// Routes
app.get('/api/ping', (req, res) => {
  res.json({ message: 'pong from backend' });
});

app.get('/api/trainings', async (req, res) => {
  try {
    const trainings = await Training.find();
    res.json(trainings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch trainings' });
  }
});

app.post('/api/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const filePath = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
  res.status(200).json({ filePath });
});

app.post('/api/trainings', async (req, res) => {
  try {
    const { title, description, imageUrl, videoUrl } = req.body;

    const training = new Training({
      title,
      description,
      imageUrl: imageUrl || '',
      videoUrl: videoUrl || ''
    });

    await training.save();
    res.status(201).json({ message: 'Training added successfully', training });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to add training' });
  }
});

// Start Server
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
