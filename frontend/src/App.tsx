import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, useNavigate } from 'react-router-dom';
import PickList from './pages/PickList.tsx';
import PackingList from './pages/PackingList.tsx';
import './App.css';

const App = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const navigate = useNavigate();

  const handleDateChange = (e: { target: { value: string } }): void => {
    const newDate = e.target.value;
    setSelectedDate(newDate);
    // Update the URL with the new date
    const currentPath = window.location.pathname;
    navigate(`${currentPath}?date=${newDate}`);
  };

  return (
    <div className="app-container">
      <nav className="nav-bar">
        <div className="nav-links">
          <Link to={`/pick-list?date=${selectedDate}`} className="nav-link">Pick List</Link>
          <Link to={`/packing-list?date=${selectedDate}`} className="nav-link">Packing List</Link>
        </div>
        <div className="date-selector">
          <input
            type="date"
            value={selectedDate}
            onChange={handleDateChange}
            className="date-input"
          />
        </div>
      </nav>
      <Routes>
        <Route path="/pick-list" element={<PickList />} />
        <Route path="/packing-list" element={<PackingList />} />
      </Routes>
    </div>
  );
};

// Wrap App with Router
const AppWithRouter = () => (
  <Router>
    <App />
  </Router>
);

export default AppWithRouter;
