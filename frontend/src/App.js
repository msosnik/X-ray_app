import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PatientDashboard from './components/PatientDashboard';

const App = () => {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <div className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/patient-dashboard" element={<PatientDashboard />} />
            <Route path="/" element={<PatientDashboard />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;

