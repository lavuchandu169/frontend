import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import "./Header.css";
import { useSelector } from "react-redux";
const Header = () => {
  const loginUser = useSelector((state) => state.login.loginUser);
  return (
    <header className="header">
      <Link to={"/"}>
        <p className="text-4xl font-bold">NoteStar</p>
      </Link>

      <nav className="header-nav">
        <ul className="flex justify-center items-center">
          {loginUser ? (
            <>
              <li>
                <p className="text-xl">{loginUser}</p>
              </li>
              <li>
                {" "}
                <Link to="/logout">Logout</Link>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link to="/register">Register</Link>
              </li>
              <li>
                <Link to="/login">Login</Link>
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
