import React, { useState, useEffect, useRef } from "react";
import { Bell, LogOut, User } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Header = ({ onLogout, userType }) => {
  const [showMenu, setShowMenu] = useState(false);
  const [userName, setUserName] = useState("");
  const [notifications, setNotifications] = useState([]);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const userProfile = localStorage.getItem("user_profile");
    if (userProfile) {
      const user = JSON.parse(userProfile);
      setUserName(user.username || user.first_name || "User");
    }
  }, []);

  useEffect(() => {
    const fetchNotifications = async () => {
      const token = localStorage.getItem("access_token");
      if (!token) return;
      try {
        const res = await fetch("http://localhost:8000/api/notifications/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setNotifications(data);
        }
      } catch (err) {
        console.error("Failed to fetch notifications:", err);
      }
    };
    fetchNotifications();
  }, []);

  const unreadCount = notifications.filter(n => !n.is_read).length;

  const handleLogout = () => {
    setShowMenu(false);
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user_profile");
    if (onLogout) onLogout();
    navigate("/login");
  };

  const handleBellClick = () => {
    navigate("/notifications");
  };
  return (
    <header className="fixed top-0 left-0 w-full h-20 bg-white flex items-center justify-between px-6 md:px-10 shadow-md z-50 border-b border-gray-100">
      <div className="flex items-center gap-4 md:gap-6">
        <img src="/book.png" alt="Logo" className="w-12 h-12 md:w-16 md:h-16 object-contain" />
        <h1 className="text-xl md:text-3xl font-bold text-gray-900 tracking-tight">Attendance Tracker</h1>
      </div>

      <div className="flex items-center gap-4 md:gap-6">
        <button onClick={handleBellClick} className="relative p-2.5 rounded-lg hover:bg-gray-50 transition-colors">
          <Bell className="w-6 h-6 text-gray-600 hover:text-gray-900 transition-colors" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-5 h-5 px-1 text-xs font-bold text-white bg-red-500 rounded-full ring-2 ring-white">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </button>

        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setShowMenu(prev => !prev)}
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors group"
          >
            <div className="relative">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center overflow-hidden border-2 border-white shadow-sm">
                <User className="w-5 h-5 md:w-6 md:h-6 text-blue-600" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-green-500 border-2 border-white"></div>
            </div>
            <div className="hidden md:block text-left">
              <p className="font-semibold text-gray-900 text-sm leading-tight">{userName || "User"}</p>
              <p className="text-gray-500 text-xs">{userType === "teacher" ? "Teacher Account" : "Student Account"}</p>
            </div>
          </button>

          {showMenu && (
            <div className="absolute right-0 top-full mt-2 w-56 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden py-1 z-50">
              <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
                <p className="font-semibold text-gray-900 text-sm">{userName || "User"}</p>
                <p className="text-gray-500 text-xs mt-0.5">{userType === "teacher" ? "Teacher" : "Student"}</p>
              </div>
              <div className="border-t border-gray-100 my-1"></div>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors"
              >
                <LogOut className="w-4 h-4 text-red-600" />
                <span>Log Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
