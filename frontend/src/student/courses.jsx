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
    const fetchCourseData = async () => {
      const token = localStorage.getItem("access_token");
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const response = await fetch(`http://127.0.0.1:8000/api/attendance/student/${id}/`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) throw new Error("Failed to fetch attendance");

        const data = await response.json();

        const courseData = {
          id,
          title: data.course_title ?? "Course",
          instructor: data.course_instructor ?? "Instructor",
          past_attendance: Array.isArray(data.timeline) ? data.timeline : [],
          upcoming_classes: Array.isArray(data.upcoming_classes) ? data.upcoming_classes : [],
          description: "Course attendance overview.",
          last_synced: new Date().toLocaleString(),
          attendance_rate: data.attendance_rate ?? 0,
          grade_out_of_5: data.grade_out_of_5 ?? 0,
        };

        setCourse(courseData);
      } catch (error) {
        console.error("Error fetching attendance:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourseData();
  }, [id, navigate]);

  if (loading) {
    return <div className="text-center mt-20">Loading course details...</div>;
  }

  if (!course) {
    return <div className="text-center mt-20 text-red-500">Course data not available.</div>;
  }

  const past = course.past_attendance ?? [];
  const totalCount = past.length;
  const attendedCount = past.filter((p) => p.status?.toLowerCase() === "present").length;
  const absentCount = totalCount - attendedCount;
  const attendancePercent = totalCount ? Math.round((attendedCount / totalCount) * 100) : 0;
  const grade = course.grade_out_of_5?.toFixed(1) ?? 0;
  const upcoming = course.upcoming_classes ?? [];

  return (
    <div className="w-full min-h-screen bg-gray-50 p-8 pt-28">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="px-3 py-2 rounded-xl bg-gray-100 hover:bg-gray-200"
            >
              ← Back
            </button>
            <div>
              <h1 className="text-2xl font-semibold text-gray-800">{course.title}</h1>
              <p className="text-sm text-gray-500">{course.instructor}</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-xs text-gray-500">Overall grade</div>
              <div className="font-semibold text-gray-800 text-lg">{grade} / 5</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Course Overview */}
            <div className="bg-white rounded-2xl shadow p-6 border border-gray-100">
              <h2 className="text-lg font-semibold text-gray-800 mb-2">Course Overview</h2>
              <p className="text-sm text-gray-700">{course.description}</p>
            </div>

            {/* Past Attendance */}
            <div className="bg-white rounded-2xl shadow p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-md font-semibold text-gray-800">Past Attendance</h3>
                <span className="text-sm text-gray-500">{past.length} records</span>
              </div>

              {past.length === 0 ? (
                <div className="text-sm text-gray-500">No attendance records yet.</div>
              ) : (
                <div className="space-y-2">
                  {past.map((p, i) => (
                    <div
                      key={`${p.date}-${i}`}
                      className="flex items-center justify-between p-3 rounded-lg border border-gray-50 text-sm"
                    >
                      <div className="font-medium text-gray-800">{p.date}</div>
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

            {/* Upcoming Classes */}
            {upcoming.length > 0 && (
              <div className="bg-white rounded-2xl shadow p-6 border border-gray-100">
                <h3 className="text-md font-semibold text-gray-800 mb-2">Upcoming Classes</h3>
                <ul className="text-sm text-gray-700 list-disc list-inside">
                  {upcoming.map((cls, i) => (
                    <li key={i}>
                      {cls.date} - {cls.topic ?? "No topic specified"}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Attendance Stats */}
          <div className="bg-white rounded-2xl shadow p-6 flex flex-col items-center border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800 mb-1">Attendance</h3>
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
              <div className="font-semibold text-gray-800 text-lg">{absentCount}</div>
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
