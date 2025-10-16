import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [reports, setReports] = useState([]);
  const [diagnoses, setDiagnoses] = useState([]);

  useEffect(() => {
    const savedUser = sessionStorage.getItem('currentUser');
    const savedUsers = sessionStorage.getItem('users');
    const savedReports = sessionStorage.getItem('reports');
    const savedDiagnoses = sessionStorage.getItem('diagnoses');

    if (savedUser) setCurrentUser(JSON.parse(savedUser));
    if (savedUsers) setUsers(JSON.parse(savedUsers));
    if (savedReports) setReports(JSON.parse(savedReports));
    if (savedDiagnoses) setDiagnoses(JSON.parse(savedDiagnoses));
  }, []);

  useEffect(() => {
    if (currentUser) {
      sessionStorage.setItem('currentUser', JSON.stringify(currentUser));
    } else {
      sessionStorage.removeItem('currentUser');
    }
  }, [currentUser]);

  useEffect(() => {
    sessionStorage.setItem('users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    sessionStorage.setItem('reports', JSON.stringify(reports));
  }, [reports]);

  useEffect(() => {
    sessionStorage.setItem('diagnoses', JSON.stringify(diagnoses));
  }, [diagnoses]);

  const register = (username, password, role) => {
    const existingUser = users.find(u => u.username === username);
    if (existingUser) {
      return { success: false, message: 'User already exists' };
    }

    const newUser = {
      id: Date.now().toString(),
      username,
      password,
      role,
      createdAt: new Date().toISOString()
    };

    setUsers([...users, newUser]);
    return { success: true, message: 'Registration successful' };
  };

  const login = (username, password, role) => {
    const user = users.find(
      u => u.username === username && u.password === password && u.role === role
    );

    if (user) {
      const { password: _, ...userWithoutPassword } = user;
      setCurrentUser(userWithoutPassword);
      return { success: true, user: userWithoutPassword };
    }

    return { success: false, message: 'Invalid credentials or role' };
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const addReport = (reportData) => {
    const newReport = {
      id: Date.now().toString(),
      userId: currentUser.id,
      username: currentUser.username,
      fileName: reportData.fileName,
      fileData: reportData.fileData,
      uploadDate: new Date().toISOString(),
      status: 'Uploaded',
      sharedWith: []
    };

    setReports([...reports, newReport]);
    return { success: true, report: newReport };
  };

  const shareReport = (reportId, doctorEmail) => {
    setReports(prevReports =>
      prevReports.map(report =>
        report.id === reportId
          ? {
              ...report,
              sharedWith: [...report.sharedWith, doctorEmail],
              status: 'Shared'
            }
          : report
      )
    );
    return { success: true };
  };

  const addDiagnosis = (diagnosisData) => {
    const newDiagnosis = {
      id: Date.now().toString(),
      reportId: diagnosisData.reportId,
      patientName: diagnosisData.patientName,
      reportName: diagnosisData.reportName,
      feedback: diagnosisData.feedback,
      doctorId: currentUser.id,
      doctorName: currentUser.username,
      date: new Date().toISOString()
    };

    setDiagnoses([...diagnoses, newDiagnosis]);
    return { success: true, diagnosis: newDiagnosis };
  };

  const getUserReports = (userId) => {
    return reports.filter(report => report.userId === userId);
  };

  const getSharedReports = () => {
    return reports.filter(report => report.status === 'Shared');
  };

  const getDoctorDiagnoses = (doctorId) => {
    return diagnoses.filter(diagnosis => diagnosis.doctorId === doctorId);
  };

  const value = {
    currentUser,
    users,
    reports,
    diagnoses,
    register,
    login,
    logout,
    addReport,
    shareReport,
    addDiagnosis,
    getUserReports,
    getSharedReports,
    getDoctorDiagnoses
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
