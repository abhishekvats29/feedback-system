import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import { toast } from "react-toastify";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import ReactMarkdown from "react-markdown";
import axios from "axios";
import API_BASE_URL from "../utils/api";

const EmployeeDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const feedbackRef = useRef();

  const [feedbacks, setFeedbacks] = useState([]);
  const [acknowledged, setAcknowledged] = useState(false);

  // 🔄 Fetch feedback from backend
  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/feedback/employee`);
        setFeedbacks(res.data);
        const acknowledgedFeedback = res.data.find((fb) => fb.acknowledged);
        setAcknowledged(!!acknowledgedFeedback);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load feedback");
      }
    };
    fetchFeedback();
  }, []);

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    navigate("/");
  };

  const handleAcknowledge = async () => {
    try {
      const feedbackId = feedbacks[0]?.id;
      if (!feedbackId) return toast.error("No feedback found");

      await axios.put(`${API_BASE_URL}/api/feedback/acknowledge`, {
        feedback_id: feedbackId,
        acknowledged: true,
      });

      setAcknowledged(true);
      toast.success("Feedback acknowledged!");
    } catch (err) {
      console.error(err);
      toast.error("Error acknowledging feedback");
    }
  };

  const handleExportPDF = async () => {
    const input = feedbackRef.current;
    if (!input) return;

    const canvas = await html2canvas(input);
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF();
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save("feedback.pdf");
    toast.success("Feedback exported as PDF!");
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 sm:px-6 md:px-10">
      <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-6 text-center text-blue-600">
        Welcome, {user?.email}
      </h2>

      <div ref={feedbackRef} className="space-y-6">
        <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4">
          Your Feedback
        </h3>

        {feedbacks.length === 0 ? (
          <p className="text-gray-500 text-sm sm:text-base">
            No feedback available yet.
          </p>
        ) : (
          feedbacks.map((fb, idx) => (
            <div
              key={idx}
              className="bg-white p-4 sm:p-5 md:p-6 rounded-lg shadow-sm border"
            >
              <p className="text-sm text-gray-600 mb-2">
                <strong>From Manager:</strong> {fb.manager_id}
              </p>
              <p className="mt-2 text-sm text-gray-700">
                <strong>Strengths:</strong>{" "}
                <ReactMarkdown>{fb.strengths}</ReactMarkdown>
              </p>
              <p className="mt-2 text-sm text-gray-700">
                <strong>Improvements:</strong>{" "}
                <ReactMarkdown>{fb.improvements}</ReactMarkdown>
              </p>
              <p className="mt-2 text-sm text-gray-700">
                <strong>Sentiment:</strong>{" "}
                <span
                  className={
                    fb.sentiment === "positive"
                      ? "text-green-600 font-semibold"
                      : "text-red-600 font-semibold"
                  }
                >
                  {fb.sentiment}
                </span>
              </p>
              <p className="mt-2 text-xs text-gray-400 italic">
                (Anonymous Feedback)
              </p>
            </div>
          ))
        )}
      </div>

      {feedbacks.length > 0 && (
        <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:gap-4 gap-3">
          {!acknowledged ? (
            <Button onClick={handleAcknowledge} className="w-full sm:w-auto">
              Acknowledge Feedback
            </Button>
          ) : (
            <p className="text-green-600 font-medium">✅ Feedback acknowledged</p>
          )}

          <Button
            onClick={handleExportPDF}
            className="bg-blue-600 w-full sm:w-auto"
          >
            Export as PDF
          </Button>

          <Button
            onClick={handleLogout}
            className="bg-red-500 text-white w-full sm:w-auto"
          >
            Logout
          </Button>
        </div>
      )}
    </div>
  );
};

export default EmployeeDashboard;
