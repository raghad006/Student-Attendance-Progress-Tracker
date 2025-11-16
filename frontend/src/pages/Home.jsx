import React from "react";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  const goToLogin = () => {
    navigate("/login");
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gradient-to-r from-blue-500 to-blue-300 text-white">
      <h1 className="text-4xl font-bold mb-6">Welcome to Attendance Tracker</h1>
      <p className="text-lg mb-6">Please login to continue</p>
      <button
        onClick={goToLogin}
        className="bg-white text-blue-600 font-bold py-2 px-6 rounded-lg hover:bg-gray-100 transition duration-200"
      >
        Login
      </button>
    </div>
  );
}
