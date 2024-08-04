import React from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setLoginUser } from "../redux/loginSlice";
const LogoutPopup = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleLogout = () => {
    fetch("https://backend-7ksj.onrender.com/logout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user: localStorage.getItem("user"),
      }),
    })
      .then((response) => {
        if (response.ok) {
          localStorage.removeItem("user");
          dispatch(setLoginUser(""));
          let gotoLogin = () => navigate("/login");
          gotoLogin();
        } else {
          alert("Logout failed");
          console.error("Logout failed");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };
  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <p>Are you sure you want to logout?</p>
        <button onClick={handleLogout}>Confirm</button>
        <button
          onClick={() => {
            navigate(-1);
          }}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default LogoutPopup;
