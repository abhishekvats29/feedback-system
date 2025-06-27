import React from "react";

const Button = ({ children, type = "button", onClick, className = "" }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-all ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
