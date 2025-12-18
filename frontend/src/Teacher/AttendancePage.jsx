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
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [totalDays, setTotalDays] = useState(0);

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
          `http://localhost:8080/api/students/courses/${courseId}/students/`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const attendanceRes = await axios.get(
          `http://localhost:8080/api/attendance/stats/${courseId}/`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const records = attendanceRes.data;

        const allDates = new Set();
        studentRes.data.forEach((stu) => {
          const timeline =
            records.find((r) => r.id === stu.id)?.timeline || [];
          timeline.forEach((rec) => allDates.add(rec.date));
        });
        setTotalDays(allDates.size);

        const updatedStudents = studentRes.data.map((stu) => {
          const timeline =
            records.find((r) => r.id === stu.id)?.timeline || [];

          const allAttendance = {};
          timeline.forEach((rec) => {
            allAttendance[rec.date] = rec.status;
          });

          return {
            id: stu.id,
            name: stu.full_name || stu.name,
            status: allAttendance[selectedDate] || "--",
            note:
              timeline.find((r) => r.date === selectedDate)?.notes || "",
            allAttendance,
          };
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
    setStudents((prev) =>
      prev.map((s, i) =>
        i === index
          ? {
              ...s,
              status: option.label,
              allAttendance: {
                ...s.allAttendance,
                [selectedDate]: option.label,
              },
            }
          : s
      )
    );
    setOpenDropdownIndex(null);
  };

  const handleNoteChange = (index, value) => {
    setStudents((prev) =>
      prev.map((s, i) =>
        i === index ? { ...s, note: value } : s
      )
    );
  };

  const handleMarkAllPresent = () => {
    setStudents((prev) =>
      prev.map((s) => ({
        ...s,
        status: "Present",
        allAttendance: {
          ...s.allAttendance,
          [selectedDate]: "Present",
        },
      }))
    );
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

      await axios.post(
        "http://localhost:8080/api/attendance/take/",
        payload,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );

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
    if (status === "Present") return "bg-green-100 text-green-800";
    if (status === "Late") return "bg-blue-100 text-blue-800";
    if (status === "Absent") return "bg-red-100 text-red-800";
    return "bg-gray-200 text-gray-600";
  };

  return (
    <div>
      <Header userType="teacher" />

      <div className="p-10 w-full max-w-7xl mx-auto bg-gray-50 min-h-screen mt-24">
        <div className="bg-white rounded-3xl shadow-lg p-8">

          <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
            <h1 className="text-3xl font-extrabold text-gray-800">
              Attendance
            </h1>

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
                className="px-4 py-2 bg-gray-100 rounded-xl"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="flex justify-between items-center mb-4">
            <div className="text-sm text-gray-600">
              Total Class Days: <b>{totalDays}</b>
            </div>

            <div className="flex gap-4">
              <button
                onClick={handleMarkAllPresent}
                className="bg-green-100 text-green-800 px-4 py-2 rounded-xl"
              >
                Mark All as Present
              </button>

              <button
                onClick={handleSaveAttendance}
                className="bg-green-100 text-green-800 px-6 py-2 rounded-xl"
              >
                Save Attendance
              </button>

              <button
                onClick={() =>
                  navigate(`/teacher/courses/${courseId}`)
                }
                className="bg-gray-100 text-gray-800 px-4 py-2 rounded-xl"
              >
                Back to course
              </button>
            </div>
          </div>

          <div className="rounded-2xl border overflow-visible">
            <table className="w-full text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-3 text-left">ID</th>
                  <th className="p-3 text-left">Student</th>
                  <th className="p-3 text-left">Status</th>
                  <th className="p-3 text-left">Note</th>
                </tr>
              </thead>

              <tbody>
                {filteredStudents.map((student, index) => (
                  <tr key={student.id} className="even:bg-gray-50">
                    <td className="p-3">{student.id}</td>
                    <td className="p-3">{student.name}</td>

                    <td className="p-3 relative">
                      <button
                        onClick={() =>
                          setOpenDropdownIndex(
                            openDropdownIndex === index ? null : index
                          )
                        }
                        className={`flex items-center justify-between w-36 px-4 py-2 rounded-full ${getAttendanceColor(
                          student.status
                        )}`}
                      >
                        {student.status === "--"
                          ? "Select"
                          : student.status}
                        <ChevronDown size={16} />
                      </button>

                      {openDropdownIndex === index && (
                        <div className="absolute top-full mt-2 w-36 bg-white rounded-xl shadow-lg border z-50">
                          {attendanceOptions.map((option) => (
                            <button
                              key={option.value}
                              className="w-full text-left px-4 py-2 hover:bg-gray-50"
                              onClick={() =>
                                handleAttendanceChange(index, option)
                              }
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
                        className="w-full px-3 py-2 rounded-xl border"
                        value={student.note}
                        onChange={(e) =>
                          handleNoteChange(index, e.target.value)
                        }
                      />
                    </td>
                  </tr>
                ))}

                {filteredStudents.length === 0 && (
                  <tr>
                    <td
                      colSpan="4"
                      className="text-center py-6 text-gray-500"
                    >
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
