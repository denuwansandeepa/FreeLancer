"use client";

import { useEffect, useState } from "react";

interface MessagesModalProps {
  isOpen: boolean;
  onClose: () => void;
  role: string;
}

export default function MessagesModal({
  isOpen,
  onClose,
  role,
}: MessagesModalProps) {
  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    if (role === "FREELANCER") {
      setNotifications([
        {
          id: "f1",
          text: "New hire request received from Saman Enterprises.",
          time: "5 mins ago",
          read: false,
        },
        {
          id: "f2",
          text: "Client accepted your custom service offer.",
          time: "1 hour ago",
          read: false,
        },
        {
          id: "f3",
          text: "You successfully updated your freelancer profile.",
          time: "2 hours ago",
          read: true,
        },
      ]);
    } else {
      setNotifications([
        {
          id: "c1",
          text: "Sandeepa (Freelancer) updated their location to Colombo.",
          time: "10 mins ago",
          read: false,
        },
        {
          id: "c2",
          text: "Your job request has received 3 applications.",
          time: "3 hours ago",
          read: false,
        },
        {
          id: "c3",
          text: "heshitha (Freelancer) accepted your invitation to interview.",
          time: "5 hours ago",
          read: true,
        },
      ]);
    }
  }, [isOpen, role]);

  const handleClose = () => {
    onClose();
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleItemClick = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex justify-center items-start overflow-y-auto bg-black/60 backdrop-blur-sm p-4 md:p-10 animate-fade-in"
      onClick={handleClose}
    >
      {/* Modal Container */}
      <div
        className="relative z-10 w-full max-w-lg transform rounded-3xl bg-white p-8 text-left shadow-2xl transition-all duration-300 border border-gray-100 my-auto flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute right-6 top-6 rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors cursor-pointer"
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-black text-gray-900">Inbox Notifications</h3>
            <p className="mt-1 text-sm text-gray-500">All recent notification messages for you.</p>
          </div>
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="text-xs font-bold text-blue-600 hover:text-blue-700 cursor-pointer"
            >
              Mark all as read
            </button>
          )}
        </div>

        {/* Notifications List */}
        <div className="space-y-3 overflow-y-auto max-h-[50vh] pr-1">
          {notifications.length === 0 ? (
            <div className="text-center py-10 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
              <p className="text-gray-500">No notifications in your inbox.</p>
            </div>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification.id}
                onClick={() => handleItemClick(notification.id)}
                className={`p-4 rounded-2xl cursor-pointer border transition-all ${
                  notification.read
                    ? "bg-white hover:bg-gray-50 border-gray-100"
                    : "bg-blue-50/50 hover:bg-blue-50 border-blue-200 border-l-4 border-l-blue-500"
                }`}
              >
                <div className="flex justify-between items-start gap-3">
                  <p className="text-sm text-gray-800 leading-relaxed font-medium">
                    {notification.text}
                  </p>
                  {!notification.read && (
                    <span className="h-2.5 w-2.5 rounded-full bg-blue-600 shrink-0 mt-1"></span>
                  )}
                </div>
                <div className="flex justify-between items-center mt-3 pt-2 border-t border-gray-100/50">
                  <span className="text-[10px] text-gray-400 font-bold uppercase">{notification.time}</span>
                  <span className="text-[10px] font-black text-blue-600 hover:underline">
                    View Context
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="mt-6 border-t pt-4 text-center">
          <button
            onClick={handleClose}
            className="rounded-full bg-gray-900 px-6 py-2.5 text-xs font-bold text-white hover:bg-gray-800 transition-all cursor-pointer"
          >
            Close Notifications
          </button>
        </div>
      </div>
    </div>
  );
}
