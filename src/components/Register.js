import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import DOMPurify from "dompurify";
import { setFormData, resetForm } from "../redux/registerSlice";
import FormInput from "./FormInput";
import { useNavigate } from "react-router-dom";
import Button from "./Button";
import "./Register.css";
import { setLoginUser } from "../redux/loginSlice";

const Register = () => {
  const dispatch = useDispatch();
  const formData = useSelector((state) => state.register);
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

  useEffect(() => {
    fetch("http://127.0.0.1:5000/verifyUser", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ user: localStorage.getItem("user") }),
    })
      .then((res) => {
        if (res.status === 200) {
          res.json().then((res) => {
            dispatch(setLoginUser(res.userId));
            let goToDashBoard = () => navigate("/dashboard");
            goToDashBoard();
          });
        }
      })
      .catch((err) => {
        // alert(err.message);
      });
  }, []);

  const handleChange = (e) => {
    const sanitizedValue = DOMPurify.sanitize(e.target.value);
    dispatch(setFormData({ name: e.target.name, value: sanitizedValue }));
  };

  const validate = () => {
    const errors = {};
    if (!formData.username.trim()) {
      errors.username = "Username is required";
    }
    if (!formData.password) {
      errors.password = "Password is required";
    } else if (formData.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }
    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    try {
      const response = await fetch("http://127.0.0.1:5000/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Requested-With": "XMLHttpRequest",
        },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password,
          confirmPassword: formData.confirmPassword,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        setMessage("Registration successful!");
        dispatch(resetForm());
      } else {
        setMessage(`Registration failed: ${data.message}`);
      }
    } catch (error) {
      setMessage(`Registration failed: ${error.message}`);
    }
  };

  return (
    <div className="register">
      <h2>Register</h2>
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit}>
        <FormInput
          type="text"
          name="username"
          label="Username"
          value={formData.username}
          onChange={handleChange}
          error={errors.username}
        />
        <FormInput
          type={passwordVisible ? "text" : "password"}
          name="password"
          label="Password"
          value={formData.password}
          onChange={handleChange}
          error={errors.password}
          toggleVisibility={() => setPasswordVisible(!passwordVisible)}
          isPassword
        />
        <FormInput
          type={confirmPasswordVisible ? "text" : "password"}
          name="confirmPassword"
          label="Confirm Password"
          value={formData.confirmPassword}
          onChange={handleChange}
          error={errors.confirmPassword}
          toggleVisibility={() =>
            setConfirmPasswordVisible(!confirmPasswordVisible)
          }
          isPassword
        />
        <Button type="submit" label="Register" />
      </form>
    </div>
  );
};

export default Register;
