import React from "react";
import "./Button.css";

const Button = ({ type, label }) => {
  return (
    <button type={type} className="btn">
      {label}
    </button>
  );
};

export default Button;
