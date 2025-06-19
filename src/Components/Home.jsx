import React, { useEffect, useState } from 'react';
import axios from 'axios';

const BASE_URL = process.env.REACT_APP_BASE_URL;

const Home = () => {
  const [trainings, setTrainings] = useState([]);

  useEffect(() => {
    const fetchTrainings = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/trainings`);
        setTrainings(res.data);
      } catch (err) {
        console.error('Fetch trainings error:', err.response?.data || err.message);
      }
    };
    fetchTrainings();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Training Modules</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {trainings.map((t) => (
          <div key={t._id} className="bg-white rounded-lg shadow-md overflow-hidden">
            {t.imageUrl && (
              <img 
                src={t.imageUrl}
                alt={t.title}
                className="w-full h-48 object-cover"
              />
            )}
            <div className="p-4">
              <h2 className="text-xl font-semibold mb-2">{t.title}</h2>
              <p className="text-gray-700">{t.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;