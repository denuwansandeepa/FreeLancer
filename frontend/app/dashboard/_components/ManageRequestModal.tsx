"use client";

import { useState, useEffect, useRef } from "react";

interface ManageRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  requestId: string | null;
  role: string;
  onUpdate: () => void;
}

export default function ManageRequestModal({
  isOpen,
  onClose,
  requestId,
  role,
  onUpdate,
}: ManageRequestModalProps) {
  const [requestData, setRequestData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      if (requestId) {
        fetchRequestData();
      }
    } else {
      document.body.style.overflow = "unset";
      setRequestData(null);
      setNewMessage("");
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen, requestId]);

  async function fetchRequestData() {
    setLoading(true);
    try {
      const res = await fetch(`/api/hire-requests/${requestId}`);
      const data = await res.json();
      if (data.success) {
        setRequestData(data.hireRequest);
        scrollToBottom();
      }
    } catch (err) {
      console.error("Error fetching request data:", err);
    } finally {
      setLoading(false);
    }
  }

  function scrollToBottom() {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  }

  const handleUpdateStatus = async (newStatus: string) => {
    try {
      const res = await fetch(`/api/hire-requests/${requestId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setRequestData((prev: any) => ({ ...prev, status: newStatus }));
        onUpdate();
      }
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    setSending(true);
    try {
      const res = await fetch(`/api/hire-requests/${requestId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: newMessage }),
      });
      const data = await res.json();
      if (data.success) {
        setRequestData((prev: any) => ({
          ...prev,
          chatMessages: [...prev.chatMessages, data.message],
        }));
        setNewMessage("");
        scrollToBottom();
      }
    } catch (err) {
      console.error("Error sending message:", err);
    } finally {
      setSending(false);
    }
  };

  if (!isOpen || !requestId) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex justify-center items-center overflow-y-auto bg-black/60 backdrop-blur-sm p-4 md:p-10 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative z-10 w-full max-w-2xl transform flex flex-col h-[85vh] rounded-3xl bg-white text-left shadow-2xl transition-all duration-300 border border-gray-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b px-8 py-5">
          <div>
            <h3 className="text-xl font-black text-gray-900">
              {loading
                ? "Loading..."
                : requestData?.jobRequestId
                ? "Manage Job Application"
                : "Manage Hire Request"}
            </h3>
            {!loading && requestData && (
              <p className="mt-1 text-sm font-semibold text-gray-500">
                {requestData?.jobRequestId
                  ? role === "FREELANCER"
                    ? `Applied to: ${requestData.client.name}`
                    : `Applicant: ${requestData.freelancer.name}`
                  : role === "FREELANCER"
                  ? `From: ${requestData.client.name}`
                  : `To: ${requestData.freelancer.name}`}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {loading ? (
          <div className="flex-1 flex items-center justify-center">
            <svg
              className="animate-spin h-8 w-8 text-blue-600"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          </div>
        ) : requestData ? (
          <>
            {/* Info Bar */}
            <div className="bg-gray-50 px-8 py-4 flex flex-wrap gap-4 items-center justify-between border-b text-sm">
              <div className="flex gap-4">
                <div className="font-bold text-gray-900">
                  <span className="text-gray-500 font-normal">Service / Job:</span>{" "}
                  {requestData.jobRequest ? `Job: ${requestData.jobRequest.title}` : (requestData.service?.title || "Custom Job")}
                </div>
                <div className="font-bold text-gray-900">
                  <span className="text-gray-500 font-normal">Budget:</span>{" "}
                  {requestData.budget || "Negotiable"}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold ${
                    requestData.status === "PENDING"
                      ? "bg-yellow-100 text-yellow-700"
                      : requestData.status === "ACCEPTED"
                        ? "bg-blue-100 text-blue-700"
                        : requestData.status === "COMPLETED"
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-red-100 text-red-700"
                  }`}
                >
                  {requestData.status}
                </span>

                {/* Accept / Reject Buttons */}
                {requestData.status === "PENDING" && (
                  <>
                    {/* For Job Application, the client accepts/rejects */}
                    {requestData.jobRequestId && role === "CLIENT" && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleUpdateStatus("ACCEPTED")}
                          className="rounded-full bg-blue-600 px-4 py-1.5 text-xs font-bold text-white hover:bg-blue-700 transition cursor-pointer"
                        >
                          Accept Application
                        </button>
                        <button
                          onClick={() => handleUpdateStatus("REJECTED")}
                          className="rounded-full bg-red-100 px-4 py-1.5 text-xs font-bold text-red-700 hover:bg-red-200 transition cursor-pointer"
                        >
                          Reject Application
                        </button>
                      </div>
                    )}
                    {/* For Direct Hire, the freelancer accepts/rejects */}
                    {!requestData.jobRequestId && role === "FREELANCER" && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleUpdateStatus("ACCEPTED")}
                          className="rounded-full bg-blue-600 px-4 py-1.5 text-xs font-bold text-white hover:bg-blue-700 transition cursor-pointer"
                        >
                          Accept Hire
                        </button>
                        <button
                          onClick={() => handleUpdateStatus("REJECTED")}
                          className="rounded-full bg-red-100 px-4 py-1.5 text-xs font-bold text-red-700 hover:bg-red-200 transition cursor-pointer"
                        >
                          Reject Hire
                        </button>
                      </div>
                    )}
                  </>
                )}

                {/* Mark Completed Button */}
                {requestData.status === "ACCEPTED" && (
                  <button
                    onClick={() => handleUpdateStatus("COMPLETED")}
                    className="rounded-full bg-emerald-600 px-4 py-1.5 text-xs font-bold text-white hover:bg-emerald-700 transition cursor-pointer"
                  >
                    Mark Completed
                  </button>
                )}
              </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-8 space-y-6 bg-white">
              {/* Initial Request Message */}
              {(() => {
                const isJobApplication = !!requestData.jobRequestId;
                const isInitialMine = isJobApplication
                  ? role === "FREELANCER"
                  : role === "CLIENT";
                const initialSenderName = isJobApplication
                  ? requestData.freelancer.name
                  : requestData.client.name;

                return (
                  <div
                    className={`flex flex-col gap-1 ${
                      isInitialMine ? "items-end" : "items-start"
                    }`}
                  >
                    <span
                      className={`text-xs font-bold text-gray-400 ${
                        isInitialMine ? "pr-4" : "pl-4"
                      }`}
                    >
                      {isInitialMine ? "You" : initialSenderName}
                    </span>
                    <div
                      className={`px-5 py-3 rounded-2xl max-w-[80%] shadow-sm text-sm font-medium ${
                        isInitialMine
                          ? "bg-blue-600 text-white rounded-tr-none"
                          : "bg-gray-100 text-gray-800 rounded-tl-none"
                      }`}
                    >
                      <p className="text-sm font-medium">{requestData.message}</p>
                    </div>
                  </div>
                );
              })()}

              {requestData.chatMessages.map((msg: any) => {
                const isMine =
                  msg.senderId ===
                  (role === "FREELANCER"
                    ? requestData.freelancer.id
                    : requestData.client.id);
                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col gap-1 ${isMine ? "items-end" : "items-start"}`}
                  >
                    <span
                      className={`text-xs font-bold text-gray-400 ${isMine ? "pr-4" : "pl-4"}`}
                    >
                      {isMine
                        ? "You"
                        : role === "FREELANCER"
                          ? requestData.client.name
                          : requestData.freelancer.name}
                    </span>
                    <div
                      className={`px-5 py-3 rounded-2xl max-w-[80%] shadow-sm text-sm font-medium ${
                        isMine
                          ? "bg-blue-600 text-white rounded-tr-none"
                          : "bg-gray-100 text-gray-800 rounded-tl-none"
                      }`}
                    >
                      {msg.message}
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Chat Input form */}
            <div className="border-t p-4 bg-gray-50 rounded-b-3xl">
              <form onSubmit={handleSendMessage} className="flex gap-3">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your message here..."
                  className="flex-1 rounded-full border border-gray-300 bg-white px-5 py-3 text-sm text-gray-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  disabled={requestData.status === "REJECTED"}
                />
                <button
                  type="submit"
                  disabled={
                    sending ||
                    !newMessage.trim() ||
                    requestData.status === "REJECTED"
                  }
                  className="rounded-full bg-blue-600 px-6 py-3 font-bold text-white transition hover:bg-blue-700 disabled:opacity-50"
                >
                  Send
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            Failed to load data.
          </div>
        )}
      </div>
    </div>
  );
}
