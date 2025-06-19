import React, { useEffect, useState } from 'react';
import axios from 'axios';

const BASE_URL = process.env.REACT_APP_BASE_URL;

const Home = () => {
  const [trainings, setTrainings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTrainings = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/trainings`);
        
        // Ensure we have an array before setting state
        if (Array.isArray(res.data)) {
          setTrainings(res.data);
        } else {
          console.error('API response is not an array:', res.data);
          setTrainings([]);
        }
      } catch (err) {
        console.error('Failed to fetch trainings:', err);
        setError('Failed to load trainings. Please try again later.');
        setTrainings([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchTrainings();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-xl">Loading trainings...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Training Modules</h1>
      
      {trainings.length === 0 ? (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
          No training modules available yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trainings.map((t) => (
            <div key={t._id} className="bg-white rounded-lg shadow-md overflow-hidden">
              {t.imageUrl && (
                <div className="w-full h-48 overflow-hidden">
                  <img 
                    src={t.imageUrl}
                    alt={t.title} 
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="p-4">
                <h2 className="text-xl font-semibold mb-2">{t.title}</h2>
                <p className="text-gray-700">{t.description}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;