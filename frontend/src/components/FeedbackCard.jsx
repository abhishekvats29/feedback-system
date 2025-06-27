import React from "react";

const FeedbackCard = ({ feedback }) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-5 mb-4 border border-gray-200">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-semibold text-gray-800">
          👤 {feedback.employeeName || "Employee"}
        </h3>
        <span
          className={`text-sm px-2 py-1 rounded-full font-medium ${
            feedback.sentiment === "positive"
              ? "bg-green-100 text-green-700"
              : feedback.sentiment === "neutral"
              ? "bg-yellow-100 text-yellow-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {feedback.sentiment.charAt(0).toUpperCase() + feedback.sentiment.slice(1)}
        </span>
      </div>

      <div className="mb-2">
        <p className="text-gray-600 text-sm mb-1 font-semibold">✅ Strengths:</p>
        <p className="text-gray-700">{feedback.strengths}</p>
      </div>

      <div>
        <p className="text-gray-600 text-sm mb-1 font-semibold">⚠️ Areas to Improve:</p>
        <p className="text-gray-700">{feedback.improvements}</p>
      </div>
    </div>
  );
};

export default FeedbackCard;
