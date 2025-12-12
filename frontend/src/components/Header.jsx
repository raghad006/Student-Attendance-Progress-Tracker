import React, { useState, useRef, useEffect } from "react";
import { Bell, LogOut, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Header = ({ onLogout, userType }) => {
  const [showMenu, setShowMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [userName, setUserName] = useState("");
  const [notifications, setNotifications] = useState([]);
  const menuRef = useRef(null);
  const notificationRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setShowMenu(false);
      if (notificationRef.current && !notificationRef.current.contains(e.target)) setShowNotifications(false);
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

  const handleLogout = () => {
    setShowMenu(false);
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user_profile");
    if (onLogout) onLogout();
    navigate("/login");
  };

  const handleBellClick = () => {
    setShowNotifications((prev) => !prev);
    setShowMenu(false);
  };

  const handleMarkRead = async (id) => {
    const token = localStorage.getItem("access_token");
    try {
      const res = await fetch(`http://localhost:8000/api/notifications/mark-read/${id}/`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setNotifications((prev) =>
          prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
        );
      }
    } catch (err) {
      console.error("Failed to mark notification as read:", err);
    }
  };

  return (
    <header className="fixed top-0 left-0 w-full h-24 bg-white flex items-center justify-between px-10 shadow-md z-50">
      <div className="flex items-center gap-6">
        <img src="/book.png" alt="University Logo" className="w-16 h-16 object-contain" />
        <h1 className="text-3xl font-bold text-gray-800 tracking-tight">Attendance Tracker</h1>
      </div>

      <div className="flex items-center gap-6">
        <div className="relative" ref={notificationRef}>
          <button onClick={handleBellClick} className="p-3 rounded-full hover:bg-gray-100 relative">
            <Bell className="w-6 h-6 text-gray-700" />
            {notifications.some((n) => !n.is_read) && (
              <span className="absolute top-1 right-1 block h-3 w-3 rounded-full ring-2 ring-white bg-red-500"></span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 max-h-96 bg-white border border-gray-200 rounded-lg shadow-xl overflow-auto">
              <div className="flex justify-between items-center p-4 border-b">
                <h3 className="text-lg font-bold text-gray-800">Notifications</h3>
                <button onClick={() => setShowNotifications(false)} className="text-gray-500 hover:text-gray-700">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {notifications.length > 0 ? (
                <ul className="divide-y divide-gray-100">
                  {notifications.map((notification) => (
                    <li
                      key={notification.id}
                      className={`p-4 text-sm text-gray-700 hover:bg-blue-50 cursor-pointer transition-colors duration-150 ${
                        !notification.is_read ? "bg-blue-50 font-medium" : ""
                      }`}
                      onClick={() => handleMarkRead(notification.id)}
                    >
                      {notification.message}
                    </li>
                  ))}
                  <li className="p-4 text-center">
                    <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                      View All
                    </button>
                  </li>
                </ul>
              ) : (
                <p className="p-4 text-sm text-gray-500 text-center">No new notifications.</p>
              )}
            </div>
          )}
        </div>

        <div className="relative" ref={menuRef}>
          <button
            onClick={() => {
              setShowMenu((prev) => !prev);
              setShowNotifications(false);
            }}
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100"
          >
            <img src="/user.png" alt="User" className="w-10 h-10 rounded-full object-cover" />
            <div className="text-sm text-left">
              <p className="font-semibold text-gray-800">{userName || "User"}</p>
              <p className="text-gray-500 text-xs">{userType === "teacher" ? "Teacher" : "Student"}</p>
            </div>
          </button>

          {showMenu && (
            <div className="absolute right-0 mt-2 w-44 bg-white border border-gray-200 rounded-lg shadow-lg">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100"
              >
                <LogOut className="w-4 h-4" />
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
