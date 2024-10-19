import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Navigate, Routes } from 'react-router-dom';
import LoginDashboard from './components/LoginDashboard';
import PatientDashboard from './components/PatientDashboard';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = (username, password) => {
    if (username && password) {
      setIsLoggedIn(true);
    } else {
      alert('Please enter both username and password');
    }
  };

  return (
    <Router>
      <Routes>
        <Route 
          path="/login" 
          element={
            isLoggedIn ? 
              <Navigate to="/patient-dashboard" /> : 
              <LoginDashboard onLogin={handleLogin} />
          } 
        />
        <Route 
          path="/patient-dashboard" 
          element={
            isLoggedIn ? 
              <PatientDashboard /> : 
              <Navigate to="/login" />
          } 
        />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
};

export default App;