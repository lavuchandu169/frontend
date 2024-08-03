import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import DOMPurify from "dompurify";
import { useNavigate } from "react-router-dom";
import { setLoginUser } from "../redux/loginSlice";
import FormInput from "./FormInput";
import Button from "./Button";
import "./Login.css";

const Login = () => {
  const dispatch = useDispatch();
  const [errors, setErrors] = useState({});
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const navigate = useNavigate();

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
        console.log(err.message);
        // alert(err.message);
      });
  }, []);

  const validate = () => {
    const errors = {};
    if (!username.trim()) {
      errors.username = "Username is required";
    }
    if (!password) {
      errors.password = "Password is required";
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
      fetch("http://127.0.0.1:5000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username,
          password: password,
        }),
      }).then((res) => {
        if (res.status === 200) {
          res.json().then((res) => {
            localStorage.setItem("user", res.user);
            setMessage("Login successful!");
            dispatch(setLoginUser(username));
            let goToDashBoard = () => navigate("/dashboard");
            goToDashBoard();
          });
        } else {
          res.json((res) => {
            setMessage(`Login failed: ${res.message}`);
          });
        }
      });
    } catch (error) {
      setMessage(`Login failed: ${error.message}`);
    }
  };

  return (
    <div className="login">
      <h2>Login</h2>
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit}>
        <FormInput
          type="text"
          name="username"
          label="Username"
          value={username}
          onChange={(e) => {
            setUserName(e.target.value);
          }}
          error={errors.username}
        />
        <FormInput
          type={passwordVisible ? "text" : "password"}
          name="password"
          label="Password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
          }}
          error={errors.password}
          toggleVisibility={() => setPasswordVisible(!passwordVisible)}
          isPassword
        />
        <Button type="submit" label="Login" />
      </form>
    </div>
  );
};

export default Login;
