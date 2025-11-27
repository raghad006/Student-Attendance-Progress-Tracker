import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

export default function Login() {
  const navigate = useNavigate();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!identifier || !password) {
      setError("Please enter your email/ID and password.");
      return;
    }

    try {
      const res = await fetch("http://localhost:8000/api/accounts/login/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.non_field_errors?.[0] || data.detail || "Login failed");
        return;
      }

      if (data.access) localStorage.setItem("access_token", data.access);
      if (data.refresh) localStorage.setItem("refresh_token", data.refresh);
      if (data.user) localStorage.setItem("user_profile", JSON.stringify(data.user));

      const role = data.user?.role;
      if (role === "TCR") navigate("/teacher");
      else navigate("/student/dashboard");
    } catch (err) {
      console.error("Fetch failed:", err);
      setError("Something went wrong. Try again later.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-purple-400 to-purple-300 text-white">
      <div className="bg-white text-gray-800 p-8 rounded-2xl shadow-lg w-96">
        <h2 className="text-2xl font-bold mb-4 text-center text-black-600">
          Login to Your Account
        </h2>

        {error && (
          <div className="bg-red-100 text-red-600 p-2 mb-4 rounded">{error}</div>
        )}

        <form onSubmit={handleLogin}>
          <label className="block mb-2 text-sm font-semibold">
            Email or Username
          </label>
          <input
            type="text"
            placeholder="Enter your email or ID"
            className="w-full mb-4 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-300"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
          />

          <label className="block mb-2 text-sm font-semibold">Password</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              className="w-full mb-4 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-300"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-2 top-2 text-gray-500"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <button
            type="submit"
            className="w-full bg-purple-400 hover:bg-purple-500 text-white font-semibold py-2 rounded-lg transition duration-200"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
