import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./redux/store";
import Register from "./components/Register";
import Login from "./components/Login";
import Header from "./components/Header";
import Dashboard from "./components/Dashboard";
import "./App.css";
import LogoutPopup from "./components/LogoutPopup";
import LandingPage from "./components/LandingPage";
function App() {
  return (
    <Provider store={store}>
      <Router>
        <div className="App">
          <Header />
          <div className="main-content">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />
              <Route path="/dashboard/*" element={<Dashboard />} />
              <Route path="/logout" element={<LogoutPopup />} />
            </Routes>
          </div>
        </div>
      </Router>
    </Provider>
  );
}

export default App;
