import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AppProvider } from "../context/AppContext";
import Login from "./Login";
import UserDashboard from "./UserDashboard";
import DoctorDashboard from "./DoctorDashboard";

function App() {
  return (
    <AppProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Login />} />
          <Route path="/user" element={<UserDashboard />} />
          <Route path="/doctor" element={<DoctorDashboard />} />
        </Routes>
      </Router>
    </AppProvider>
  );
}

export default App;
