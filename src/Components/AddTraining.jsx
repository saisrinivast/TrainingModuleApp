import React, { useState } from 'react';
import axios from 'axios';

const BASE_URL = 'https://training-backend.onrender.com';

function AddTraining() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !description) {
      alert("Please fill in all fields.");
      return;
    }

    let filePath = '';
    setLoading(true);

    try {
      // Upload file if present
      if (file) {
        const formData = new FormData();
        formData.append('file', file);
        const uploadRes = await axios.post(`${BASE_URL}/api/upload`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        filePath = uploadRes.data.filePath;
        console.log("Uploaded file path:", filePath);
      }

      // Create training object
      const newTraining = {
        title,
        description,
        imageUrl: file?.type?.startsWith('image') ? filePath : '',
        videoUrl: file?.type?.startsWith('video') ? filePath : '',
      };

      // Submit training data
      const res = await axios.post(`${BASE_URL}/api/trainings`, newTraining);
      console.log("Training added:", res.data);

      alert('Training added successfully!');
      setTitle('');
      setDescription('');
      setFile(null);
    } catch (err) {
      console.error("Failed to add training:", err.response?.data || err.message);
      alert('Failed to add training. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-training-container">
      <h2>Add New Training</h2>
      <form onSubmit={handleSubmit} className="add-training-form">
        <div>
          <label>Title:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Description:</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Upload File (optional):</label>
          <input
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
            accept="image/*,video/*"
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Adding...' : 'Add Training'}
        </button>
      </form>
    </div>
  );
}

export default AddTraining;
