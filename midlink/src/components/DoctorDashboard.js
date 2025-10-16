import React, { useState, useEffect } from "react";
import { FileText, MessageSquare, ClipboardCheck, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import "./DoctorDashboard.css";

function DoctorDashboard() {
  const navigate = useNavigate();
  const { currentUser, getSharedReports, addDiagnosis, getDoctorDiagnoses, logout } = useAppContext();
  const [activeTab, setActiveTab] = useState("patients");
  const [selectedReport, setSelectedReport] = useState(null);
  const [diagnosis, setDiagnosis] = useState("");
  const [sharedReports, setSharedReports] = useState([]);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    if (!currentUser) {
      navigate("/login");
    } else if (currentUser.role !== "doctor") {
      navigate("/user");
    } else {
      const reports = getSharedReports();
      setSharedReports(reports);
      const diagnoses = getDoctorDiagnoses(currentUser.id);
      setHistory(diagnoses);
    }
  }, [currentUser, navigate, getSharedReports, getDoctorDiagnoses]);

  const handleFeedbackSubmit = (e) => {
    e.preventDefault();
    if (selectedReport && diagnosis.trim() !== "") {
      const result = addDiagnosis({
        reportId: selectedReport.id,
        patientName: selectedReport.username,
        reportName: selectedReport.fileName,
        feedback: diagnosis
      });

      if (result.success) {
        const diagnoses = getDoctorDiagnoses(currentUser.id);
        setHistory(diagnoses);
        alert("Diagnosis/Feedback submitted successfully!");
        setDiagnosis("");
        setSelectedReport(null);
      }
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="doctor-dashboard">
      {/* 🧭 NAVBAR */}
      <nav className="navbar">
        <h1>Doctor Dashboard</h1>
        <div>
          <button
            onClick={() => setActiveTab("patients")}
            className={activeTab === "patients" ? "active" : ""}
          >
            Patients
          </button>
          <button
            onClick={() => setActiveTab("history")}
            className={activeTab === "history" ? "active" : ""}
          >
            Diagnosis History
          </button>
          <button
            onClick={handleLogout}
            style={{ marginLeft: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <LogOut size={18} /> Logout
          </button>
        </div>
      </nav>

      {/* 👨‍⚕️ PATIENT REPORTS */}
      {activeTab === "patients" && (
        <section className="patients-section">
          <div className="patients-box">
            <h2>
              <FileText size={22} /> Shared Patient Reports
            </h2>
            {sharedReports.length === 0 ? (
              <p style={{ color: "#94a3b8", textAlign: "center", padding: "2rem" }}>
                No reports have been shared with you yet.
              </p>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>Patient Name</th>
                    <th>Report Name</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {sharedReports.map((report) => (
                    <tr key={report.id}>
                      <td>{report.username}</td>
                      <td>{report.fileName}</td>
                      <td>{new Date(report.uploadDate).toLocaleDateString()}</td>
                      <td>{report.status}</td>
                      <td>
                        <button
                          className="btn-view"
                          onClick={() => setSelectedReport(report)}
                        >
                          <MessageSquare size={16} /> Review
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* 🩺 FEEDBACK MODAL */}
          {selectedReport && (
            <div className="modal-bg">
              <div className="modal">
                <h3>
                  Review Report - {selectedReport.fileName}
                </h3>
                <form onSubmit={handleFeedbackSubmit}>
                  <textarea
                    required
                    placeholder="Enter diagnosis or feedback..."
                    value={diagnosis}
                    onChange={(e) => setDiagnosis(e.target.value)}
                  ></textarea>
                  <div className="modal-buttons">
                    <button
                      type="button"
                      onClick={() => setSelectedReport(null)}
                      className="cancel"
                    >
                      Cancel
                    </button>
                    <button type="submit" className="share">
                      Submit Feedback
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </section>
      )}

      {/* 📋 DIAGNOSIS HISTORY */}
      {activeTab === "history" && (
        <section className="history-section">
          <h2>
            <ClipboardCheck size={22} /> Diagnosis History
          </h2>
          {history.length === 0 ? (
            <p style={{ color: "#94a3b8", textAlign: "center", padding: "2rem" }}>
              No diagnosis history yet. Review patient reports to add feedback.
            </p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Patient</th>
                  <th>Report</th>
                  <th>Date</th>
                  <th>Feedback</th>
                </tr>
              </thead>
              <tbody>
                {history.map((item) => (
                  <tr key={item.id}>
                    <td>{item.patientName}</td>
                    <td>{item.reportName}</td>
                    <td>{new Date(item.date).toLocaleDateString()}</td>
                    <td>{item.feedback}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>
      )}
    </div>
  );
}

export default DoctorDashboard;
