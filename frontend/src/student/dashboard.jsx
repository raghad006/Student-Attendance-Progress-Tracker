import React, { useState } from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

const Dashboard = () => {
  const [courses] = useState([
    {
      id: 1,
      title: "Introduction to Algebra",
      attendance: 88,
      grade: 4.2,
      color: "from-teal-400 to-teal-200",
    },
    {
      id: 2,
      title: "Biology 101",
      attendance: 92,
      grade: 4.6,
      color: "from-lime-400 to-lime-200",
    },
  ]);

  const [today] = useState({
    date: "Monday, Nov 27, 2025",
    attended: 1,
    total: 2,
    classes: [
      { name: "Biology 101 - Lecture", attended: true },
      { name: "Introduction to Algebra - Lab", attended: false },
    ],
  });

  const percentToday = Math.round((today.attended / today.total) * 100);

  return (
    <div className="w-full min-h-screen bg-gray-50 p-8 pt-28">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">
        Here is your summary for today.
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
          {courses.map((course) => (
            <div
              key={course.id}
              className="bg-white rounded-2xl shadow-lg p-4 flex flex-col gap-3 border border-gray-100"
            >

              <div
                className={`h-48 rounded-xl bg-gradient-to-r ${course.color}`}
              />

              <div className="font-semibold text-gray-800">
                {course.title}
              </div>
              <div className="text-sm text-gray-600">
                Attendance: <span className="font-medium">{course.attendance}%</span>
              </div>

              <div className="text-sm text-gray-600">
                Overall Grade: <span className="font-medium">{course.grade} / 5</span>
              </div>

              <button className="w-full bg-purple-100 text-purple-700 py-2 rounded-xl text-sm hover:bg-purple-200 transition">
                View Course
              </button>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 flex flex-col items-center justify-center">
          <h3 className="text-lg font-semibold text-gray-800 mb-1">
            Your Attendance Today
          </h3>
          <p className="text-sm text-gray-500 mb-4">{today.date}</p>

          <div className="w-40 h-40">
            <CircularProgressbar
              value={percentToday}
              text={`${percentToday}%`}
              styles={buildStyles({
                pathColor: "#a78bfa",
                textColor: "#1f2937",
                trailColor: "#f3e8ff",
                textSize: "20px",
              })}
            />
          </div>

          <p className="mt-4 text-sm text-gray-700">
            {today.attended} / {today.total} classes attended
          </p>

          <div className="mt-6 w-full">
            {today.classes.map((cls, i) => (
              <div
                key={i}
                className="flex justify-between text-sm text-gray-700 mb-2"
              >
                <span className="flex items-center gap-2">
                  <span
                    className={`w-3 h-3 rounded-full ${
                      cls.attended ? "bg-purple-300" : "bg-purple-100"
                    }`}
                  />
                  {cls.name}
                </span>
                <span>{cls.attended ? "Present" : "Absent"}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
