// ✅ ManagerDashboard.jsx — Fully Connected to Backend
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import InputField from "../components/InputField";
import Button from "../components/Button";
import Navbar from "../components/Navbar";
import { toast } from "react-toastify";
import axios from "axios";
import { jsPDF } from "jspdf";
import Markdown from "react-markdown";

const ManagerDashboard = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const [feedbacks, setFeedbacks] = useState([]);
  const [formData, setFormData] = useState({
    employee_id: "",
    strengths: "",
    improvements: "",
    sentiment: "positive",
  });

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const fetchFeedbacks = async () => {
    try {
      const res = await axios.get("/api/feedback/manager");
      setFeedbacks(res.data);
    } catch (err) {
      toast.error("Failed to fetch feedbacks");
    }
  };

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    navigate("/");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/api/feedback/", formData);
      toast.success("Feedback submitted");
      setFormData({
        employee_id: "",
        strengths: "",
        improvements: "",
        sentiment: "positive",
      });
      fetchFeedbacks();
    } catch (err) {
      toast.error("Error submitting feedback");
    }
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(12);
    doc.text("Manager Feedback Report", 10, 10);
    feedbacks.forEach((fb, idx) => {
      const y = 20 + idx * 40;
      doc.text(`Employee ID: ${fb.employee_id}`, 10, y);
      doc.text(`Strengths: ${fb.strengths}`, 10, y + 10);
      doc.text(`Improvements: ${fb.improvements}`, 10, y + 20);
      doc.text(`Sentiment: ${fb.sentiment}`, 10, y + 30);
    });
    doc.save("feedback-report.pdf");
  };

  return (
    <>
      <Navbar title="Manager Dashboard" onLogout={handleLogout} />

      <div className="max-w-4xl mx-auto mt-8 p-4">
        <form
          onSubmit={handleSubmit}
          className="bg-white shadow p-6 rounded-lg mb-6"
        >
          <h3 className="text-2xl font-bold mb-4 text-blue-600">
            Submit Employee Feedback
          </h3>

          <InputField
            label="Employee ID"
            name="employee_id"
            value={formData.employee_id}
            onChange={handleChange}
            placeholder="Enter Employee ID"
            required
          />

          <InputField
            label="Strengths"
            name="strengths"
            type="textarea"
            value={formData.strengths}
            onChange={handleChange}
            placeholder="Strengths in markdown"
            required
          />

          <InputField
            label="Improvements"
            name="improvements"
            type="textarea"
            value={formData.improvements}
            onChange={handleChange}
            placeholder="Improvement points"
            required
          />

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Sentiment
            </label>
            <select
              name="sentiment"
              value={formData.sentiment}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="positive">Positive</option>
              <option value="neutral">Neutral</option>
              <option value="negative">Negative</option>
            </select>
          </div>

          <Button type="submit" className="w-full">
            Submit Feedback
          </Button>
        </form>

        <div className="bg-white shadow p-6 rounded-lg">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-gray-700">
              Submitted Feedbacks
            </h3>
            {feedbacks.length > 0 && (
              <Button onClick={exportToPDF} className="text-sm">
                Export as PDF
              </Button>
            )}
          </div>

          {feedbacks.length === 0 ? (
            <p className="text-gray-500">No feedback submitted yet.</p>
          ) : (
            feedbacks.map((fb, idx) => (
              <div key={idx} className="mb-4 p-4 border rounded shadow-sm">
                <p className="font-semibold">Employee ID: {fb.employee_id}</p>
                <div className="mb-2">
                  <p className="font-medium text-green-600">Strengths:</p>
                  <Markdown className="text-sm text-gray-800">
                    {fb.strengths}
                  </Markdown>
                </div>
                <div className="mb-2">
                  <p className="font-medium text-red-600">Improvements:</p>
                  <Markdown className="text-sm text-gray-800">
                    {fb.improvements}
                  </Markdown>
                </div>
                <p className="text-sm font-semibold">Sentiment: {fb.sentiment}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default ManagerDashboard;
