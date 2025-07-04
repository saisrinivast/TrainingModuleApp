const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const multer = require('multer');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const app = express();

//  CORS Setup 
app.use(
  cors({
    origin: 'https://training-module-app.vercel.app', // your Vercel frontend
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: false, // true only if you're sending cookies or auth headers
  })
);

app.options('*', cors());

//  Middleware 
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// MongoDB Connection 
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// File Upload Setup 
const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage });

//  Mongoose Schema 
const trainingSchema = new mongoose.Schema({
  title: String,
  description: String,
  videoUrl: String,
  imageUrl: String,
});
const Training = mongoose.model('Training', trainingSchema);

// Routes 
app.get('/api/ping', (req, res) => {
  res.json({ message: 'pong from backend' });
});

// GET all trainings
app.get('/api/trainings', async (req, res) => {
  try {
    const trainings = await Training.find();
    res.json(trainings);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch trainings' });
  }
});

// POST a new training
app.post('/api/trainings', upload.single('file'), async (req, res) => {
  try {
    const { title, description } = req.body;
    const file = req.file;

    const training = new Training({
      title,
      description,
      imageUrl:
        file?.mimetype.startsWith('image')
          ? `${req.protocol}://${req.get('host')}/uploads/${file.filename}`
          : '',
      videoUrl:
        file?.mimetype.startsWith('video')
          ? `${req.protocol}://${req.get('host')}/uploads/${file.filename}`
          : '',
    });

    await training.save();
    res
      .status(201)
      .json({ message: 'Training added successfully', training });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to add training' });
  }
});

// === Start Server ===
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
