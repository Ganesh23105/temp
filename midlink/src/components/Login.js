import React, { useState } from "react";
import "./Login.css";
import { RiFilePaper2Line } from "react-icons/ri";
import { useLocation, useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";

const Login = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { login, register } = useAppContext();

  const isLogin = location.pathname === "/login";

  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
    role: ""
  });

  const [registerForm, setRegisterForm] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    role: ""
  });

  const [error, setError] = useState("");

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!loginForm.email || !loginForm.password || !loginForm.role) {
      setError("Please fill in all fields");
      return;
    }

    const result = login(loginForm.email, loginForm.password, loginForm.role);

    if (result.success) {
      if (loginForm.role === "doctor") {
        navigate("/doctor");
      } else {
        navigate("/user");
      }
    } else {
      setError(result.message);
    }
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!registerForm.username || !registerForm.password || !registerForm.confirmPassword || !registerForm.role) {
      setError("Please fill in all fields");
      return;
    }

    if (registerForm.password !== registerForm.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    const result = register(registerForm.username, registerForm.password, registerForm.role);

    if (result.success) {
      alert("Registration successful! Please login.");
      navigate("/login");
      setRegisterForm({
        username: "",
        password: "",
        confirmPassword: "",
        role: ""
      });
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="auth-page">
      <div className="leftbox">
        <div className="circle circle1"></div>
        <div className="circle circle2"></div>

        <div className="content">
          <div className="logo-icon">
            <RiFilePaper2Line size={40} color="#fff" />
          </div>
          <h2 className="logo-text">MedLink</h2>
          <h1 className="f">Your Health, Your Data, Your </h1>
          <h1 className="s">Control.</h1>
          <p>
            Securely manage and share your health records with blockchain
            technology, ensuring privacy and ownership.
          </p>
        </div>
      </div>

      <div className="rightbox">
        <div className="auth-header">
          <h1>
            Secure <span>Access</span>
          </h1>
          <div className="tabs">
            <a
              href="#"
              className={isLogin ? "active" : ""}
              onClick={(e) => {
                e.preventDefault();
                navigate("/login");
              }}
            >
              Login
            </a>
            <a
              href="#"
              className={!isLogin ? "active" : ""}
              onClick={(e) => {
                e.preventDefault();
                navigate("/register");
              }}
            >
              Register
            </a>
          </div>
        </div>

        <div className="auth-container">
          {isLogin ? (
            <div className="loginform">
              <h2>Welcome Back</h2>
              {error && <p style={{ color: '#ef4444', marginBottom: '1rem' }}>{error}</p>}
              <form onSubmit={handleLoginSubmit}>
                <label>
                  Email
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={loginForm.email}
                    onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                  />
                </label>
                <label>
                  Password
                  <input
                    type="password"
                    placeholder="Enter your password"
                    value={loginForm.password}
                    onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                  />
                </label>
                <label>
                  Select Role
                  <select
                    value={loginForm.role}
                    onChange={(e) => setLoginForm({ ...loginForm, role: e.target.value })}
                  >
                    <option value="">-- Select Role --</option>
                    <option value="doctor">Doctor</option>
                    <option value="patient">Patient</option>
                  </select>
                </label>
                <a href="#">Forget Password?</a>
                <button type="submit">Login</button>
              </form>
              <p>
                Not a Member?{" "}
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate("/register");
                  }}
                >
                  Signup now
                </a>
              </p>
            </div>
          ) : (
            <div className="registerform">
              <h2>Create Account</h2>
              {error && <p style={{ color: '#ef4444', marginBottom: '1rem' }}>{error}</p>}
              <form onSubmit={handleRegisterSubmit}>
                <label>
                  Username
                  <input
                    type="text"
                    placeholder="Enter username"
                    value={registerForm.username}
                    onChange={(e) => setRegisterForm({ ...registerForm, username: e.target.value })}
                  />
                </label>
                <label>
                  Password
                  <input
                    type="password"
                    placeholder="Enter password"
                    value={registerForm.password}
                    onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
                  />
                </label>
                <label>
                  Confirm Password
                  <input
                    type="password"
                    placeholder="Re-enter password"
                    value={registerForm.confirmPassword}
                    onChange={(e) => setRegisterForm({ ...registerForm, confirmPassword: e.target.value })}
                  />
                </label>
                <label>
                  Select Role
                  <select
                    value={registerForm.role}
                    onChange={(e) => setRegisterForm({ ...registerForm, role: e.target.value })}
                  >
                    <option value="">-- Select Role --</option>
                    <option value="doctor">Doctor</option>
                    <option value="patient">Patient</option>
                  </select>
                </label>
                <button type="submit">Create Account</button>
                <p>
                  Already have an account?{" "}
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      navigate("/login");
                    }}
                  >
                    Log in
                  </a>
                </p>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
