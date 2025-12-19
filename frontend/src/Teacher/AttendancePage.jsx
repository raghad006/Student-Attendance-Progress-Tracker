import React, { useState, useEffect, useCallback } from "react";
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
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState("");

  const statusMap = {
    "Present": "P",
    "Absent": "A", 
    "Late": "L"
  };

  const attendanceOptions = ["Present", "Absent", "Late"];

  const getToken = () => {
    return localStorage.getItem("access_token");
  };

  const fetchStudentsAndAttendance = useCallback(async () => {
    try {
      setIsLoading(true);
      const token = getToken();
      
      if (!token) {
        navigate("/login");
        return;
      }

      const studentsResponse = await axios.get(
        `http://localhost:8000/api/students/courses/${courseId}/students/`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const studentsList = studentsResponse.data.map((s) => ({
        id: s.id,
        name: s.name,
        attendance: "Absent",
        note: "",
      }));

      const attendanceResponse = await axios.get(
        `http://localhost:8000/api/attendance/stats/${courseId}/`,
        {
          headers: { Authorization: `Bearer ${token}` },
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
            const frontendStatus = recordForDate.status === "Present" ? "Present" :
                                 recordForDate.status === "Late" ? "Late" : "Absent";
            
            return {
              ...student,
              attendance: frontendStatus,
              note: recordForDate.notes || "",
            };
          }
        }
        return student;
      });

      setStudents(updatedStudents);
      setStudentTimelines(attendanceData);
      setSaveStatus("");

    } catch (error) {
      console.error("Fetch error:", error);
      if (error.response?.status === 401) {
        alert("Your session has expired. Please log in again.");
        navigate("/login");
      } else {
        alert("Failed to fetch students or attendance");
      }
    } finally {
      setIsLoading(false);
    }
  }, [courseId, selectedDate, navigate]);

  useEffect(() => {
    fetchStudentsAndAttendance();
  }, [fetchStudentsAndAttendance]);

  const saveStudentAttendance = async (studentId, attendance, note) => {
    try {
      const token = getToken();
      if (!token) {
        navigate("/login");
        return false;
      }

      const payload = {
        course_id: parseInt(courseId),
        date: selectedDate,
        records: [{
          student_id: studentId,
          status: statusMap[attendance],
          notes: note || "",
        }],
      };

      await axios.post("http://localhost:8000/api/attendance/take/", payload, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });

      return true;
    } catch (error) {
      console.error("Save student error:", error);
      return false;
    }
  };

  const handleAttendanceChange = async (index, value) => {
    const updated = [...students];
    const student = updated[index];
    
    updated[index].attendance = value;
    setStudents(updated);
    setOpenDropdownIndex(null);

    const success = await saveStudentAttendance(student.id, value, student.note);
    
    if (success) {
      updateStudentTimeline(student.id, value, student.note);
      showSaveStatus("Attendance updated successfully!");
    } else {
      alert("Failed to save attendance change. Please try again.");
    }
  };

  const handleNoteChange = async (index, value) => {
    const updated = [...students];
    const student = updated[index];
    
    updated[index].note = value;
    setStudents(updated);

    const success = await saveStudentAttendance(student.id, student.attendance, value);
    
    if (success) {
      updateStudentTimeline(student.id, student.attendance, value);
      showSaveStatus("Note saved successfully!");
    }
  };

  const updateStudentTimeline = (studentId, attendance, note) => {
    setStudentTimelines(prev => prev.map(student => {
      if (student.id === studentId) {
        const timeline = [...student.timeline];
        const existingIndex = timeline.findIndex(item => item.date === selectedDate);
        
        const timelineEntry = {
          date: selectedDate,
          status: attendance,
          notes: note || ""
        };

        if (existingIndex >= 0) {
          timeline[existingIndex] = timelineEntry;
        } else {
          timeline.push(timelineEntry);
        }

        return {
          ...student,
          timeline: timeline.sort((a, b) => new Date(b.date) - new Date(a.date))
        };
      }
      return student;
    }));
  };

  const handleMarkAllPresent = async () => {
    const updated = students.map((student) => ({ 
      ...student, 
      attendance: "Present" 
    }));
    setStudents(updated);

    try {
      setIsSaving(true);
      const token = getToken();
      
      const payload = {
        course_id: parseInt(courseId),
        date: selectedDate,
        records: updated.map((s) => ({
          student_id: s.id,
          status: statusMap["Present"],
          notes: s.note || "",
        })),
      };

      await axios.post("http://localhost:8000/api/attendance/take/", payload, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });

      setStudentTimelines(prev => prev.map(student => {
        const updatedStudent = updated.find(s => s.id === student.id);
        if (updatedStudent) {
          const timeline = [...student.timeline];
          const existingIndex = timeline.findIndex(item => item.date === selectedDate);
          
          const timelineEntry = {
            date: selectedDate,
            status: "Present",
            notes: updatedStudent.note || ""
          };

          if (existingIndex >= 0) {
            timeline[existingIndex] = timelineEntry;
          } else {
            timeline.push(timelineEntry);
          }

          return {
            ...student,
            timeline: timeline.sort((a, b) => new Date(b.date) - new Date(a.date))
          };
        }
        return student;
      }));

      showSaveStatus("All students marked as Present!");
    } catch (error) {
      console.error("Save all error:", error);
      alert("Failed to save attendance for all students.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveAttendance = async () => {
    try {
      setIsSaving(true);
      const token = getToken();
      
      if (!token) {
        navigate("/login");
        return;
      }

      const payload = {
        course_id: parseInt(courseId),
        date: selectedDate,
        records: students.map((s) => ({
          student_id: s.id,
          status: statusMap[s.attendance],
          notes: s.note || "",
        })),
      };

      await axios.post("http://localhost:8000/api/attendance/take/", payload, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });

      await fetchStudentsAndAttendance();
      showSaveStatus("Attendance saved successfully!");

    } catch (error) {
      console.error("Save error details:", error);
      
      if (error.response?.status === 401) {
        alert("Your session has expired. Please log in again.");
        navigate("/login");
      } else if (error.response?.data) {
        alert(`Failed to save attendance: ${JSON.stringify(error.response.data)}`);
      } else {
        alert(`Failed to save attendance: ${error.message}`);
      }
    } finally {
      setIsSaving(false);
    }
  };

  const showSaveStatus = (message) => {
    setSaveStatus(message);
    setTimeout(() => {
      setSaveStatus("");
    }, 3000);
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
          
          {saveStatus && (
            <div className="fixed top-24 right-10 z-50 animate-fade-in">
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-xl shadow-lg">
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 mr-2" />
                  <span>{saveStatus}</span>
                </div>
              </div>
            </div>
          )}

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

          {isLoading && (
            <div className="text-center py-4">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
              <p className="text-gray-600 mt-2">Loading attendance data...</p>
            </div>
          )}

          <div className="flex justify-end gap-4 mb-6">
            <button
              onClick={handleMarkAllPresent}
              className="bg-green-100 text-green-800 px-4 py-2 rounded-xl hover:bg-green-200 transition-colors flex items-center gap-2"
              disabled={isLoading || isSaving}
            >
              <CheckCircle className="w-4 h-4" />
              Mark All Present
            </button>

            <button
              onClick={handleSaveAttendance}
              className="bg-green-600 text-white px-6 py-2 rounded-xl hover:bg-green-700 transition-colors flex items-center gap-2"
              disabled={isLoading || isSaving}
            >
              {isSaving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Saving...
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4" />
                  Save All Attendance
                </>
              )}
            </button>

            <button
              onClick={() => navigate(`/teacher`)}
              className="bg-gray-100 text-gray-800 px-4 py-2 rounded-xl hover:bg-gray-200 transition-colors"
              disabled={isLoading || isSaving}
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
                        disabled={isLoading || isSaving}
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
                              disabled={isSaving}
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
                        disabled={isLoading || isSaving}
                      />
                    </td>

                    <td className="p-3">
                      <button
                        onClick={() => handleViewTimeline(student.id)}
                        className="bg-blue-100 text-blue-800 px-4 py-2 rounded-xl hover:bg-blue-200 transition-colors flex items-center gap-2"
                        disabled={isLoading || isSaving}
                      >
                        <Calendar className="w-4 h-4" />
                        View Timeline
                      </button>
                    </td>
                  </tr>
                ))}

                {filteredStudents.length === 0 && !isLoading && (
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
                Attendance History (Latest First)
              </h3>
              
              {selectedStudentTimeline.timeline && selectedStudentTimeline.timeline.length > 0 ? (
                <div className="space-y-3">
                  {selectedStudentTimeline.timeline.map((entry, index) => (
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

            <div className="border-t px-6 py-4 bg-gray-50 flex justify-between items-center">
              <div className="text-sm text-gray-600">
                Last updated: {selectedStudentTimeline.timeline && selectedStudentTimeline.timeline.length > 0 
                  ? formatDate(selectedStudentTimeline.timeline[0].date) 
                  : "Never"}
              </div>
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