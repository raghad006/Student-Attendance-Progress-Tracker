import React from "react";
import { useNavigate } from "react-router-dom";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

export default function Dashboard() {
  const navigate = useNavigate();

  const handleBiologyClick = () => navigate("/biology");
  const handleAttendanceClick = () => navigate("/attendance");

  return (
    <div className="flex w-full min-h-screen bg-gray-50 p-6 gap-6">
      
      <main className="flex-1 bg-white shadow rounded-xl p-8">
        
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Welcome, Maria!</h1>
            <p className="text-gray-500">Here is your summary for today.</p>
          </div>

          <div>
            <input
              type="text"
              placeholder="🔍 Search..."
              className="px-4 py-2 border rounded-lg text-sm bg-gray-100 
                         focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-300"
            />
          </div>
        </header>

        <section className="mb-10">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">My Courses</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            
            <div className="bg-white border rounded-xl shadow p-6 flex flex-col">
              <div className="w-full h-24 bg-purple-400 rounded-lg mb-4"></div>
              <h3 className="text-lg font-semibold">Introduction to Algebra</h3>
              <p className="text-gray-500 mb-4">28 Students</p>
              <button className="mt-auto px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
                View
              </button>
            </div>

            <div className="bg-white border rounded-xl shadow p-6 flex flex-col">
              <div className="w-full h-24 bg-emerald-500 rounded-lg mb-4"></div>
              <h3 className="text-lg font-semibold">Biology 101</h3>
              <p className="text-gray-500 mb-4">32 Students</p>
              <button
                onClick={handleBiologyClick}
                className="mt-auto px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
              >
                View
              </button>
            </div>

          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Quick Actions
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-1">
            <button
              onClick={handleAttendanceClick}
              className="
                bg-purple-300 
                hover:bg-purple-400 
                px-3 py-2 
                rounded-md 
                text-sm font-medium 
                shadow 
                w-fit
              "
            >
              🗓️ Take Attendance
            </button>
          </div>
        </section>

      </main>

      <aside className="w-80 bg-white shadow rounded-xl p-6 flex flex-col items-center">
        <h3 className="text-lg font-semibold text-gray-800 mb-6">
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
  );
}
