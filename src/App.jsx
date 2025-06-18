import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import Home from "./Home"
import AddTraining from './AddTraining';

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
