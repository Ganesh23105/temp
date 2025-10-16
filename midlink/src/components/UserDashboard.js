import React, { useState, useEffect } from "react";
import { Upload, FileText, Share2, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import "./UserDashboard.css";

function UserDashboard() {
  const navigate = useNavigate();
  const { currentUser, addReport, shareReport, getUserReports, logout } = useAppContext();
  const [activeTab, setActiveTab] = useState("profile");
  const [selectedFile, setSelectedFile] = useState(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const [doctorEmail, setDoctorEmail] = useState("");
  const [reportToShare, setReportToShare] = useState(null);
  const [userReports, setUserReports] = useState([]);

  useEffect(() => {
    if (!currentUser) {
      navigate("/login");
    } else if (currentUser.role !== "patient") {
      navigate("/doctor");
    } else {
      const reports = getUserReports(currentUser.id);
      setUserReports(reports);
    }
  }, [currentUser, navigate, getUserReports]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);

      const reader = new FileReader();
      reader.onload = (event) => {
        const fileData = event.target.result;
        const result = addReport({
          fileName: file.name,
          fileData: fileData
        });

        if (result.success) {
          const reports = getUserReports(currentUser.id);
          setUserReports(reports);
          alert("File uploaded successfully!");
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleShare = (e) => {
    e.preventDefault();
    if (reportToShare) {
      shareReport(reportToShare.id, doctorEmail);
      const reports = getUserReports(currentUser.id);
      setUserReports(reports);
      alert(`Document shared with ${doctorEmail}`);
      setShowShareModal(false);
      setDoctorEmail("");
      setReportToShare(null);
    }
  };

  const openShareModal = (report) => {
    setReportToShare(report);
    setShowShareModal(true);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="user-dashboard">
      {/* 🧭 NAVBAR */}
      <nav className="navbar">
        <h1>User Dashboard</h1>
        <div>
          <button
            onClick={() => setActiveTab("profile")}
            className={activeTab === "profile" ? "active" : ""}
          >
            Profile
          </button>
          <button
            onClick={() => setActiveTab("report")}
            className={activeTab === "report" ? "active" : ""}
          >
            Report
          </button>
          <button
            onClick={handleLogout}
            style={{ marginLeft: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <LogOut size={18} /> Logout
          </button>
        </div>
      </nav>

      {/* 👤 PROFILE SECTION */}
      {activeTab === "profile" && (
        <section className="profile-section">
          <div className="profile-content">
            <div className="profile-left">
              <h2>Hello, {currentUser?.username}!</h2>
              <p>Welcome back to your health dashboard.</p>

              <div className="profile-card">
                <p>
                  <strong>Total Reports:</strong> {userReports.length}
                </p>
                <p>
                  <strong>Shared Reports:</strong> {userReports.filter(r => r.status === 'Shared').length}
                </p>
                <p>
                  <strong>Role:</strong> Patient
                </p>
              </div>
            </div>
            <img
              src="https://via.placeholder.com/180"
              alt="user"
              className="profile-img"
            />
          </div>
        </section>
      )}

      {/* 📄 REPORT SECTION */}
      {activeTab === "report" && (
        <section className="report-section">
          <div className="report-box">
            <h2>
              <Upload size={22} /> Upload Report
            </h2>

            <input type="file" onChange={handleFileChange} accept=".pdf,.jpg,.jpeg,.png" />
            {selectedFile && (
              <p style={{ color: "#94a3b8", marginBottom: "1rem" }}>
                Selected file: {selectedFile.name}
              </p>
            )}

            {/* 📋 PREVIOUS REPORTS */}
            <div className="report-history">
              <h3>
                <FileText size={20} /> Your Reports
              </h3>
              {userReports.length === 0 ? (
                <p style={{ color: "#94a3b8", textAlign: "center", padding: "2rem" }}>
                  No reports uploaded yet. Upload your first report above.
                </p>
              ) : (
                <table>
                  <thead>
                    <tr>
                      <th>Report Name</th>
                      <th>Date</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {userReports.map((report) => (
                      <tr key={report.id}>
                        <td>{report.fileName}</td>
                        <td>{new Date(report.uploadDate).toLocaleDateString()}</td>
                        <td>{report.status}</td>
                        <td>
                          <button
                            className="btn btn-share"
                            onClick={() => openShareModal(report)}
                            style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}
                          >
                            <Share2 size={16} /> Share
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </section>
      )}

      {/* 🪟 SHARE MODAL */}
      {showShareModal && (
        <div className="modal-bg">
          <div className="modal">
            <h3>Share Report</h3>
            <form onSubmit={handleShare}>
              <input
                type="email"
                required
                placeholder="Doctor's Email"
                value={doctorEmail}
                onChange={(e) => setDoctorEmail(e.target.value)}
              />
              <div className="modal-buttons">
                <button
                  type="button"
                  onClick={() => setShowShareModal(false)}
                  className="cancel"
                >
                  Cancel
                </button>
                <button type="submit" className="share">
                  Share
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserDashboard;
