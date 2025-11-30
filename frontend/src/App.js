import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from './Teacher/Dashboard';
import BiologyPage from './Teacher/BiologyPage';
import AttendancePage from './Teacher/AttendancePage';
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