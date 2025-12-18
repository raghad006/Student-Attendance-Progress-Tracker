<<<<<<< HEAD
=======
import React, { useState, useEffect } from "react";
>>>>>>> a73984d54dd53bc81d6b6c130c852bdb4c8f472b
import { useNavigate } from "react-router-dom";
import { BookOpen, Users, User, PieChart } from "lucide-react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import Header from "../components/Header";

export default function Dashboard() {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  const getCourseGradient = (courseId) => {
    const gradients = [
      "from-teal-400 to-teal-200",
      "from-purple-400 to-pink-300",
      "from-yellow-400 to-orange-300",
      "from-blue-400 to-indigo-300",
      "from-green-400 to-lime-300",
    ];
    return gradients[courseId % gradients.length];
  };

  useEffect(() => {
    const fetchCourses = async () => {
      const token = localStorage.getItem("access_token");
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const res = await fetch(
          "http://localhost:8000/api/students/teacher/dashboard/",
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) throw new Error("Failed to fetch dashboard data");
        const data = await res.json();
        setCourses(data.courses || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [navigate]);

  const handleCourseClick = (course) => {
    navigate(`/teacher/courses/${course.id}`, { state: { course } });
  };

  if (loading) return <div className="text-center mt-20">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header userType="teacher" />

      <div className="flex w-full p-6 gap-6 pt-32">
        <main className="flex-1 flex flex-col gap-6">
          <header className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
                <User size={26} className="text-purple-600" />
                Welcome, Teacher!
              </h1>
              <p className="text-gray-500">Here is your summary for today.</p>
            </div>
          </header>

          <section className="mb-10">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <BookOpen size={20} className="text-purple-600" />
              My Courses
            </h2>

            {courses.length === 0 ? (
              <p>No courses assigned.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                {courses.map((course) => (
                  <div
                    key={course.id}
                    className="bg-white border rounded-xl shadow p-6 flex flex-col min-h-[260px] max-w-[520px]"
                  >
                    <div
                      className={`w-full h-36 rounded-lg mb-4 flex items-center justify-center bg-gradient-to-r ${getCourseGradient(course.id)}`}
                    >
                      <BookOpen size={40} className="text-white" />
                    </div>
                    <h3 className="text-lg font-semibold">{course.title}</h3>
                    <p className="text-gray-500 mb-4 flex items-center gap-1">
                      <Users size={16} /> {course.current_student_count} Students
                    </p>

                    <button
                      onClick={() => handleCourseClick(course)}
                      className="mt-auto px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center justify-center gap-2"
                    >
                      View Students
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>
        </main>

        <aside className="w-80 bg-white shadow rounded-xl p-6 flex flex-col items-center gap-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <PieChart size={20} className="text-purple-600" />
            Today's Attendance Overview
          </h3>

          <div className="w-40 mb-6">
            <CircularProgressbar
              value={95}
              text={"95%"}
              strokeWidth={8}
              styles={buildStyles({
                pathColor: "#9333EA",
                textColor: "#9333EA",
                trailColor: "#E5E7EB",
                textSize: "18px",
              })}
            />
            <div className="text-center mt-2 text-sm font-medium text-gray-700">
              Present
            </div>
          </div>

          <div className="w-full text-gray-700 text-sm space-y-1 text-center">
            <p>57 Students Present</p>
            <p>3 Students Absent</p>
          </div>
        </aside>
      </div>
    </div>
  );
}