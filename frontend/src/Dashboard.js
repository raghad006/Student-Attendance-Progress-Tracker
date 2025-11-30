import React from "react";
import { useNavigate } from "react-router-dom";
import './Dashboard.css';

export default function Dashboard() {
  const navigate = useNavigate();
  
  console.log('Dashboard component rendered');

  const handleBiologyClick = () => {
    console.log('=== BIOLOGY BUTTON CLICKED ===');
    navigate('/biology');
  };

  const handleAttendanceClick = () => {
    console.log('=== ATTENDANCE BUTTON CLICKED ===');
    navigate('/attendance');
  };

  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <h2 className="logo">📘 Attendify</h2>

        <div className="profile">
          <img src="https://via.placeholder.com/60" alt="Profile" />
          <div>
            <h4>Maria Garcia</h4>
            <p>Teacher</p>
          </div>
        </div>

        <nav className="menu">
          <a className="active" onClick={() => navigate('/dashboard')}>📊 Dashboard</a>
          <a>📚 Courses</a>
          <a>👥 Students</a>
          <a>📈 Reports</a>
          <a>⚙️ Settings</a>
        </nav>
      </aside>

      <main className="main-content">
        <header className="header">
          <div>
            <h1>Welcome, Maria!</h1>
            <p>Here is your summary for today.</p>
          </div>

          <div className="search-bar">
            <input type="text" placeholder="🔍 Search..." />
          </div>
        </header>

        <section className="courses">
          <h2>My Courses</h2>

          <div className="course-grid">
            <div className="course-card">
              <div className="course-img green"></div>
              <h3>Introduction to Algebra</h3>
              <p>28 Students</p>
              <button>View</button>
            </div>

            <div className="course-card">
              <div className="course-img lime"></div>
              <h3>Biology 101</h3>
              <p>32 Students</p>
              <button onClick={handleBiologyClick}>View</button>
            </div>
          </div>
        </section>

        <section className="quick-actions">
          <h2>Quick Actions</h2>

          <div className="actions-grid">
            <button className="action pink" onClick={handleAttendanceClick}>🗓️ Take Attendance</button>
            <button className="action">📊 View Reports</button>
            <button className="action">➕ Manage Students</button>
          </div>
        </section>
      </main>

      <aside className="attendance-box">
        <h3>Today's Attendance Overview</h3>

        <div className="circle">95%<br />Present</div>

        <div className="stats">
          <p>🟣 Present — 57 Students</p>
          <p>⚪ Absent — 3 Students</p>
        </div>
      </aside>
    </div>
  );
}