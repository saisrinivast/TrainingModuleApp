const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const multer = require('multer');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

dotenv.config();
const app = express();
const __dirname = path.resolve();

// 1. Trust proxy for correct protocol
app.set('trust proxy', 1);

// 2. Create uploads directory
const uploadDir = 'uploads';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// 3. CORS configuration
const allowedOrigins = [
  'https://training-module-app.vercel.app',
  'http://localhost:3000'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
}));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, uploadDir)));

// MongoDB Connection
mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ MongoDB connected'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// File Upload Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});
const upload = multer({ storage });

// Training Model
const trainingSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  videoUrl: String,
  imageUrl: String,
}, { timestamps: true });

const Training = mongoose.model('Training', trainingSchema);

// API Routes
app.get('/api/trainings', async (req, res) => {
  try {
    const trainings = await Training.find().sort({ createdAt: -1 });
    res.json(trainings);
  } catch (err) {
    console.error('GET trainings error:', err);
    res.status(500).json({ error: 'Failed to fetch trainings' });
  }
});

app.post('/api/trainings', upload.single('file'), async (req, res) => {
  try {
    const { title, description } = req.body;
    const file = req.file;
    const baseUrl = req.protocol + '://' + req.get('host');

    // Validate input
    if (!title || !description) {
      return res.status(400).json({ error: 'Title and description are required' });
    }

    const newTraining = new Training({
      title,
      description,
      ...(file && {
        [file.mimetype.startsWith('image') ? 'imageUrl' : 'videoUrl']: 
          `${baseUrl}/uploads/${file.filename}`
      })
    });

    const savedTraining = await newTraining.save();
    res.status(201).json({
      message: 'Training created successfully',
      training: savedTraining
    });
  } catch (err) {
    console.error('POST training error:', err);
    res.status(500).json({ error: 'Failed to create training' });
  }
});

// Start Server
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📁 Serving static files from: ${path.join(__dirname, uploadDir)}`);
});