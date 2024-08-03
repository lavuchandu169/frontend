import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import "./LandingPage.css";
import { useDispatch, useSelector } from "react-redux";
import { setLoginUser } from "../redux/loginSlice";

const LandingPage = () => {
  const loginUser = useSelector((state) => state.login.loginUser);
  const dispatch = useDispatch();
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
          });
        }
      })
      .catch((err) => {
        // alert(err.message);
      });
  }, []);

  return (
    <div className="landing-page w-full">
      <div className="landing-header">
        <h1>Welcome to NoteStar</h1>
        <p>Create, edit, and share your documents easily</p>
        <div className="landing-buttons">
          <Link to="/register" className="landing-button">
            Get Started
          </Link>
          {loginUser ? (
            <></>
          ) : (
            <Link to="/login" className="landing-button">
              Login
            </Link>
          )}
        </div>
      </div>
      <div className="landing-features">
        <div className="feature">
          <h2>Collaborate</h2>
          <p>Work together in real-time on documents.</p>
        </div>
        <div className="feature">
          <h2>Edit</h2>
          <p>Edit your documents with a rich text editor.</p>
        </div>
        <div className="feature">
          <h2>Share</h2>
          <p>Share documents with friends and colleagues.</p>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
