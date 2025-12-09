import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../components/Header";
import { ClipboardCheck } from "lucide-react";

export default function CoursePage() {
  const navigate = useNavigate();
  const { id } = useParams(); 
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudents = async () => {
      const token = localStorage.getItem("access_token");
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const res = await fetch(
          `http://localhost:8000/api/students/courses/${id}/students/`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) throw new Error("Failed to fetch students");

        const data = await res.json();
        setStudents(data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, [id, navigate]);

const filteredStudents = students.filter((s) => {
  const name = s.name?.toString().toLowerCase() ?? "";
  const id = s.id?.toString().toLowerCase() ?? "";
  const fullId = s.fullId?.toString().toLowerCase() ?? "";

  const term = searchTerm.toLowerCase();
  return name.includes(term) || id.includes(term) || fullId.includes(term);
});


  const getGradeColor = (grade) => {
    if (grade === null || grade === undefined) return "text-gray-400";
    if (grade >= 4.5) return "text-green-600";
    if (grade >= 3.5) return "text-blue-600";
    if (grade >= 2.5) return "text-yellow-600";
    return "text-red-600";
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Present":
        return "text-green-600";
      case "Late":
        return "text-yellow-600";
      case "Absent":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  const calculateAttendanceRate = (attendance) => {
    if (!attendance?.length) return 0;
    const present = attendance.filter((a) => a.status === "Present").length;
    return ((present / attendance.length) * 100).toFixed(0);
  };

  if (loading)
    return <div className="text-center mt-20 text-gray-700">Loading students...</div>;

  return (
    <div>
      <Header userType="teacher" />
      <div className="min-h-screen bg-gray-50 flex justify-center items-start pt-24">
        <div className="w-full max-w-7xl mx-auto p-8">
          <div className="mb-6 flex items-center justify-start">
            <button
              onClick={() => navigate("/teacher")}
              className="bg-gray-600 text-white px-5 py-2 rounded-lg hover:bg-gray-700 transition-colors"
            >
              ← Back to Dashboard
            </button>
          </div>

          <h1 className="text-3xl font-bold text-gray-800 mb-2">Course</h1>
          <p className="text-gray-600 mb-6">
            Manage student Attendance and Grades.
          </p>

          <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Search by name or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-xl focus:border-purple-400 focus:outline-none w-64"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="bg-gray-500 text-white px-6 py-3 rounded-xl hover:bg-gray-600 transition-colors"
                >
                  Clear
                </button>
              )}
            </div>
            <button
              onClick={() => navigate(`/teacher/courses/${id}/attendance`)}
              className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-6 py-3 rounded-xl shadow text-lg transition-all duration-200 flex items-center gap-2"
            >
              <ClipboardCheck size={20} /> Take Attendance
            </button>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-6 mb-8 overflow-x-auto">
            <table className="w-full min-w-[600px]">
              <thead>
                <tr className="border-b-2 border-gray-100">
                  <th className="pb-4 text-left text-gray-500 font-semibold">Student Full Name</th>
                  <th className="pb-4 text-left text-gray-500 font-semibold">Student username</th>
                  <th className="pb-4 text-left text-gray-500 font-semibold">Grade /5</th>
                  <th className="pb-4 text-left text-gray-500 font-semibold">Attendance Rate</th>
                  <th className="pb-4 text-left text-gray-500 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.length > 0 ? (
                  filteredStudents.map((student, index) => (
                    <tr key={index} className="border-b border-gray-100 last:border-b-0">
                      <td className="py-4">{student.name || "--"}</td>
                      <td className="py-4">{student.fullId || "--"}</td>
                      <td className={`py-4 font-semibold ${getGradeColor(student.grade)}`}>
                        {student.grade?.toFixed(1) ?? "--"}
                      </td>
                      <td className="py-4">{calculateAttendanceRate(student.attendance)}%</td>
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
                      No students found matching your search.
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
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">{selectedStudent.name || "--"}</h2>
                  <p className="text-gray-600">Student ID: {selectedStudent.fullId || "--"}</p>
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
                  Current Grade:{" "}
                  <span className={getGradeColor(selectedStudent.grade)}>
                    {selectedStudent.grade?.toFixed(1) ?? "--"}/5
                  </span>
                </h3>
                <p className="text-gray-700 mb-2">
                  <strong>Attendance Rate:</strong>{" "}
                  {calculateAttendanceRate(selectedStudent.attendance)}%
                </p>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Attendance Status</h3>
                <div className="space-y-4">
                  {selectedStudent.attendance?.map((att, i) => (
                    <div
                      key={i}
                      className="border border-gray-200 rounded-lg p-4 flex justify-between items-center"
                    >
                      <span>{att.lecture || "--"}</span>
                      <span className={getStatusColor(att.status)}>{att.status || "--"}</span>
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
