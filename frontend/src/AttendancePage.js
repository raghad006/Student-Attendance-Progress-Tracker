import React from "react";
import { useNavigate } from "react-router-dom";
import './AttendancePage.css';

export default function AttendancePage() {
  const navigate = useNavigate();
  
  const students = [
    { id: 1, name: "Alex Johnson", present: false },
    { id: 2, name: "Brenda Smith", present: false },
    { id: 3, name: "Carlos Gomez", present: false },
    { id: 4, name: "Diana Prince", present: false },
    { id: 5, name: "Ethan Hunt", present: false }
  ];

  const [attendance, setAttendance] = React.useState(students);
  const [date, setDate] = React.useState(new Date().toISOString().split('T')[0]);

  const toggleAttendance = (studentId) => {
    setAttendance(prev => prev.map(student => 
      student.id === studentId ? { ...student, present: !student.present } : student
    ));
  };

  const presentCount = attendance.filter(student => student.present).length;
  const totalStudents = attendance.length;

  return (
    <div className="attendance-container">
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
          <a onClick={() => navigate('/dashboard')}>📊 Dashboard</a>
          <a>📚 Courses</a>
          <a className="active">👥 Take Attendance</a>
          <a>📈 Reports</a>
          <a>⚙️ Settings</a>
        </nav>
      </aside>

      <main className="main-content">
        <header className="header">
          <div>
            <h1>Take Attendance - Biology 101</h1>
            <p>Mark student attendance for today</p>
          </div>
          
          <div className="date-selector">
            <label>Date: </label>
            <input 
              type="date" 
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
        </header>

        <div className="attendance-summary">
          <div className="summary-card">
            <h3>Present</h3>
            <span className="count present">{presentCount}</span>
          </div>
          <div className="summary-card">
            <h3>Absent</h3>
            <span className="count absent">{totalStudents - presentCount}</span>
          </div>
          <div className="summary-card">
            <h3>Total</h3>
            <span className="count total">{totalStudents}</span>
          </div>
        </div>

        <div className="students-list">
          <h2>Students</h2>
          <div className="attendance-buttons">
            <button className="btn-mark-all" onClick={() => setAttendance(prev => prev.map(s => ({...s, present: true})))}>
              Mark All Present
            </button>
            <button className="btn-clear-all" onClick={() => setAttendance(prev => prev.map(s => ({...s, present: false})))}>
              Clear All
            </button>
          </div>
          
          <div className="students-grid">
            {attendance.map(student => (
              <div key={student.id} className="student-card">
                <div className="student-info">
                  <img src="https://via.placeholder.com/50" alt={student.name} />
                  <span>{student.name}</span>
                </div>
                <button 
                  className={`attendance-btn ${student.present ? 'present' : 'absent'}`}
                  onClick={() => toggleAttendance(student.id)}
                >
                  {student.present ? '✅ Present' : '❌ Absent'}
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="action-buttons">
          <button className="btn-cancel" onClick={() => navigate('/dashboard')}>
            Cancel
          </button>
          <button className="btn-save" onClick={() => alert('Attendance saved successfully!')}>
            Save Attendance
          </button>
        </div>
      </main>
    </div>
  );
}