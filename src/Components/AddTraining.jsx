import React, { useState } from 'react';
import axios from 'axios';

const BASE_URL = 'https://training-backend.onrender.com';

function AddTraining() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState(null);

  const handleSubmit = async e => {
    e.preventDefault();
    let filePath = '';

    try {
      if (file) {
        const formData = new FormData();
        formData.append('file', file);
        const uploadRes = await axios.post(`${BASE_URL}/api/upload`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });

        filePath = uploadRes.data.filePath;
        console.log("📂 Uploaded file path:", filePath);
      }

      console.log("📁 File type:", file?.type);

      const newTraining = {
        title,
        description,
        imageUrl: file?.type?.startsWith('image') ? filePath : '',
        videoUrl: file?.type?.startsWith('video') ? filePath : ''
      };

      console.log("🚀 Sending training data:", newTraining);

      const res = await axios.post(`${BASE_URL}/api/trainings`, newTraining);
      console.log("✅ Training added:", res.data);

      setTitle('');
      setDescription('');
      setFile(null);
      alert('✅ Training added successfully!');
    } catch (err) {
      console.error("❌ Failed to add training:", err.response?.data || err.message);
      alert('❌ Failed to add training. Please try again.');
    }
  };

  return (
    <div className="add-training">
      <h2>Add Training</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter title"
          value={title}
          onChange={e => setTitle(e.target.value)}
          required
        />
        <textarea
          placeholder="Enter description"
          value={description}
          onChange={e => setDescription(e.target.value)}
          required
        />
        <input
          type="file"
          accept="image/*,video/*"
          onChange={e => setFile(e.target.files[0])}
        />
        <button type="submit">Add Training</button>
      </form>
    </div>
  );
}

export default AddTraining;
