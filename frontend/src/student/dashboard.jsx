import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { BookOpen } from "lucide-react"; // Icon
import "react-circular-progressbar/dist/styles.css";

const Dashboard = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [today, setToday] = useState(null);
  const [loading, setLoading] = useState(true);
  const [courseColors, setCourseColors] = useState({});

  const gradients = useMemo(
    () => [
      "from-teal-400 to-teal-200",
      "from-purple-400 to-pink-300",
      "from-yellow-400 to-orange-300",
      "from-blue-400 to-indigo-300",
      "from-green-400 to-lime-300",
    ],
    []
  );

  useEffect(() => {
    const fetchDashboard = async () => {
      const token = localStorage.getItem("access_token");
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const res = await fetch("http://localhost:8000/api/students/dashboard/", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // ✅ Template literal fixed
          },
        });

        if (!res.ok) throw new Error("Failed to fetch dashboard data");

        const data = await res.json();
        setCourses(data.courses || []);
        setToday({
          date: data.today?.date || new Date().toDateString(),
          attended: data.today?.attended || 0,
          total: data.today?.total || 0,
          classes: data.today?.classes || [],
        });

        const colors = {};
        (data.courses || []).forEach((course, index) => {
          colors[course.id] = gradients[index % gradients.length];
        });
        setCourseColors(colors);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [navigate, gradients]);

  if (loading) return <div className="text-center mt-20">Loading...</div>;

  return (
    <div className="w-full min-h-screen bg-gray-50 p-6 pt-28">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">
        Here is your summary for today.
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
        {courses.length === 0 ? (
          <div className="text-center text-gray-500 col-span-full">
            No courses found.
          </div>
        ) : (
          courses.map((course) => (
            <div
              key={course.id}
              className="bg-white rounded-2xl shadow p-4 flex flex-col gap-3 border border-gray-100"
            >
              <div
                className={`rounded-xl bg-gradient-to-r ${courseColors[course.id]} aspect-[7/4] flex items-center justify-center`}
              >
                <BookOpen size={48} className="text-white opacity-80" />
              </div>

              <div className="font-semibold text-gray-800 truncate">
                {course.title}
              </div>

              <button
                className="w-full bg-purple-100 text-purple-700 py-2 rounded-xl text-sm hover:bg-purple-200 transition"
                onClick={() => navigate(`/student/courses/${course.id}`)} // ✅ Template literal fixed
              >
                View Course
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Dashboard;
