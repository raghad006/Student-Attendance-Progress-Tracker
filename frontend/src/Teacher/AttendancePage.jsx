import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { ChevronDown, X, Calendar, CheckCircle, XCircle, Clock } from "lucide-react";
import Header from "../components/Header";

const AttendancePage = () => {
  const { id: courseId } = useParams();
  const navigate = useNavigate();

  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [openDropdownIndex, setOpenDropdownIndex] = useState(null);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const [studentTimelines, setStudentTimelines] = useState([]);
  const [selectedStudentTimeline, setSelectedStudentTimeline] = useState(null);
  const [isTimelineModalOpen, setIsTimelineModalOpen] = useState(false);

  const attendanceOptions = ["Present", "Absent", "Late"];

  
  useEffect(() => {
    const fetchStudentsAndAttendance = async () => {
      try {
        
        const response = await axios.get(
          `http://localhost:8000/api/students/courses/${courseId}/students/`,
          {
            headers: { Authorization: `Bearer ${localStorage.getItem("access_token")}` },
          }
        );

        const studentsList = response.data.map((s) => ({
          id: s.id,
          name: s.name,
          attendance: "Absent",
          note: "",
        }));

        setStudents(studentsList);

        
        const attendanceResponse = await axios.get(
          `http://localhost:8000/api/attendance/stats/${courseId}/`,
          {
            headers: { Authorization: `Bearer ${localStorage.getItem("access_token")}` },
          }
        );

        const attendanceData = attendanceResponse.data;

        
        const updatedStudents = studentsList.map((student) => {
          const studentRecord = attendanceData.find((s) => s.id === student.id);
          if (studentRecord) {
            const recordForDate = studentRecord.timeline.find(
              (r) => r.date === selectedDate
            );
            if (recordForDate) {
              return {
                ...student,
                attendance: recordForDate.status,
                note: recordForDate.notes || "",
              };
            }
          }
          return student;
        });

        setStudents(updatedStudents);
        setStudentTimelines(attendanceData); 
      } catch (error) {
        console.error(error);
        alert("Failed to fetch students or attendance");
      }
    };

    fetchStudentsAndAttendance();
  }, [courseId, selectedDate]);

  
  const handleAttendanceChange = (index, value) => {
    const updated = [...students];
    updated[index].attendance = value;
    setStudents(updated);
    setOpenDropdownIndex(null);
  };

  const handleNoteChange = (index, value) => {
    const updated = [...students];
    updated[index].note = value;
    setStudents(updated);
  };

  const handleMarkAllPresent = () => {
    setStudents(
      students.map((student) => ({ ...student, attendance: "Present" }))
    );
  };

  const handleSaveAttendance = async () => {
    try {
      const payload = {
        course_id: courseId,
        date: selectedDate,
        records: students.map((s) => ({
          student_id: s.id,
          status: s.attendance,
          note: s.note,
        })),
      };

      await axios.post("http://localhost:8000/api/attendance/take/", payload, {
        headers: { Authorization: `Bearer ${localStorage.getItem("access_token")}` },
      });

      alert(`Attendance saved for ${selectedDate}`);
    } catch (error) {
      console.error(error);
      alert("Failed to save attendance!");
    }
  };

  const handleViewTimeline = (studentId) => {
    const student = studentTimelines.find((s) => s.id === studentId);
    if (student) {
      setSelectedStudentTimeline(student);
      setIsTimelineModalOpen(true);
    }
  };

  const closeTimelineModal = () => {
    setIsTimelineModalOpen(false);
    setSelectedStudentTimeline(null);
  };

  const filteredStudents = students.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase())
  );

  const getAttendanceColor = (status) => {
    switch (status) {
      case "Present":
        return "bg-green-100 text-green-800 hover:bg-green-200";
      case "Late":
        return "bg-blue-100 text-blue-800 hover:bg-blue-200";
      default:
        return "bg-red-100 text-red-800 hover:bg-red-200";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Present":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "Absent":
        return <XCircle className="w-4 h-4 text-red-600" />;
      case "Late":
        return <Clock className="w-4 h-4 text-yellow-600" />;
      default:
        return null;
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric"
    });
  };

  
  const calculateAttendanceStats = (timeline) => {
    const total = timeline.length;
    const present = timeline.filter(item => item.status === "Present").length;
    const absent = timeline.filter(item => item.status === "Absent").length;
    const late = timeline.filter(item => item.status === "Late").length;
    
    return {
      total,
      present,
      absent,
      late,
      presentPercentage: total > 0 ? Math.round((present / total) * 100) : 0
    };
  };

  return (
    <div>
      <Header userType="teacher" />
      <div className="p-10 w-full max-w-7xl mx-auto bg-gray-50 min-h-screen mt-24">
        <div className="bg-white rounded-3xl shadow-lg p-8 overflow-visible relative">
          
          <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
            <h1 className="text-3xl font-extrabold text-gray-800">Attendance</h1>

            <div className="flex items-center gap-4">
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="pl-10 pr-4 py-2 rounded-xl border border-gray-300"
                />
              </div>
              <input
                type="text"
                placeholder="Search student..."
                className="px-4 py-2 bg-gray-100 rounded-xl"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          
          <div className="flex justify-end gap-4 mb-6">
            <button
              onClick={handleMarkAllPresent}
              className="bg-green-100 text-green-800 px-4 py-2 rounded-xl hover:bg-green-200 transition-colors"
            >
              Mark All Present
            </button>

            <button
              onClick={handleSaveAttendance}
              className="bg-green-600 text-white px-6 py-2 rounded-xl hover:bg-green-700 transition-colors"
            >
              Save Attendance
            </button>

            <button
              onClick={() => navigate(`/teacher`)}
              className="bg-gray-100 text-gray-800 px-4 py-2 rounded-xl hover:bg-gray-200 transition-colors"
            >
              Back to course
            </button>
          </div>

          
          <div className="rounded-2xl border border-gray-200 overflow-visible">
            <table className="w-full text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-3 text-left">ID</th>
                  <th className="p-3 text-left">Student</th>
                  <th className="p-3 text-left">Attendance</th>
                  <th className="p-3 text-left">Note</th>
                  <th className="p-3 text-left">View Timeline</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((student, index) => (
                  <tr key={student.id} className="hover:bg-gray-50">
                    <td className="p-3">{student.id}</td>
                    <td className="p-3 font-medium">{student.name}</td>

                    <td className="p-3 relative">
                      <button
                        onClick={() =>
                          setOpenDropdownIndex(
                            openDropdownIndex === index ? null : index
                          )
                        }
                        className={`w-36 px-4 py-2 rounded-full flex justify-between items-center ${getAttendanceColor(
                          student.attendance
                        )}`}
                      >
                        <span className="flex items-center gap-2">
                          {getStatusIcon(student.attendance)}
                          {student.attendance}
                        </span>
                        <ChevronDown size={16} />
                      </button>

                      {openDropdownIndex === index && (
                        <div className="absolute top-full mt-2 w-36 bg-white rounded-xl shadow-lg border z-50">
                          {attendanceOptions.map((option) => (
                            <button
                              key={option}
                              className="flex items-center gap-2 w-full text-left px-4 py-2 hover:bg-gray-100"
                              onClick={() => handleAttendanceChange(index, option)}
                            >
                              {getStatusIcon(option)}
                              {option}
                            </button>
                          ))}
                        </div>
                      )}
                    </td>

                    <td className="p-3">
                      <input
                        type="text"
                        placeholder="Add note..."
                        className="w-full px-3 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        value={student.note}
                        onChange={(e) => handleNoteChange(index, e.target.value)}
                      />
                    </td>

                    <td className="p-3">
                      <button
                        onClick={() => handleViewTimeline(student.id)}
                        className="bg-blue-100 text-blue-800 px-4 py-2 rounded-xl hover:bg-blue-200 transition-colors flex items-center gap-2"
                      >
                        <Calendar className="w-4 h-4" />
                        View Timeline
                      </button>
                    </td>
                  </tr>
                ))}

                {filteredStudents.length === 0 && (
                  <tr>
                    <td colSpan="5" className="text-center py-6 text-gray-500">
                      No students found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      
      {isTimelineModalOpen && selectedStudentTimeline && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden">
           
            <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-6 text-white">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold">{selectedStudentTimeline.name}</h2>
                  <p className="text-blue-100">Student ID: {selectedStudentTimeline.id}</p>
                </div>
                <button
                  onClick={closeTimelineModal}
                  className="p-2 hover:bg-blue-700 rounded-full transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              
              {selectedStudentTimeline.timeline && (
                <div className="mt-4 grid grid-cols-4 gap-2">
                  <div className="bg-blue-500 bg-opacity-30 p-3 rounded-lg">
                    <div className="text-2xl font-bold">
                      {calculateAttendanceStats(selectedStudentTimeline.timeline).total}
                    </div>
                    <div className="text-sm text-blue-100">Total Days</div>
                  </div>
                  <div className="bg-green-500 bg-opacity-30 p-3 rounded-lg">
                    <div className="text-2xl font-bold">
                      {calculateAttendanceStats(selectedStudentTimeline.timeline).present}
                    </div>
                    <div className="text-sm text-green-100">Present</div>
                  </div>
                  <div className="bg-red-500 bg-opacity-30 p-3 rounded-lg">
                    <div className="text-2xl font-bold">
                      {calculateAttendanceStats(selectedStudentTimeline.timeline).absent}
                    </div>
                    <div className="text-sm text-red-100">Absent</div>
                  </div>
                  <div className="bg-yellow-500 bg-opacity-30 p-3 rounded-lg">
                    <div className="text-2xl font-bold">
                      {calculateAttendanceStats(selectedStudentTimeline.timeline).presentPercentage}%
                    </div>
                    <div className="text-sm text-yellow-100">Attendance %</div>
                  </div>
                </div>
              )}
            </div>

            
            <div className="p-6 overflow-y-auto max-h-[50vh]">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Attendance History
              </h3>
              
              {selectedStudentTimeline.timeline && selectedStudentTimeline.timeline.length > 0 ? (
                <div className="space-y-3">
                  {[...selectedStudentTimeline.timeline]
                    .sort((a, b) => new Date(b.date) - new Date(a.date)) // Sort by date descending
                    .map((entry, index) => (
                      <div
                        key={index}
                        className={`flex items-center justify-between p-4 rounded-xl border ${
                          entry.date === selectedDate ? "border-blue-300 bg-blue-50" : "border-gray-200"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          {getStatusIcon(entry.status)}
                          <div>
                            <div className="font-medium text-gray-900">
                              {formatDate(entry.date)}
                              {entry.date === selectedDate && (
                                <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                                  Today
                                </span>
                              )}
                            </div>
                            {entry.notes && (
                              <div className="text-sm text-gray-600 mt-1">
                                Note: {entry.notes}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                            entry.status === "Present"
                              ? "bg-green-100 text-green-800"
                              : entry.status === "Absent"
                              ? "bg-red-100 text-red-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}>
                            {entry.status}
                          </span>
                        </div>
                      </div>
                    ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Calendar className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                  <p>No attendance records found for this student</p>
                </div>
              )}
            </div>

            
            <div className="border-t px-6 py-4 bg-gray-50 flex justify-end">
              <button
                onClick={closeTimelineModal}
                className="px-6 py-2 bg-gray-200 text-gray-800 rounded-xl hover:bg-gray-300 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AttendancePage;