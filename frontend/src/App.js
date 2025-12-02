import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Home from "./pages/Home";

import TeacherDashboard from "./Teacher/Dashboard";
import BiologyPage from "./Teacher/BiologyPage";
import AttendancePage from "./Teacher/AttendancePage";

import StudentDashboard from "./student/dashboard";
import Course from "./student/courses";
import Header from "./components/Header";


const PrivateRoute = ({ children, role }) => {
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    const user = JSON.parse(localStorage.getItem("user_profile"));

    if (token && user && (!role || user.role === role)) {
      setAuthorized(true);
    } else {
      setAuthorized(false);
    }
    setLoading(false);
  }, [role]);

  if (loading) return <div>Loading...</div>;

  return authorized ? children : <Navigate to="/login" replace />;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/teacher"
          element={
            <PrivateRoute role="TCR">
              <TeacherDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/teacher/biology"
          element={
            <PrivateRoute role="TCR">
              <BiologyPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/teacher/attendance"
          element={
            <PrivateRoute role="TCR">
              <AttendancePage />
            </PrivateRoute>
          }
        />
        <Route
          path="/student/dashboard"
          element={
            <PrivateRoute role="STD">
              <Header userType="student" />
              <StudentDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/student/courses/:id"
          element={
            <PrivateRoute role="STD">
              <Header userType="student" />
              <Course />
            </PrivateRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
