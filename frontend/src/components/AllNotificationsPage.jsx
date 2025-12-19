import React, { useState, useEffect, useCallback } from "react";
import { ArrowLeft, Bell, Calendar, BookOpen, CheckCircle, Filter, Send, Inbox } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function AllNotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [markingAll, setMarkingAll] = useState(false);
  const navigate = useNavigate();
  const [tab, setTab] = useState("inbox");

  const unreadCount = notifications.filter(n => !n.is_read).length;

  const filteredNotifications = notifications.filter(n => {
    if (filter === "all") return true;
    if (filter === "unread") return !n.is_read;
    return true;
  });

  const fetchInbox = useCallback(async () => {
    const token = localStorage.getItem("access_token");
    if (!token) return navigate("/login");

    setLoading(true);
    try {
      const res = await fetch("http://localhost:8000/api/notifications/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setNotifications(data);
      } else if (res.status === 401) {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        navigate("/login");
      }
    } catch (err) {
      console.error("Failed to fetch inbox notifications:", err);
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  const fetchSent = useCallback(async () => {
    const token = localStorage.getItem("access_token");
    if (!token) return navigate("/login");

    setLoading(true);
    try {
      const res = await fetch("http://localhost:8000/api/notifications/sent/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setNotifications(data);
      } else if (res.status === 401) {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        navigate("/login");
      }
    } catch (err) {
      console.error("Failed to fetch sent notifications:", err);
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    if (tab === "inbox") fetchInbox();
    else fetchSent();
  }, [tab, fetchInbox, fetchSent]);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) return;

    const wsProtocol = window.location.protocol === "https:" ? "wss" : "ws";
    const wsUrl = `${wsProtocol}://localhost:8000/ws/notifications/?token=${encodeURIComponent(token)}`;
    
    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      console.log("WebSocket connected");
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        
        if (data.type === "new_notification" && tab === "inbox") {
          setNotifications(prev => [data.notification, ...prev]);
        } else if (data.type === "notification_read" && tab === "inbox") {
          setNotifications(prev =>
            prev.map(n => n.id === data.notification_id ? { ...n, is_read: true } : n)
          );
        } else if (data.type === "all_notifications_read" && tab === "inbox") {
          setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
        }
      } catch (err) {
        console.error("Failed to parse WebSocket message:", err);
      }
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    return () => {
      if (ws && ws.readyState === WebSocket.OPEN) {
        ws.close();
      }
    };
  }, [tab]);

  const handleMarkAsRead = async (id) => {
    const token = localStorage.getItem("access_token");
    try {
      const res = await fetch(`http://localhost:8000/api/notifications/${id}/mark-read/`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      });
      if (res.ok) {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
      }
    } catch (err) {
      console.error("Failed to mark notification as read:", err);
    }
  };

  const handleMarkAllAsRead = async () => {
    const token = localStorage.getItem("access_token");
    if (!token || unreadCount === 0) return;

    setMarkingAll(true);
    try {
      const res = await fetch("http://localhost:8000/api/notifications/mark-all-read/", {
        method: "POST",
        headers: { 
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ mark_all: true })
      });

      if (res.ok) {
        setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
        alert("All notifications marked as read!");
      }
    } catch (err) {
      console.error("Failed to mark all as read:", err);
      alert("Network error. Please try again.");
    } finally {
      setMarkingAll(false);
    }
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;

    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getSenderDisplay = (notification) => {
    if (tab === "sent") {
      return notification.recipient_name || notification.recipient_email || "Recipient";
    }
    return notification.sender || "System";
  };
  
  const getCourseDisplay = (notification) => {
    if (notification.course_title && notification.course_title !== "General") {
      return notification.course_title;
    }
    return null;
  };
  
  const hasCourseInfo = (notification) => 
    !!notification.course_title && notification.course_title !== "General";
  
  const getDisplayTitle = (notification) => {
    if (notification.title && notification.title !== "Notification") {
      return notification.title;
    }
    
    if (hasCourseInfo(notification)) {
      return `${notification.course_title} Update`;
    }
    
    if (notification.message) {
      return notification.message.length > 50 
        ? `${notification.message.substring(0, 50)}...`
        : notification.message;
    }
    
    return tab === "sent" ? "Sent Notification" : "New Notification";
  };

  const getRecipientInfo = (notification) => {
    if (tab === "sent") {
      return {
        name: notification.recipient_name || "Recipient",
        email: notification.recipient_email,
        isInstructor: notification.recipient_role === "instructor"
      };
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="h-28"></div>
      
      <div className="p-4 md:p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <button 
              onClick={() => navigate("/teacher")} 
              className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft size={20} /> 
              <span>Back</span>
            </button>
            <div className="flex items-center gap-3">
              <Bell className="text-gray-600" size={24} />
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Notifications</h1>
            </div>
            <div className="w-20"></div>
          </div>

          {/* Tabs */}
          <div className="flex gap-4 mb-6">
            <button
              onClick={() => setTab("inbox")}
              className={`flex items-center gap-2 px-5 py-3 rounded-lg font-medium transition-colors ${
                tab === "inbox" 
                  ? "bg-blue-600 text-white shadow-sm" 
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <Inbox size={18} />
              Inbox
              {tab === "inbox" && unreadCount > 0 && (
                <span className="ml-1 px-2 py-0.5 text-xs bg-white text-blue-600 rounded-full">
                  {unreadCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setTab("sent")}
              className={`flex items-center gap-2 px-5 py-3 rounded-lg font-medium transition-colors ${
                tab === "sent" 
                  ? "bg-blue-600 text-white shadow-sm" 
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <Send size={18} />
              Sent
            </button>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-6">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total</p>
                  <p className="text-2xl font-bold text-gray-900">{notifications.length}</p>
                </div>
                <div className="h-8 w-px bg-gray-300"></div>
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    {tab === "inbox" ? "Unread" : "Sent"}
                  </p>
                  <p className={`text-2xl font-bold ${
                    tab === "inbox" ? "text-blue-600" : "text-gray-900"
                  }`}>
                    {tab === "inbox" ? unreadCount : notifications.length}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <button 
                  onClick={() => setFilter(prev => prev === "all" ? "unread" : "all")}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-lg border border-gray-300 transition-colors"
                >
                  <Filter size={16} />
                  <span className="capitalize">{filter}</span>
                </button>

                {tab === "inbox" && (
                  <button 
                    onClick={handleMarkAllAsRead}
                    disabled={unreadCount === 0 || markingAll}
                    className={`px-4 py-2 text-sm font-medium rounded-lg border transition-colors flex items-center gap-2 ${
                      unreadCount === 0 || markingAll
                        ? "text-gray-400 border-gray-300 bg-gray-50 cursor-not-allowed"
                        : "text-blue-600 hover:text-blue-800 hover:bg-blue-50 border-blue-300"
                    }`}
                  >
                    {markingAll ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                    ) : (
                      <>
                        <CheckCircle size={16} />
                        Mark all as read
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {loading ? (
              <div className="text-center py-16 px-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading {tab} notifications...</p>
              </div>
            ) : filteredNotifications.length === 0 ? (
              <div className="text-center py-16 px-4">
                <Bell className="mx-auto text-gray-300 mb-4" size={48} />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No {tab} notifications
                </h3>
                <p className="text-gray-500 mb-4">
                  {tab === "inbox" 
                    ? (filter === "all" 
                      ? "You don't have any notifications yet." 
                      : `No ${filter} notifications found.`)
                    : "You haven't sent any notifications yet."
                  }
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {filteredNotifications.map(notification => {
                  const courseDisplay = getCourseDisplay(notification);
                  const displayTitle = getDisplayTitle(notification);
                  const isSystem = getSenderDisplay(notification) === "System";
                  const hasCourse = hasCourseInfo(notification);
                  const recipientInfo = getRecipientInfo(notification);
                  
                  return (
                    <div 
                      key={notification.id} 
                      className={`p-5 transition-colors border-l-4 ${
                        notification.is_read 
                          ? "border-transparent hover:border-gray-300 hover:bg-gray-50" 
                          : "border-blue-500 bg-blue-50 hover:bg-blue-100"
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            tab === "sent" 
                              ? "bg-purple-100" 
                              : isSystem 
                                ? "bg-blue-100" 
                                : "bg-green-100"
                          }`}>
                            {tab === "sent" ? (
                              <Send className="text-purple-600" size={20} />
                            ) : isSystem ? (
                              <Bell className="text-blue-600" size={20} />
                            ) : (
                              <Calendar className="text-green-600" size={20} />
                            )}
                          </div>
                        </div>

                        <div className="flex-grow">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex-1">
                              {courseDisplay && (
                                <div className="mb-2">
                                  <div className="flex items-center gap-2">
                                    <BookOpen size={16} className="text-gray-500" />
                                    <span className="text-lg font-semibold text-gray-900">
                                      {courseDisplay}
                                    </span>
                                  </div>
                                </div>
                              )}

                              <p className="text-md font-semibold text-gray-800 mb-1">
                                {displayTitle}
                              </p>

                              <div className="flex items-center gap-2 mt-1 flex-wrap">
                                <p className="text-sm font-medium text-gray-600">
                                  {getSenderDisplay(notification)}
                                </p>
                                
                                {tab === "inbox" && !isSystem && (
                                  <span className="text-xs font-normal text-gray-500 px-2 py-0.5 bg-gray-100 rounded-full">
                                    Instructor
                                  </span>
                                )}
                                
                                {tab === "sent" && recipientInfo && recipientInfo.isInstructor && (
                                  <span className="text-xs font-normal text-gray-500 px-2 py-0.5 bg-gray-100 rounded-full">
                                    Instructor
                                  </span>
                                )}
                                
                                {tab === "inbox" && !notification.is_read && (
                                  <span className="text-xs font-medium text-blue-600 px-2 py-0.5 bg-blue-100 rounded-full">
                                    New
                                  </span>
                                )}
                              </div>

                              {tab === "sent" && recipientInfo && (
                                <div className="mt-2 text-sm">
                                  <p className="text-gray-600">
                                    <span className="font-medium">To: </span>
                                    {recipientInfo.name}
                                    {recipientInfo.email && ` (${recipientInfo.email})`}
                                  </p>
                                </div>
                              )}
                            </div>

                            <div className="flex flex-col items-end">
                              <span className="text-xs text-gray-500 whitespace-nowrap mb-2">
                                {formatTime(notification.created_at)}
                              </span>
                              {tab === "inbox" && (
                                notification.is_read ? (
                                  <span className="text-xs text-green-600 flex items-center gap-1">
                                    <CheckCircle size={12} /> Read
                                  </span>
                                ) : (
                                  <span className="text-xs text-gray-500">Unread</span>
                                )
                              )}
                              {tab === "sent" && (
                                <span className="text-xs text-purple-600 flex items-center gap-1">
                                  <Send size={12} /> Sent
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="mt-3">
                            <p className="text-gray-800 leading-relaxed">
                              {notification.message}
                            </p>
                          </div>

                          <div className="flex items-center gap-4 mt-3">
                            {tab === "inbox" && !notification.is_read && (
                              <button 
                                onClick={() => handleMarkAsRead(notification.id)} 
                                className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                              >
                                Mark as read
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {filteredNotifications.length > 0 && !loading && (
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-500">
                Showing {filteredNotifications.length} of {notifications.length} {tab} notification{notifications.length !== 1 ? 's' : ''}
                {filter !== "all" && ` (filtered by ${filter})`}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}