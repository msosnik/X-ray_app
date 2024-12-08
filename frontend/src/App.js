import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Navigate, Routes } from 'react-router-dom';
import LoginDashboard from './components/LoginDashboard';
import PatientDashboard from './components/PatientDashboard';
import DoctorDashboard from './components/DoctorDashboard';
import ConsultationRoom from './components/ConsultationRoom';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const storedEmail = localStorage.getItem('userEmail');
    const storedUserRole = localStorage.getItem('userRole');
    
    if (storedEmail && storedUserRole) {
      setIsLoggedIn(true);
      setUserRole(storedUserRole);
    }
  }, []);

  const handleLogin = (email, password, role) => {
    localStorage.setItem('userEmail', email);
    localStorage.setItem('userRole', role);
    
    setIsLoggedIn(true);
    setUserRole(role);
  };

  const handleLogout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    setUserRole(null);
    // localStorage.removeItem('userEmail');
    // localStorage.removeItem('userRole');
  };

  return (
    <Router>
      <Routes>
        {/* <Route path="/login" element={isLoggedIn ? <Navigate to={`/${userRole}-dashboard`} /> : <LoginDashboard onLogin={handleLogin} />} />
        <Route path="/patient-dashboard" element={!isLoggedIn ? ( <Navigate to="/login" /> ) : userRole === 'patient' ? ( <PatientDashboard onLogout={handleLogout} /> ) : ( <Navigate to="/login" /> ) } />
        <Route path="/doctor-dashboard" element={!isLoggedIn ? ( <Navigate to="/login" /> ) : userRole === 'doctor' ? ( <DoctorDashboard onLogout={handleLogout} /> ) : ( <Navigate to="/login" /> ) } />
        <Route path="/consultation/:consultationId" element={!isLoggedIn ? ( <Navigate to="/login" /> ) : ( <ConsultationRoom onLogout={handleLogout} /> ) } />
        <Route path="*" element={<Navigate to="/login" />} /> */}
        <Route path="/login" element={<LoginDashboard onLogin={handleLogin} />} />
        <Route path="/patient-dashboard" element={<PatientDashboard onLogout={handleLogout} />} />
        <Route path="/doctor-dashboard" element={<DoctorDashboard onLogout={handleLogout} />} />
        <Route path="/consultation/:consultationId" element={<ConsultationRoom onLogout={handleLogout} />} />
        <Route path="*" element={<LoginDashboard onLogin={handleLogin} />} />
      </Routes>
    </Router>
  );
};

export default App;