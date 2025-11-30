import React from "react";
import { useNavigate } from "react-router-dom";
import './BiologyPage.css';

export default function BiologyPage() {
  const navigate = useNavigate();
  
  const students = [
    {
      name: "Alex Johnson",
      id: "ID-98765",
      status: "Present",
      grade: "A-",
      note: "Active participant in class.",
      avatar: "https://via.placeholder.com/40"
    },
    {
      name: "Brenda Smith",
      id: "ID-98764",
      status: "Absent",
      grade: "B+",
      note: "Add note...",
      avatar: "https://via.placeholder.com/40"
    },
    {
      name: "Carlos Gomez",
      id: "ID-98763",
      status: "Late",
      grade: "B",
      note: "Arrived 10 minutes late.",
      avatar: "https://via.placeholder.com/40"
    },
    {
      name: "Diana Prince",
      id: "ID-98762",
      status: "Present",
      grade: "A",
      note: "Excellent work on lab.",
      avatar: "https://via.placeholder.com/40"
    },
    {
      name: "Ethan Hunt",
      id: "ID-98761",
      status: "Excused",
      grade: "C+",
      note: "Doctor's appointment.",
      avatar: "https://via.placeholder.com/40"
    }
  ];

  return (
    <div className="container">
      <aside className="sidebar">
        <h2 className="logo">🎓 EduTrack</h2>
        <nav className="menu">
            <a onClick={() => navigate('/dashboard')}>📊 Dashboard</a>
            <a className="active">📘 Courses</a>
            <a>📈 Reports</a>
            <a>⚙️ Settings</a>
        </nav>

        <div className="profile">
          <img src="https://via.placeholder.com/55" alt="profile" />
          <div>
            <h4>Mr. Harrison</h4>
            <p>Science Dept.</p>
          </div>
        </div>

        <button className="logout">⬅️ Log Out</button>
      </aside>

      <main className="main">
        <header className="header">
          <div>
            <h1>Biology 101 - Fall 2024</h1>
            <p>Manage attendance, grades, and notes for your students.</p>
          </div>

          <button className="export">⤓ Export Data</button>
        </header>

        <div className="controls">
          <input className="search" placeholder="🔍 Search by name or ID..." />
          <input className="date" type="date" />
          <button className="add">➕ Add Attendance Record</button>
        </div>

        <table className="students-table">
          <thead>
            <tr>
              <th></th>
              <th>Student Name</th>
              <th>Student ID</th>
              <th>Attendance Status</th>
              <th>Overall Grade</th>
              <th>Notes</th>
            </tr>
          </thead>

          <tbody>
            {students.map((student, index) => (
              <tr key={index}>
                <td><input type="radio" /></td>
                <td className="student-info">
                  <img src={student.avatar} alt={student.name} />
                  <span>{student.name}</span>
                </td>
                <td>{student.id}</td>
                <td>
                  <span className={`badge ${student.status.toLowerCase()}`}>
                    {student.status}
                  </span>
                </td>
                <td><span className="grade">{student.grade}</span></td>
                <td><input className="note" defaultValue={student.note} /></td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="actions">
          <button className="discard">Discard</button>
          <button className="save">Save Changes</button>
        </div>
      </main>
    </div>
  );
}