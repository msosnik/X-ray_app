import React, { useState } from 'react';
import { User, UserCog, ArrowRight, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import '../styles/registrationDashboard.css';

const RegistrationDashboard = () => {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState('patient');
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
    { name: 'consentToUseImages', label: 'Consent to Use Images', type: 'select', required: true, options: ['Yes', 'No'] }
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
      const endpoint = selectedRole === 'doctor' ? '/doctor/' : '/patient/';
      
      const baseRequestData = {
        id: 0,
        email: String(formData.email || ''),
        passwordHash: String(formData.passwordHash || ''),
        firstName: String(formData.firstName || ''),
        lastName: String(formData.lastName || ''),
        createdAt: new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString().split('T')[0],
        phoneNumber: parseInt(formData.phoneNumber, 10) || 0,
      };
  
      let requestData;
      if (selectedRole === 'doctor') {
        requestData = {
          ...baseRequestData,
          medicalLicenceId: parseInt(formData.medicalLicenceId, 10) || 0,
          clinicAddress: String(formData.clinicAddress || ''),
          specialization: String(formData.specialization || ''),
          availability: String(formData.availability || ''),
          workingHours: String(formData.workingHours || ''),
          patientIds: [0],
          appointmentList: [0]
        };
      } else {
        requestData = {
          ...baseRequestData,
          dateOfBirth: String(formData.dateOfBirth || ''),
          address: String(formData.address || ''),
          consentToUseImages: formData.consentToUseImages === 'Yes',
          xrayImages: [0],
          doctorList: [0],
          appointmentList: [0]
        };
      }

      console.log('Request URL:', `http://localhost:8080${endpoint}`);
      console.log('Request payload:', JSON.stringify(requestData, null, 2));
        
      const response = await fetch(`http://localhost:8080${endpoint}`, {
        method: 'POST',
        headers: {
          'accept': '*/*',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestData),
      });

      const responseData = await response.text();
      console.log('Server response:', responseData);
  
      if (!response.ok) {
        let errorMessage;
        try {
          const errorData = JSON.parse(responseData);
          errorMessage = errorData.message || errorData.error || JSON.stringify(errorData);
        } catch (e) {
          errorMessage = responseData || `Registration failed with status: ${response.status}`;
        }
        throw new Error(errorMessage);
      }  

      const successData = responseData ? JSON.parse(responseData) : null;
      console.log('Success response:', successData);

      setSuccessMessage('Registration successful! Redirecting to login...');
      
      setTimeout(() => {
        navigate('/login');
      }, 2000);
      
    } catch (err) {
      setError(err.message);
      console.error('Registration error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="registration-box">
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

        <div className="role-selection">
          <button
            onClick={() => setSelectedRole('doctor')}
            className={`role-button ${selectedRole === 'doctor' ? 'active' : ''}`}
          >
            <span>Register as Doctor</span>
          </button>
          <button
            onClick={() => setSelectedRole('patient')}
            className={`role-button ${selectedRole === 'patient' ? 'active' : ''}`}
          >
            <span>Register as Patient</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="registration-form">
          <div className="form-fields">
            {(selectedRole === 'doctor' ? doctorFields : patientFields).map((field) => (
              <div key={field.name} className="input-field">
                <label>
                  {field.label}
                  {field.required && <span className="required">*</span>}
                </label>
                {field.type === 'select' ? (
                  <select
                    value={formData[field.name] || ''}
                    onChange={(e) => handleInputChange(field.name, e.target.value)}
                    required={field.required}
                  >
                    <option value="">Select an option</option>
                    {field.options.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
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
      </div>
    </div>
  );
};

export default RegistrationDashboard;