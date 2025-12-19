import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";

import TeacherDashboard from "./Teacher/Dashboard";
import AttendancePage from "./Teacher/AttendancePage";

import StudentDashboard from "./student/dashboard";
import Course from "./student/courses";
import Header from "./components/Header";

const PrivateRoute = ({ children, role }) => {
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    const userProfile = JSON.parse(localStorage.getItem("user_profile"));
    setUser(userProfile);

    if (token && userProfile && (!role || userProfile.role === role)) {
      setAuthorized(true);
    } else {
      setAuthorized(false);
    }
    setLoading(false);
  }, [role]);

  if (loading) return <div>Loading...</div>;
  if (!authorized) return <Navigate to="/login" replace />;

  return (
    <>
      <Header userType={user?.role === "TCR" ? "teacher" : "student"} />
      {children}
    </>
  );
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
          path="/teacher/courses/:id/attendance"
          element={
            <PrivateRoute role="TCR">
              <AttendancePage />
            </PrivateRoute>
          }
        />

        <Route
          path="/student/dashboard"
          element={
            <PrivateRoute role="STU">
              <StudentDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/student/courses/:id"
          element={
            <PrivateRoute role="STU">
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
