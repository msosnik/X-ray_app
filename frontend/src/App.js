import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Navigate, Routes } from 'react-router-dom';
import LoginDashboard from './components/LoginDashboard';
import PatientDashboard from './components/PatientDashboard';
import DoctorDashboard from './components/DoctorDashboard';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null);

  const handleLogin = (username, password, role) => {
    if (username && password) {
      setIsLoggedIn(true);
      setUserRole(role);
    } else {
      alert('Please enter username, password, and select a role');
    }
  };

  return (
    <Router>
      <Routes>
        <Route path="/login" element={isLoggedIn ? <Navigate to={`/${userRole}-dashboard`} /> : <LoginDashboard onLogin={handleLogin} />} />
        <Route path="/patient-dashboard" element={!isLoggedIn ? <Navigate to="/login" /> : userRole === 'patient' ? <PatientDashboard /> : <Navigate to="/patient-dashboard" />} />
        <Route path="/doctor-dashboard" element={!isLoggedIn ? <Navigate to="/login" /> : userRole === 'doctor' ? <DoctorDashboard /> : <Navigate to="/doctor-dashboard" />} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
};

export default App;