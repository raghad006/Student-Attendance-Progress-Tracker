import React, { useState, useRef, useEffect } from "react";
import { Bell, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Header = ({ onLogout, userType }) => {
  const [showMenu, setShowMenu] = useState(false);
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

  const handleLogout = () => {
    setShowMenu(false);
    if (onLogout) onLogout();
    navigate("/login");
  };

  return (
    <header className="fixed top-0 left-0 w-full h-24 bg-white flex items-center justify-between px-10 shadow-md z-50">

      {/* LEFT SECTION (Logo + Title + Search) */}
      <div className="flex items-center gap-6">

        <img
          src="/book.png"
          alt="University Logo"
          className="w-16 h-16 object-contain"
        />

        {/* App Title */}
        <h1 className="text-3xl font-bold text-gray-800 tracking-tight">
          Attendance Tracker
        </h1>
      </div>


      <div className="flex items-center gap-6">

        <button className="p-3 rounded-full hover:bg-gray-100">
          <Bell className="w-6 h-6 text-gray-700" />
        </button>

        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setShowMenu((prev) => !prev)}
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100"
          >
            <img
              src="/user.png"
              alt="User"
              className="w-10 h-10 rounded-full object-cover"
            />
            <div className="text-sm text-left">
              <p className="font-semibold text-gray-800">
                {userType === "teacher" ? "Teacher Name" : "Student Name"}
              </p>
              <p className="text-gray-500 text-xs">
                {userType === "teacher" ? "Teacher" : "Student"}
              </p>
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
