import React, { useState, useEffect } from "react";
import { useNavigate , useParams} from "react-router-dom";
import { BookOpen, Users, User } from "lucide-react";
import "react-circular-progressbar/dist/styles.css";
import Header from "../components/Header";

export default function Dashboard() {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const { id: courseId } = useParams();

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
  navigate(`/teacher/courses/${course.id}/attendance`);
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
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full">
                {courses.map((course) => (
                  <div
                    key={course.id}
                    className="bg-white border rounded-xl shadow p-6 flex flex-col min-h-[260px]"
                  >
                    <div
                      className={`w-full h-36 rounded-lg mb-4 flex items-center justify-center bg-gradient-to-r ${getCourseGradient(
                        course.id
                      )}`}
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
      </div>
    </div>
  );
}