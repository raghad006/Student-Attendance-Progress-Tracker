import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import Header from "../components/Header";

const AttendancePage = () => {
  const { id: courseId } = useParams();
  const navigate = useNavigate();

  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [openDropdownIndex, setOpenDropdownIndex] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]); // default today

  const attendanceOptions = [
    { label: "Present", value: "P" },
    { label: "Absent", value: "A" },
    { label: "Late", value: "L" },
  ];

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const token = localStorage.getItem("access_token");
        if (!token) {
          navigate("/login");
          return;
        }

        const studentRes = await axios.get(
          `http://localhost:8000/api/students/courses/${courseId}/students/`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const studentsWithAttendance = studentRes.data.map((s) => ({
          id: s.id,
          name: s.name,
          status: "--",
          note: "",
        }));

        const attendanceRes = await axios.get(
          `http://localhost:8000/api/attendance/stats/${courseId}/`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const records = attendanceRes.data;

        const updatedStudents = studentsWithAttendance.map((stu) => {
          const rec = records.find(
            (r) => r.id === stu.id || r.student_id === stu.id
          );

          if (rec) {
            const dayRecord = rec.records?.find((r) => r.date === selectedDate);
            return {
              ...stu,
              status:
                dayRecord?.status === "P"
                  ? "Present"
                  : dayRecord?.status === "L"
                  ? "Late"
                  : dayRecord?.status === "A"
                  ? "Absent"
                  : "--",
              note: dayRecord?.notes || "",
            };
          }

          return stu;
        });

        setStudents(updatedStudents);
      } catch (error) {
        console.error("Fetch failed:", error);
        alert("Failed to fetch students or attendance");
      }
    };

    fetchStudents();
  }, [courseId, selectedDate, navigate]);

  const handleAttendanceChange = (index, option) => {
    const updated = [...students];
    updated[index].status = option.label;
    setStudents(updated);
    setOpenDropdownIndex(null);
  };

  const handleNoteChange = (index, value) => {
    const updated = [...students];
    updated[index].note = value;
    setStudents(updated);
  };

  const handleMarkAllPresent = () => {
    setStudents(students.map((s) => ({ ...s, status: "Present" })));
  };

  const handleSaveAttendance = async () => {
    try {
      const statusMap = { Present: "P", Absent: "A", Late: "L" };

      const payload = {
        course_id: courseId,
        date: selectedDate,
        records: students.map((s) => ({
          student_id: s.id,
          status: statusMap[s.status] || "A",
          notes: s.note,
        })),
      };

      await axios.post("http://localhost:8000/api/attendance/take/", payload, {
        headers: { Authorization: `Bearer ${localStorage.getItem("access_token")}` },
      });

      alert("Attendance saved successfully!");
    } catch (error) {
      console.error("Save failed:", error);
      alert("Failed to save attendance!");
    }
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
      case "Absent":
        return "bg-red-100 text-red-800 hover:bg-red-200";
      default:
        return "bg-gray-100 text-gray-500";
    }
  };

  return (
    <div>
      <Header userType="teacher" />

      <div className="p-10 w-full max-w-7xl mx-auto bg-gray-50 min-h-screen mt-24">
        <div className="bg-white rounded-3xl shadow-lg p-8 overflow-visible relative">

          <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
            <h1 className="text-3xl font-extrabold text-gray-800">Attendance</h1>
            <div className="flex gap-4 items-center">
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="px-4 py-2 border rounded-xl"
              />
              <input
                type="text"
                placeholder="Search student..."
                className="pl-4 pr-4 py-2 bg-gray-100 rounded-2xl shadow-sm focus:ring-2 focus:ring-gray-300 focus:outline-none text-gray-700 transition-all duration-300"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="flex justify-end gap-4 mb-4">
            <button
              onClick={handleMarkAllPresent}
              className="bg-green-100 text-green-800 px-4 py-2 rounded-xl hover:bg-green-200 transition shadow-md"
            >
              Mark All as Present
            </button>

            <button
              onClick={handleSaveAttendance}
              className="bg-green-100 text-green-800 px-6 py-2 rounded-xl hover:bg-green-200 transition shadow-md"
            >
              Save Attendance
            </button>

            <button
              onClick={() => navigate(`/teacher/courses/${courseId}`)}
              className="bg-gray-100 text-gray-800 px-4 py-2 rounded-xl hover:bg-gray-200 transition shadow-md"
            >
              Back to course
            </button>
          </div>

          <div className="rounded-2xl overflow-visible shadow-sm relative border border-gray-200">
            <table className="w-full text-sm">
              <thead className="text-gray-600 bg-gray-100">
                <tr>
                  <th className="p-3 text-left"></th>
                  <th className="p-3 text-left">Student</th>
                  <th className="p-3 text-left">Attendance</th>
                  <th className="p-3 text-left">Note</th>
                </tr>
              </thead>

              <tbody className="text-gray-900">
                {filteredStudents.map((student, index) => (
                  <tr
                    key={student.id}
                    className="even:bg-gray-50 hover:bg-gray-100 transition-all duration-200"
                  >
                    <td className="p-3 font-medium">{student.id}</td>
                    <td className="p-3">{student.name}</td>

                    <td className="p-3 relative">
                      <button
                        onClick={() =>
                          setOpenDropdownIndex(openDropdownIndex === index ? null : index)
                        }
                        className={`flex items-center justify-between w-36 px-4 py-2 rounded-full font-semibold transition-shadow shadow-sm ${getAttendanceColor(
                          student.status
                        )}`}
                      >
                        {student.status} <ChevronDown size={16} />
                      </button>

                      {openDropdownIndex === index && (
                        <div className="absolute top-full mt-2 w-36 bg-white rounded-xl shadow-lg border border-gray-200 z-50">
                          {attendanceOptions.map((option) => (
                            <button
                              key={option.value}
                              className={`w-full text-left px-4 py-2 hover:bg-gray-50 transition ${
                                option.value === "P"
                                  ? "text-green-800"
                                  : option.value === "L"
                                  ? "text-blue-800"
                                  : "text-red-800"
                              }`}
                              onClick={() => handleAttendanceChange(index, option)}
                            >
                              {option.label}
                            </button>
                          ))}
                        </div>
                      )}
                    </td>

                    <td className="p-3">
                      <input
                        type="text"
                        placeholder="Add note..."
                        className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-gray-200 focus:outline-none"
                        value={student.note}
                        onChange={(e) => handleNoteChange(index, e.target.value)}
                      />
                    </td>
                  </tr>
                ))}

                {filteredStudents.length === 0 && (
                  <tr>
                    <td colSpan="4" className="text-center py-6 text-gray-500">
                      No students found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttendancePage;
