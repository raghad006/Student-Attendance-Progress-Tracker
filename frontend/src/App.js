import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Home from "./pages/Home";
import TeacherDashboard from "./Teacher/Dashboard";
import BiologyPage from "./Teacher/BiologyPage";
import AttendancePage from "./Teacher/AttendancePage";

const PrivateRoute = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    const user = JSON.parse(localStorage.getItem("user_profile"));

    if (token && user && user.role === "TCR") {
      setAuthorized(true);
    } else {
      setAuthorized(false);
    }
    setLoading(false);
  }, []);

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
            <PrivateRoute>
              <TeacherDashboard />
            </PrivateRoute>
          }
        />

        <Route
          path="/biology"
          element={
            <PrivateRoute>
              <BiologyPage />
            </PrivateRoute>
          }
        />

        <Route
          path="/attendance"
          element={
            <PrivateRoute>
              <AttendancePage />
            </PrivateRoute>
          }
        />

        <Route path="*" element={<Navigate to="/teacher" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
