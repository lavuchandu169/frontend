import React from "react";
import "./FormInput.css";

const FormInput = ({
  type,
  name,
  label,
  value,
  onChange,
  error,
  isPassword,
  toggleVisibility,
}) => {
  return (
    <div className="form-input">
      <label htmlFor={name}>{label}</label>
      <div className="input-wrapper">
        <input
          type={type}
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          required
          className="input-field"
        />
        {isPassword && (
          <button
            type="button"
            className="toggle-visibility"
            onClick={toggleVisibility}
          >
            {type === "password" ? "Show" : "Hide"}
          </button>
        )}
      </div>
      {error && <p className="error-text">{error}</p>}
    </div>
  );
};

export default FormInput;
