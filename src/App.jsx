import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import Home from './Components/Home';
import AddTraining from './Components/AddTraining';

function App() {
  return (
    <div className="App">
      <nav className="nav">
        <Link to="/">Home</Link>
        <Link to="/add"> Add Training</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/add" element={<AddTraining />} />
      </Routes>
    </div>
  );
}

export default App;
