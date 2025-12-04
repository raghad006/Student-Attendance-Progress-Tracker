import React from "react";
import { useNavigate } from "react-router-dom";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import Header from "../components/Header";

import {
  User,
  BookOpen,
  Book,
  Atom,
  Users,
  PieChart,
} from "lucide-react";

export default function Dashboard() {
  const navigate = useNavigate();

  const handleBiologyClick = () => navigate("/biology");

  return (
    <div className="min-h-screen bg-gray-50">
      <Header userType="teacher" />

      <div className="flex w-full p-6 gap-6 pt-32">
        <main className="flex-1 flex flex-col gap-6">

          <header className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
                <User size={26} className="text-purple-600" />
                Welcome, Maria!
              </h1>
              <p className="text-gray-500">Here is your summary for today.</p>
            </div>
          </header>

          <section className="mb-10">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <BookOpen size={20} className="text-purple-600" />
              My Courses
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">

              <div className="bg-white border rounded-xl shadow p-6 flex flex-col min-h-[260px] max-w-[520px]">
                <div className="w-full h-36 bg-purple-400 rounded-lg mb-4 flex items-center justify-center">
                  <Book size={40} className="text-white" />
                </div>
                <h3 className="text-lg font-semibold">Introduction to Algebra</h3>
                <p className="text-gray-500 mb-4 flex items-center gap-1">
                  <Users size={16} /> 28 Students
                </p>

                <button
                  onClick={handleBiologyClick}
                  className="mt-auto px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center justify-center gap-2"
                >
                  View
                </button>
              </div>

              <div className="bg-white border rounded-xl shadow p-6 flex flex-col min-h-[260px] max-w-[520px]">
                <div className="w-full h-36 bg-emerald-500 rounded-lg mb-4 flex items-center justify-center">
                  <Atom size={40} className="text-white" />
                </div>
                <h3 className="text-lg font-semibold">Biology 101</h3>
                <p className="text-gray-500 mb-4 flex items-center gap-1">
                  <Users size={16} /> 32 Students
                </p>

                <button
                  onClick={handleBiologyClick}
                  className="mt-auto px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center justify-center gap-2"
                >
                  View
                </button>
              </div>

            </div>
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
 