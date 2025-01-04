import React, { useState } from 'react';
import { User, UserCog, ArrowRight, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import '../styles/registrationDashboard.css';

const RegistrationDashboard = () => {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState(null);
  const [formData, setFormData] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const doctorFields = [
    { name: 'email', label: 'Email', type: 'email', required: true },
    { name: 'passwordHash', label: 'Password', type: 'password', required: true },
    { name: 'firstName', label: 'First Name', type: 'text', required: true },
    { name: 'lastName', label: 'Last Name', type: 'text', required: true },
    { name: 'medicalLicenceId', label: 'Medical License ID', type: 'number', required: true },
    { name: 'phoneNumber', label: 'Phone Number', type: 'number', required: true },
    { name: 'clinicAddress', label: 'Clinic Address', type: 'text', required: true },
    { name: 'specialization', label: 'Specialization', type: 'text', required: true },
    { name: 'availability', label: 'Availability', type: 'text', required: true },
    { name: 'workingHours', label: 'Working Hours', type: 'text', required: true }
  ];

  const patientFields = [
    { name: 'email', label: 'Email', type: 'email', required: true },
    { name: 'passwordHash', label: 'Password', type: 'password', required: true },
    { name: 'firstName', label: 'First Name', type: 'text', required: true },
    { name: 'lastName', label: 'Last Name', type: 'text', required: true },
    { name: 'dateOfBirth', label: 'Date of Birth', type: 'date', required: true },
    { name: 'address', label: 'Address', type: 'text', required: true },
    { name: 'phoneNumber', label: 'Phone Number', type: 'number', required: true },
    { name: 'consentToUseImages', label: 'Consent to Use Images', type: 'checkbox', required: true }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const endpoint = selectedRole === 'doctor' ? '/doctor' : '/patient';
      const response = await fetch(`http://localhost:8080${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          id: 0,
          createdAt: new Date().toISOString().split('T')[0],
          updatedAt: new Date().toISOString().split('T')[0],
          patientIds: [],
          appointmentList: [],
          doctorList: [],
          xrayImages: []
        }),
      });

      if (!response.ok) {
        throw new Error('Registration failed');
      }

      setSuccessMessage('Registration successful! Redirecting to login...');
      
      setTimeout(() => {
        navigate('/login');
      }, 2000);
      
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1 className="login-title">Registration</h1>
        <button 
          onClick={() => navigate('/login')} 
          className="back-button"
        >
          Back to Login
        </button>

        {successMessage && (
          <div className="success-message">
            {successMessage}
          </div>
        )}

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {!selectedRole ? (
          <div className="role-selection">
            <button
              onClick={() => setSelectedRole('doctor')}
              className="role-button"
            >
              <span>Register as Doctor</span>
            </button>
            <button
              onClick={() => setSelectedRole('patient')}
              className="role-button"
            >
              <span>Register as Patient</span>
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="registration-form">
            <div className="form-header">
              <h2>{selectedRole === 'doctor' ? 'Doctor' : 'Patient'} Registration</h2>
              <button
                type="button"
                onClick={() => setSelectedRole(null)}
                className="change-role-button"
              >
                Change Role
              </button>
            </div>

            <div className="form-fields">
              {(selectedRole === 'doctor' ? doctorFields : patientFields).map((field) => (
                <div key={field.name} className="input-field">
                  <label>
                    {field.label}
                    {field.required && <span className="required">*</span>}
                  </label>
                  {field.type === 'checkbox' ? (
                    <div className="checkbox-field">
                      <input
                        type="checkbox"
                        checked={formData[field.name] || false}
                        onChange={(e) => handleInputChange(field.name, e.target.checked)}
                      />
                      <span>I consent to the use of my images</span>
                    </div>
                  ) : (
                    <input
                      type={field.type}
                      value={formData[field.name] || ''}
                      onChange={(e) => handleInputChange(field.name, e.target.value)}
                      required={field.required}
                    />
                  )}
                </div>
              ))}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="form-submit-button"
            >
              <span>{loading ? 'Registering...' : 'Register'}</span>
              {!loading && <ArrowRight size={24} />}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default RegistrationDashboard;