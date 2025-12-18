import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../components/Header";
import { Bell, ArrowLeft } from "lucide-react";

export default function NotificationPage() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [title, setTitle] = useState("");
  const [titleError, setTitleError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [courseTitle, setCourseTitle] = useState("");
  const [characterCount, setCharacterCount] = useState(0);

  useEffect(() => {
    const fetchCourseInfo = async () => {
      const token = localStorage.getItem("access_token");
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const res = await fetch(
          `http://localhost:8000/api/students/courses/${id}/`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (res.ok) {
          const data = await res.json();
          setCourseTitle(data.title || "Course");
        } else {
          console.error("Failed to fetch course info:", res.statusText);
        }
      } catch (err) {
        console.error("Failed to fetch course info:", err);
      }
    };

    fetchCourseInfo();
  }, [id, navigate]);

  const handleTitleChange = (e) => setTitle(e.target.value);

  const handleMessageChange = (e) => {
    const text = e.target.value;
    setMessage(text);
    setCharacterCount(text.length);
  };

  const handleClear = () => {
    setTitle("");
    setMessage("");
    setCharacterCount(0);
    setError("");
    setTitleError("");
    setSuccess("");
  };

  const handleSend = async () => {
    if (!title.trim()) {
      setTitleError("Please enter a notification title.");
      return;
    }
    setTitleError("");

    if (!message.trim()) {
      setError("Please enter a notification message.");
      return;
    }
    if (message.length > 500) {
      setError("Message must be 500 characters or less.");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    const token = localStorage.getItem("access_token");

    try {
      const res = await fetch(
        "http://localhost:8000/api/notifications/send-course/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            course_id: id,
            title: title.trim(),
            message: message.trim(),
          }),
        }
      );

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.detail || "Failed to send notification");
      }

      setSuccess("Notification sent successfully to all students in this course!");
      handleClear();

      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header userType="teacher" />

      <div className="pt-24 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <div className="mb-8">
          <button
            onClick={() => navigate(`/teacher/courses/${id}`)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6"
          >
            <ArrowLeft size={20} /> Back to Course
          </button>

          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-teal-100 rounded-lg">
              <Bell className="text-teal-600" size={24} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Send Notification</h1>
              <p className="text-gray-600">
                Send a message to all students in {courseTitle || "this course"}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6 sm:p-8">
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Course
            </label>
            <div className="px-4 py-3 bg-gray-50 rounded-lg border border-gray-200">
              <p className="font-medium text-gray-800">{courseTitle || "Loading course..."}</p>
              <p className="text-sm text-gray-500 mt-1">
                Only students registered in this course will receive your message
              </p>
            </div>
          </div>

          {/* Title Field */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notification Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={handleTitleChange}
              placeholder="Enter notification title"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-teal-500 focus:ring-2 focus:ring-teal-200 focus:outline-none"
              maxLength={100}
            />
            <p className="text-sm text-gray-500 mt-1">{title.length}/100 characters</p>
            {titleError && (
              <p className="text-red-700 mt-1 text-sm">{titleError}</p>
            )}
          </div>

          {/* Message Field */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notification Message <span className="text-red-500">*</span>
            </label>
            <textarea
              value={message}
              onChange={handleMessageChange}
              placeholder="Enter your notification message here..."
              className="w-full h-48 px-4 py-3 border border-gray-300 rounded-lg focus:border-teal-500 focus:ring-2 focus:ring-teal-200 focus:outline-none resize-none"
              maxLength={500}
            />
            <div className="flex justify-between items-center mt-2">
              <p className="text-sm text-gray-500">{characterCount}/500 characters</p>
              <button
                onClick={handleClear}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Clear
              </button>
            </div>
          </div>

          {/* Tips */}
          <div className="mb-8 p-4 bg-blue-50 rounded-lg border border-blue-100">
            <h3 className="font-medium text-blue-800 mb-2 flex items-center gap-2">
              <Bell size={16} /> Tips for effective notifications:
            </h3>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Be clear and concise</li>
              <li>• Include important dates and deadlines</li>
              <li>• Use a friendly but professional tone</li>
              <li>• Double-check for typos before sending</li>
            </ul>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700">{error}</p>
            </div>
          )}
          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-700">{success}</p>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => navigate(`/teacher/courses/${id}`)}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex-1"
            >
              Cancel
            </button>
            <button
              onClick={handleSend}
              disabled={loading || !message.trim() || !title.trim()}
              className="px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 flex-1"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Sending...
                </>
              ) : (
                <>
                  <Bell size={20} /> Send Notification
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
