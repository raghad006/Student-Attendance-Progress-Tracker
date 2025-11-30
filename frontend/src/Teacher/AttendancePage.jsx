import React from "react";
import { useNavigate } from "react-router-dom";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

export default function AttendancePage() {
  const navigate = useNavigate();

  const students = [
    { id: 1, name: "Alex Johnson", present: false },
    { id: 2, name: "Brenda Smith", present: false },
    { id: 3, name: "Carlos Gomez", present: false },
    { id: 4, name: "Diana Prince", present: false },
    { id: 5, name: "Ethan Hunt", present: false },
  ];

  const [attendance, setAttendance] = React.useState(students);
  const [date, setDate] = React.useState(new Date().toISOString().split("T")[0]);

  const toggleAttendance = (id) => {
    setAttendance((prev) =>
      prev.map((s) =>
        s.id === id ? { ...s, present: !s.present } : s
      )
    );
  };

  const presentCount = attendance.filter((s) => s.present).length;
  const total = attendance.length;
  const percentage = Math.round((presentCount / total) * 100);

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-4xl mx-auto px-4">
        
        <button
          onClick={() => navigate("/dashboard")}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition mb-6"
        >
          <span className="text-xl">←</span> Back to Dashboard
        </button>

        <div className="bg-white rounded-2xl shadow-sm p-8 mb-10 border border-gray-100">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                Attendance — Biology 101
              </h1>
              <p className="text-gray-600 text-lg">
                {new Date(date).toLocaleDateString()}
              </p>
            </div>

            <div className="flex items-center gap-3 bg-gray-100 px-4 py-2 rounded-xl shadow-inner">
              <label className="text-gray-700 font-medium">Date:</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="bg-transparent border-none focus:outline-none text-gray-700"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-10">

          <div className="bg-white rounded-2xl shadow-sm p-6 flex flex-col items-center border border-gray-100">
            <div className="w-32 h-32 mb-4">
              <CircularProgressbar
                value={percentage}
                text={`${percentage}%`}
                styles={buildStyles({
                  textSize: "16px",
                  pathColor: percentage > 70 ? "#9333ea" : "#f59e0b",
                  textColor: "#1f2937",
                  trailColor: "#e5e7eb",
                })}
              />
            </div>
            <h3 className="text-lg font-semibold text-gray-700">
              Attendance Rate
            </h3>
          </div>

          <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-2xl shadow-sm p-6 text-center border border-gray-100">
              <div className="text-4xl font-bold text-purple-600 mb-2">
                {presentCount}
              </div>
              <p className="text-gray-600 font-medium">Present</p>
            </div>

            <div className="bg-white rounded-2xl shadow-sm p-6 text-center border border-gray-100">
              <div className="text-4xl font-bold text-red-500 mb-2">
                {total - presentCount}
              </div>
              <p className="text-gray-600 font-medium">Absent</p>
            </div>

            <div className="bg-white rounded-2xl shadow-sm p-6 text-center border border-gray-100">
              <div className="text-4xl font-bold text-gray-800 mb-2">
                {total}
              </div>
              <p className="text-gray-600 font-medium">Total Students</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-8 border border-gray-100 mb-10">

          <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
            <h2 className="text-2xl font-bold text-gray-800">Student Attendance</h2>

            <div className="flex gap-3">
              <button
                onClick={() => setAttendance(attendance.map(s => ({ ...s, present: true })))}
                className="bg-purple-600 text-white px-5 py-2 rounded-xl hover:bg-purple-700 transition shadow-md"
              >
                Mark All Present
              </button>

              <button
                onClick={() => setAttendance(attendance.map(s => ({ ...s, present: false })))}
                className="bg-gray-200 text-gray-800 px-5 py-2 rounded-xl hover:bg-gray-300 transition shadow-inner"
              >
                Clear All
              </button>
            </div>
          </div>

          <div className="space-y-4">
            {attendance.map((student) => (
              <div
                key={student.id}
                className="flex flex-col sm:flex-row justify-between items-center gap-6 p-5 rounded-xl border border-gray-200 hover:shadow-md transition bg-white"
              >
                <div className="flex items-center gap-5 flex-1">
                  <img
                    src="/user.png"
                    alt={student.name}
                    className="w-14 h-14 rounded-full shadow object-cover"
                  />

                  <div>
                    <div className="font-semibold text-gray-800 text-lg">
                      {student.name}
                    </div>
                    <div className="text-gray-500 text-sm">
                      ID: {student.id}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => toggleAttendance(student.id)}
                  className={`px-8 py-3 rounded-xl font-semibold transition-all text-white shadow-lg min-w-[140px] ${
                    student.present
                      ? "bg-purple-600 hover:bg-purple-700 shadow-purple-200"
                      : "bg-red-500 hover:bg-red-600 shadow-red-200"
                  }`}
                >
                  {student.present ? "Present" : "Absent"}
                </button>
              </div>
            ))}
          </div>

        </div>

        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <button
            onClick={() => navigate("/dashboard")}
            className="bg-gray-400 text-white px-10 py-3 rounded-xl hover:bg-gray-500 transition shadow"
          >
            Cancel
          </button>

          <button
            onClick={() => {
              alert("Attendance saved successfully!");
              navigate("/dashboard");
            }}
            className="bg-purple-600 text-white px-10 py-3 rounded-xl hover:bg-purple-700 transition shadow-lg shadow-purple-200"
          >
            Save Attendance
          </button>
        </div>

      </div>
    </div>
  );
}
