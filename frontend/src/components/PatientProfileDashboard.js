import React, { useState, useEffect } from 'react';
import { User, FileText, Activity, AlertCircle, Edit2, Save } from 'lucide-react';
import '../styles/patientProfileDashboard.css';

const PatientProfileDashboard = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [patientData, setPatientData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPatientData();
  }, []);

  const fetchPatientData = async () => {
    try {
      const storedData = localStorage.getItem('userInfo');
      if (!storedData) {
        throw new Error('No patient data found in localStorage');
      }
      
      const localPatientData = JSON.parse(storedData);
      const patientId = localPatientData.id;

      const response = await fetch(`http://localhost:8080/patient/${patientId}`);
      if (!response.ok) throw new Error('Failed to fetch patient data');
      const data = await response.json();
      setPatientData(data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      const patientId = patientData.id;
      const response = await fetch(`http://localhost:8080/patient/${patientId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(patientData),
      });

      if (!response.ok) throw new Error('Failed to update patient data');
      
      setIsEditing(false);
      await fetchPatientData();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleInputChange = (field, value) => {
    setPatientData(prevData => ({
      ...prevData,
      [field]: value
    }));
  };

  if (loading) return <div className="loading">Loading patient data...</div>;
  if (error) return <div className="error">Error: {error}</div>;
  if (!patientData) return <div className="error">No patient data found</div>;

  const InfoItem = ({ label, value, isEditing, onChange, type = "text" }) => (
    <div className="info-item">
      <label>{label}:</label>
      {isEditing && onChange ? (
        type === "consent" ? (
          <select
            value={value ? "Yes" : "No"}
            onChange={(e) => onChange(e.target.value === "Yes")}
            className="consent-select"
          >
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        ) : (
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
          />
        )
      ) : (
        <span>{typeof value === 'boolean' ? (value ? 'Yes' : 'No') : value}</span>
      )}
    </div>
  );


  return (
    <div className="profile-dashboard">
      <div className="profile-header">
        <h1>Patient Profile</h1>
        {isEditing ? (
          <button className="edit-button" onClick={handleSave}>
            <Save size={20} />
            Save Changes
          </button>
        ) : (
          <button className="edit-button" onClick={() => setIsEditing(true)}>
            <Edit2 size={20} />
            Edit Profile
          </button>
        )}
      </div>
      <div className="profile-content-full">
        <div className="info-section">
          <h2>Personal Information</h2>
          <div className="info-grid">
            <div className="info-column">
              <div className="info-group">
                <h3>Basic Information</h3>
                <InfoItem 
                  label="First Name" 
                  value={patientData.firstName} 
                  isEditing={isEditing} 
                  onChange={(value) => handleInputChange('firstName', value)} 
                />
                <InfoItem 
                  label="Last Name" 
                  value={patientData.lastName} 
                  isEditing={isEditing} 
                  onChange={(value) => handleInputChange('lastName', value)} 
                />
                <InfoItem 
                  label="Date of Birth" 
                  value={patientData.dateOfBirth} 
                  isEditing={isEditing} 
                  onChange={(value) => handleInputChange('dateOfBirth', value)} 
                />
              </div>
            </div>
            <div className="info-column">
              <div className="info-group">
                <h3>Contact Information</h3>
                <InfoItem 
                  label="Email" 
                  value={patientData.email} 
                  isEditing={isEditing} 
                  onChange={(value) => handleInputChange('email', value)} 
                />
                <InfoItem 
                  label="Phone" 
                  value={patientData.phoneNumber.toString()} 
                  isEditing={isEditing} 
                  onChange={(value) => handleInputChange('phoneNumber', parseInt(value, 10))} 
                />
                <InfoItem 
                  label="Address" 
                  value={patientData.address} 
                  isEditing={isEditing} 
                  onChange={(value) => handleInputChange('address', value)} 
                />
              </div>
            </div>
            <div className="info-column">
              <div className="info-group">
                <h3>Additional Information</h3>
                <InfoItem 
                  label="Created At" 
                  value={patientData.createdAt} 
                  isEditing={false} 
                />
                <InfoItem 
                  label="Last Updated" 
                  value={patientData.updatedAt || 'Never'} 
                  isEditing={false} 
                />
                <InfoItem 
                  label="Consent To Use Images" 
                  value={patientData.consentToUseImages}
                  isEditing={isEditing} 
                  onChange={(value) => handleInputChange('consentToUseImages', value)}
                  type="consent"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


export default PatientProfileDashboard;