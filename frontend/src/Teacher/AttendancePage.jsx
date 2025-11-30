import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import Header from "../components/Header"; // adjust the path

const initialStudents = [
  { id: 1, name: "Alex Johnson", attendance: "Absent", note: "" },
  { id: 2, name: "Brenda Smith", attendance: "Absent", note: "" },
  { id: 3, name: "Carlos Gomez", attendance: "Absent", note: "" },
  { id: 4, name: "Diana Prince", attendance: "Absent", note: "" },
  { id: 5, name: "Ethan Hunt", attendance: "Absent", note: "" },
];

const AttendancePage = () => {
  const [students, setStudents] = useState(initialStudents);
  const [search, setSearch] = useState("");
  const [openDropdownIndex, setOpenDropdownIndex] = useState(null);

  const attendanceOptions = ["Present", "Absent", "Late"];

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
    const updated = students.map((student) => ({
      ...student,
      attendance: "Present",
    }));
    setStudents(updated);
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
      default:
        return "bg-red-100 text-red-800 hover:bg-red-200";
    }
  };

  return (
    <div>
      <Header userType="teacher" />
      <div className="p-10 w-full max-w-7xl mx-auto bg-gray-50 min-h-screen mt-24">
        <div className="bg-white rounded-3xl shadow-lg p-8 overflow-visible relative">
          <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
            <h1 className="text-3xl font-extrabold text-gray-800">Attendance</h1>
            <div className="relative w-80">
              <input
                type="text"
                placeholder="Search student..."
                className="w-full pl-4 pr-4 py-2 bg-gray-100 rounded-2xl shadow-sm focus:ring-2 focus:ring-gray-300 focus:outline-none text-gray-700 transition-all duration-300"
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
              onClick={() => alert("Attendance saved successfully!")}
              className="bg-green-100 text-green-800 px-6 py-2 rounded-xl hover:bg-green-200 transition shadow-md"
            >
              Save Attendance
            </button>

            <button
              onClick={() => window.location.href = "/dashboard"}
              className="bg-gray-100 text-gray-800 px-4 py-2 rounded-xl hover:bg-gray-200 transition shadow-md"
            >
              Back to Dashboard
            </button>
          </div>

          <div className="rounded-2xl overflow-visible shadow-sm relative border border-gray-200">
            <table className="w-full text-sm">
              <thead className="text-gray-600 bg-gray-100">
                <tr>
                  <th className="p-3 text-left">ID</th>
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
                          setOpenDropdownIndex(
                            openDropdownIndex === index ? null : index
                          )
                        }
                        className={`flex items-center justify-between w-36 px-4 py-2 rounded-full font-semibold transition-shadow shadow-sm ${getAttendanceColor(
                          student.attendance
                        )}`}
                      >
                        {student.attendance} <ChevronDown size={16} />
                      </button>

                      {openDropdownIndex === index && (
                        <div className="absolute top-full mt-2 w-36 bg-white rounded-xl shadow-lg border border-gray-200 z-50">
                          {attendanceOptions.map((option) => (
                            <button
                              key={option}
                              className={`w-full text-left px-4 py-2 hover:bg-gray-50 transition ${
                                option === "Present"
                                  ? "text-green-800"
                                  : option === "Late"
                                  ? "text-blue-800"
                                  : "text-red-800"
                              }`}
                              onClick={() => handleAttendanceChange(index, option)}
                            >
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