import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import { ClipboardCheck } from "lucide-react";

export default function BiologyPage() {
  const navigate = useNavigate();
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const students = [
    {
      name: "Diana Prince",
      id: "ID-98762",
      grade: 4.8,
      avatar: "",
      fullId: "987654324",
      course: "Biology 101",
      attendance: [
        { lecture: "Lecture 1: Introduction to Biology", date: "2024-09-02", status: "Present" },
        { lecture: "Lecture 2: Cell Structure", date: "2024-09-09", status: "Present" },
        { lecture: "Lecture 3: Genetics", date: "2024-09-16", status: "Present" }
      ]
    },
    {
      name: "Malak Wael",
      id: "ID-98761",
      grade: 2.7,
      avatar: "",
      fullId: "987654325",
      course: "Biology 101",
      attendance: [
        { lecture: "Lecture 1: Introduction to Biology", date: "2024-09-02", status: "Absent" },
        { lecture: "Lecture 2: Cell Structure", date: "2024-09-09", status: "Present" },
        { lecture: "Lecture 3: Genetics", date: "2024-09-16", status: "Absent" }
      ]
    },
    {
      name: "Ethan Hunt",
      id: "ID-98760",
      grade: 3.9,
      avatar: "",
      fullId: "987654326",
      course: "Biology 101",
      attendance: [
        { lecture: "Lecture 1: Introduction to Biology", date: "2024-09-02", status: "Present" },
        { lecture: "Lecture 2: Cell Structure", date: "2024-09-09", status: "Late" },
        { lecture: "Lecture 3: Genetics", date: "2024-09-16", status: "Present" }
      ]
    },
    {
      name: "Fatima Ali",
      id: "ID-98759",
      grade: 4.5,
      avatar: "",
      fullId: "987654327",
      course: "Biology 101",
      attendance: [
        { lecture: "Lecture 1: Introduction to Biology", date: "2024-09-02", status: "Present" },
        { lecture: "Lecture 2: Cell Structure", date: "2024-09-09", status: "Present" },
        { lecture: "Lecture 3: Genetics", date: "2024-09-16", status: "Present" }
      ]
    },
    {
      name: "Alex Johnson",
      id: "ID-98758",
      grade: 3.3,
      avatar: "",
      fullId: "987654328",
      course: "Biology 101",
      attendance: [
        { lecture: "Lecture 1: Introduction to Biology", date: "2024-09-02", status: "Late" },
        { lecture: "Lecture 2: Cell Structure", date: "2024-09-09", status: "Present" },
        { lecture: "Lecture 3: Genetics", date: "2024-09-16", status: "Present" }
      ]
    },
    {
      name: "Brenda Smith",
      id: "ID-98757",
      grade: 4.0,
      avatar: "",
      fullId: "987654329",
      course: "Biology 101",
      attendance: [
        { lecture: "Lecture 1: Introduction to Biology", date: "2024-09-02", status: "Present" },
        { lecture: "Lecture 2: Cell Structure", date: "2024-09-09", status: "Present" },
        { lecture: "Lecture 3: Genetics", date: "2024-09-16", status: "Late" }
      ]
    }
  ];

  const filteredStudents = students.filter(student => 
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.fullId.includes(searchTerm)
  );

  const getGradeColor = grade => {
    if (grade >= 4.5) return "text-green-600";
    if (grade >= 3.5) return "text-blue-600";
    if (grade >= 2.5) return "text-yellow-600";
    return "text-red-600";
  };

  const getStatusColor = status => {
    switch(status) {
      case "Present": return "text-green-600";
      case "Late": return "text-yellow-600";
      case "Absent": return "text-red-600";
      default: return "text-gray-600";
    }
  };

  const calculateAttendanceRate = attendance => {
    const total = attendance.length;
    const present = attendance.filter(a => a.status === "Present").length;
    return ((present / total) * 100).toFixed(0);
  };

  const handleSearchChange = e => setSearchTerm(e.target.value);
  const clearSearch = () => setSearchTerm("");

  return (
    <div>
      <Header userType="teacher" />
      <div className="min-h-screen bg-gray-50 flex justify-center items-start pt-24">
        <div className="w-full max-w-7xl mx-auto p-8">
          <div className="mb-6 flex items-center justify-start">
            <button 
              onClick={() => navigate('/teacher')}
              className="bg-gray-600 text-white px-5 py-2 rounded-lg hover:bg-gray-700 transition-colors"
            >
              ← Back to Dashboard
            </button>
          </div>

          <h1 className="text-3xl font-bold text-gray-800 mb-2">Biology 101 - Fall 2024</h1>
          <p className="text-gray-600 mb-6">Manage student grades and notes.</p>

          <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <input 
                type="text" 
                placeholder="Search by name or ID..." 
                value={searchTerm}
                onChange={handleSearchChange}
                className="px-4 py-3 border border-gray-300 rounded-xl focus:border-purple-400 focus:outline-none w-64"
              />
              {searchTerm && (
                <button 
                  onClick={clearSearch}
                  className="bg-gray-500 text-white px-6 py-3 rounded-xl hover:bg-gray-600 transition-colors"
                >
                  Clear
                </button>
              )}
            </div>
            <button
              onClick={() => navigate('/attendance')}
              className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-6 py-3 rounded-xl shadow text-lg transition-all duration-200 flex items-center gap-2"
            >
              <ClipboardCheck size={20} />
              Take Attendance
            </button>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-100">
                  <th className="pb-4 text-left text-gray-500 font-semibold">Student Name</th>
                  <th className="pb-4 text-left text-gray-500 font-semibold">Student ID</th>
                  <th className="pb-4 text-left text-gray-500 font-semibold">Grade /5</th>
                  <th className="pb-4 text-left text-gray-500 font-semibold">Notes</th>
                  <th className="pb-4 text-left text-gray-500 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.length > 0 ? (
                  filteredStudents.map((student, index) => (
                    <tr key={index} className="border-b border-gray-100 last:border-b-0">
                      <td className="py-4 flex items-center gap-3">
                        <img 
                          src={student.avatar || "/user.png"} 
                          alt={student.name}
                          className="w-10 h-10 rounded-full"
                        />
                        <span className="font-medium">{student.name}</span>
                      </td>
                      <td className="py-4 text-gray-700">{student.id}</td>
                      <td className="py-4">
                        <span className={`text-xl font-bold ${getGradeColor(student.grade)}`}>
                          {student.grade.toFixed(1)}
                        </span>
                        <span className="text-sm text-gray-500 ml-1">/5</span>
                      </td>
                      <td className="py-4">
                        <input 
                          type="text" 
                          defaultValue={student.note}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-purple-400 focus:outline-none"
                        />
                      </td>
                      <td className="py-4">
                        <button 
                          onClick={() => setSelectedStudent(student)}
                          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors text-sm"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="py-8 text-center text-gray-500">
                      No students found matching your search criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {selectedStudent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-8">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">
                    {selectedStudent.name}
                  </h2>
                  <p className="text-gray-600">
                    Student ID: {selectedStudent.fullId} | Course: {selectedStudent.course}
                  </p>
                </div>
                <button 
                  onClick={() => setSelectedStudent(null)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>

              <div className="mb-8">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  Current Grade: <span className={getGradeColor(selectedStudent.grade)}>
                    {selectedStudent.grade.toFixed(1)}/5
                  </span>
                </h3>
                <p className="text-gray-700 mb-2">
                  <strong>Notes:</strong> {selectedStudent.note}
                </p>
                <p className="text-gray-700">
                  <strong>Attendance Rate:</strong> {calculateAttendanceRate(selectedStudent.attendance)}%
                </p>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  Attendance Status
                </h3>
                <div className="space-y-4">
                  {selectedStudent.attendance.map((attendance, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-semibold text-gray-800">{attendance.lecture}</h4>
                        <span className={`font-medium ${getStatusColor(attendance.status)}`}>
                          {attendance.status}
                        </span>
                      </div>
                      <p className="text-gray-600">Date: {attendance.date}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-4 mt-8">
                <button 
                  onClick={() => setSelectedStudent(null)}
                  className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
