import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from './Dashboard';
import BiologyPage from './BiologyPage';
import AttendancePage from './AttendancePage';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/biology" element={<BiologyPage />} />
          <Route path="/attendance" element={<AttendancePage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;