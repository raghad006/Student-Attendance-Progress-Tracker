import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

export default function Course() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const mockCourse = {
      id,
      title: "CSCI313: Software Engineering-LECT-02",
      instructor: "Dr. Ahmed Mohammed",
      upcoming_classes: [
        { id: 12, date: "2025-12-02", topic: "Testing", time: "10:00" },
        { id: 13, date: "2025-12-04", topic: "Models & Diagrams", time: "12:00" },
      ],
      past_attendance: [
        { date: "2025-11-25", status: "Present" },
        { date: "2025-11-24", status: "Absent" },
        { date: "2025-11-27", status: "Absent" },
        { date: "2025-11-23", status: "Present" },
        { date: "2025-11-26", status: "Present" },
      ],
      description: "This is a mock course description for testing purposes.",
      last_synced: "2025-11-30 09:00",
    };

    setTimeout(() => {
      setCourse(mockCourse);
      setLoading(false);
    }, 500);
  }, [id]);

  if (loading)
    return <div className="text-center mt-20">Loading course details...</div>;

  const past = Array.isArray(course.past_attendance)
    ? course.past_attendance
    : [];

  const totalCount = past.length;
  const attendedCount = past.filter(
    (p) => p.status?.toLowerCase() === "present"
  ).length;
  const absentCount = totalCount - attendedCount;

  const attendancePercent = totalCount
    ? Math.round((attendedCount / totalCount) * 100)
    : 0;

  const grade = (attendancePercent / 100 * 5).toFixed(1);

  const upcoming = Array.isArray(course.upcoming_classes)
    ? course.upcoming_classes
    : [];

  return (
    <div className="w-full min-h-screen bg-gray-50 p-8 pt-28">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="px-3 py-2 rounded-xl bg-gray-100 hover:bg-gray-200"
            >
              ← Back
            </button>
            <div>
              <h1 className="text-2xl font-semibold text-gray-800">
                {course.title}
              </h1>
              <p className="text-sm text-gray-500">
                {course.instructor ?? "Instructor not specified"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-xs text-gray-500">Overall grade</div>
              <div className="font-semibold text-gray-800 text-lg">
                {grade} / 5
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl shadow p-6 border border-gray-100">
              <h2 className="text-lg font-semibold text-gray-800 mb-2">
                Course Overview
              </h2>
              <p className="text-sm text-gray-700">
                {course.description ?? "No description provided."}
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-md font-semibold text-gray-800">
                  Upcoming Classes
                </h3>
                <span className="text-sm text-gray-500">
                  {upcoming.length} total
                </span>
              </div>

              {upcoming.length === 0 ? (
                <div className="text-sm text-gray-500">
                  No upcoming classes.
                </div>
              ) : (
                <ul className="space-y-3">
                  {upcoming.map((u) => (
                    <li
                      key={u.id ?? `${u.date}-${u.topic}`}
                      className="flex items-center justify-between p-3 rounded-lg border border-gray-50"
                    >
                      <div>
                        <div className="font-medium text-gray-800">
                          {u.topic ?? "Class"}
                        </div>
                        <div className="text-xs text-gray-500">
                          {u.date} {u.time ? `• ${u.time}` : ""}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="bg-white rounded-2xl shadow p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-md font-semibold text-gray-800">
                  Past Attendance
                </h3>
                <span className="text-sm text-gray-500">
                  {past.length} records
                </span>
              </div>

              {past.length === 0 ? (
                <div className="text-sm text-gray-500">
                  No attendance records yet.
                </div>
              ) : (
                <div className="space-y-2">
                  {past.map((p, i) => (
                    <div
                      key={`${p.date}-${i}`}
                      className="flex items-center justify-between p-3 rounded-lg border border-gray-50 text-sm"
                    >
                      <div>
                        <div className="font-medium text-gray-800">
                          {p.date}
                        </div>
                      </div>
                      <div
                        className={`px-3 py-1 rounded-full text-xs ${
                          p.status?.toLowerCase() === "present"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {p.status ?? "Unknown"}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow p-6 flex flex-col items-center border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800 mb-1">
              Attendance
            </h3>
            <p className="text-sm text-gray-500 mb-4">Overall attendance</p>

            <div style={{ width: 140, height: 140 }} className="mb-4">
              <CircularProgressbar
                value={attendancePercent}
                text={`${attendancePercent}%`}
                styles={buildStyles({
                  pathColor: "#a78bfa",
                  textColor: "#1f2937",
                  trailColor: "#f3e8ff",
                })}
              />
            </div>

            <div className="text-center">
              <div className="text-sm text-gray-600">Attended</div>
              <div className="font-semibold text-gray-800 text-lg">
                {attendedCount} / {totalCount}
              </div>

              <div className="mt-3 text-sm text-gray-600">Absent</div>
              <div className="font-semibold text-gray-800 text-lg">
                {absentCount}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 text-sm text-gray-500">
          <span>Last synced: </span>
          <span>{course.last_synced ?? "unknown"}</span>
        </div>
      </div>
    </div>
  );
}
