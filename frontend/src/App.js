import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Navigate, Routes } from 'react-router-dom';
import LoginDashboard from './components/LoginDashboard';
import PatientDashboard from './components/PatientDashboard';
import DoctorDashboard from './components/DoctorDashboard';
import ConsultationRoom from './components/ConsultationRoom';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    const storedEmail = localStorage.getItem('userEmail');
    const storedUserRole = localStorage.getItem('userRole');
    const storedUserInfo = localStorage.getItem('userInfo');
    
    if (storedEmail && storedUserRole && storedUserInfo) {
      setIsLoggedIn(true);
      setUserRole(storedUserRole);
      setUserInfo(JSON.parse(storedUserInfo));
    }
  }, []);

  const handleLogin = (email, password, role, userDetails) => {
    localStorage.setItem('userEmail', email);
    localStorage.setItem('userRole', role);
    localStorage.setItem('userInfo', JSON.stringify(userDetails));
    
    setIsLoggedIn(true);
    setUserRole(role);
    setUserInfo(userDetails);
  };

  const handleLogout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    setUserRole(null);
    setUserInfo(null);
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
        <Route path="/patient-dashboard" element={<PatientDashboard onLogout={handleLogout} patientInfo={userInfo}/>} />
        <Route path="/doctor-dashboard" element={<DoctorDashboard onLogout={handleLogout} doctorInfo={userInfo} />} />
        <Route path="/consultation/:consultationId" element={<ConsultationRoom onLogout={handleLogout} userInfo={userInfo} userRole={userRole}/>} />
        <Route path="*" element={<LoginDashboard onLogin={handleLogin} />} />
      </Routes>
    </Router>
  );
};

export default App;