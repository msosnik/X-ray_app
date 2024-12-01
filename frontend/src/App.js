import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Navigate, Routes } from 'react-router-dom';
import LoginDashboard from './components/LoginDashboard';
import PatientDashboard from './components/PatientDashboard';
import DoctorDashboard from './components/DoctorDashboard';
import ConsultationRoom from './components/ConsultationRoom';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null);

  const handleLogin = (username, password, role) => {
    if (username && password) {
      setIsLoggedIn(true);
      setUserRole(role);
      localStorage.setItem('username', username);
      localStorage.setItem('userType', role);
    } else {
      alert('Please enter username, password, and select a role');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserRole(null);
    localStorage.removeItem('username');
    localStorage.removeItem('userType');
  };

  return (
    <Router>
      <Routes>
        <Route path="/login" element={isLoggedIn ? <Navigate to={`/${userRole}-dashboard`} /> : <LoginDashboard onLogin={handleLogin} />} />
        <Route path="/patient-dashboard" element={!isLoggedIn ? <Navigate to="/login" /> : userRole === 'patient' ? <PatientDashboard /> : <Navigate to="/patient-dashboard" />} />
        <Route path="/doctor-dashboard" element={!isLoggedIn ? <Navigate to="/login" /> : userRole === 'doctor' ? <DoctorDashboard /> : <Navigate to="/doctor-dashboard" />} />
        <Route path="/consultation/:consultationId" element={!isLoggedIn ? <Navigate to="/login" /> : <ConsultationRoom onLogout={handleLogout} />} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
};

export default App;