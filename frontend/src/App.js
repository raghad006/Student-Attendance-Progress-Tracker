import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import StudentDashboard from "./student/dashboard";
import Header from "./components/Header";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/student"
          element={
            <>
              <Header userType="student" />
              <StudentDashboard />
            </>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
