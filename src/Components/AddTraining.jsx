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
      }

      const newTraining = {
        title,
        description,
        imageUrl: file?.type.startsWith('image') ? filePath : '',
        videoUrl: file?.type.startsWith('video') ? filePath : ''
      };

      await axios.post(`${BASE_URL}/api/trainings`, newTraining);
      setTitle('');
      setDescription('');
      setFile(null);
      alert("Training added!");
    } catch (err) {
      console.error("Upload or Save failed:", err);
      alert("Failed to add training. Please try again.");
    }
  };

  return (
    <div>
      <h1>Add Training</h1>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <input
          type="text"
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="Title"
          required
        />
        <textarea
          value={description}
          onChange={e => setDescription(e.target.value)}
          placeholder="Description"
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
