import React, { useEffect, useState } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

const BASE_URL = 'https://training-backend.onrender.com';

function Home() {
  const [trainings, setTrainings] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    axios.get(`${BASE_URL}/api/trainings`)
      .then(res => setTrainings(res.data))
      .catch(err => console.error("Failed to fetch trainings:", err));
  }, []);

  const handleDelete = async id => {
    try {
      await axios.delete(`${BASE_URL}/api/trainings/${id}`);
      setTrainings(trainings.filter(t => t._id !== id));
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text('Training Modules', 10, 10);
    const rows = filteredTrainings.map(t => [t.title, t.description]);
    doc.autoTable({ head: [['Title', 'Description']], body: rows });
    doc.save('trainings.pdf');
  };

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(
      filteredTrainings.map(t => ({ Title: t.title, Description: t.description }))
    );
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Trainings');
    const buf = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    saveAs(new Blob([buf]), 'trainings.xlsx');
  };

  const handleDragStart = (e, index) => {
    e.dataTransfer.setData('index', index);
  };

  const handleDrop = (e, dropIndex) => {
    const dragIndex = e.dataTransfer.getData('index');
    const items = [...trainings];
    const [draggedItem] = items.splice(dragIndex, 1);
    items.splice(dropIndex, 0, draggedItem);
    setTrainings(items);
  };

  const handleDragOver = e => {
    e.preventDefault();
  };

  const filteredTrainings = trainings.filter(t =>
    t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <h1>Training Modules</h1>
      <input
        type="text"
        placeholder="Search trainings..."
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
      />

      <div className="export-buttons">
        <button onClick={exportToPDF}>Export PDF</button>
        <button onClick={exportToExcel}>Export Excel</button>
      </div>

      <ul>
        {filteredTrainings.map((t, index) => (
          <li
            key={t._id}
            draggable
            onDragStart={e => handleDragStart(e, index)}
            onDragOver={handleDragOver}
            onDrop={e => handleDrop(e, index)}
          >
            <h3>{t.title}</h3>
            <p>{t.description}</p>
            {t.imageUrl && (
              <img src={`${BASE_URL}${t.imageUrl}`} width="200" alt="Slide" />
            )}
            {t.videoUrl && (
              <video width="320" controls src={`${BASE_URL}${t.videoUrl}`} />
            )}
            <button onClick={() => handleDelete(t._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Home;
