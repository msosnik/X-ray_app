import React, { useState, useEffect } from 'react';
import { User, FileText, Activity, AlertCircle, Edit2, Save } from 'lucide-react';
import '../styles/doctorProfileDashboard.css';

const DoctorProfileDashboard = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [doctorData, setDoctorData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDoctorData();
  }, []);

  const fetchDoctorData = async () => {
    try {
      const storedData = localStorage.getItem('userInfo');
      if (!storedData) {
        throw new Error('No patient data found in localStorage');
      }
      
      const localDoctorData = JSON.parse(storedData);
      const doctorId = localDoctorData.id;

      const response = await fetch(`http://localhost:8080/doctor/${doctorId}`);
      if (!response.ok) throw new Error('Failed to fetch doctor data');
      const data = await response.json();
      setDoctorData(data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      const doctorId = doctorData.id;
      console.log('Payload being sent:', JSON.stringify(doctorData, null, 2));
      const response = await fetch(`http://localhost:8080/doctor/${doctorId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(doctorData),
      });

      if (!response.ok) throw new Error('Failed to update doctor data');
      
      setIsEditing(false);
      await fetchDoctorData();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleInputChange = (field, value) => {
    setDoctorData(prevData => ({
      ...prevData,
      [field]: value
    }));
  };

  if (loading) return <div className="loading">Loading doctor data...</div>;
  if (error) return <div className="error">Error: {error}</div>;
  if (!doctorData) return <div className="error">No doctor data found</div>;

  const InfoItem = ({ label, value, isEditing, onChange }) => (
    <div className="info-item">
      <label>{label}:</label>
      {isEditing && onChange ? (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : (
        <span>{value}</span>
      )}
    </div>
  );

  return (
    <div className="doctor-dashboard">
      <div className="profile-header">
        <h1>Doctor Profile</h1>
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
                  value={doctorData.passwordHash} 
                  isEditing={isEditing} 
                  onChange={(value) => handleInputChange('passwordHash', value)} 
                />
                <InfoItem 
                  label="Last Name" 
                  value={doctorData.lastName} 
                  isEditing={isEditing} 
                  onChange={(value) => handleInputChange('lastName', value)} 
                />
                <InfoItem 
                  label="Medical License ID" 
                  value={doctorData.medicalLicenceId}
                  isEditing={isEditing} 
                />
              </div>
            </div>
            <div className="info-column">
              <div className="info-group">
                <h3>Contact Information</h3>
                <InfoItem 
                  label="Email" 
                  value={doctorData.email} 
                  isEditing={isEditing} 
                  onChange={(value) => handleInputChange('email', value)} 
                />
                <InfoItem 
                  label="Phone" 
                  value={doctorData.phoneNumber.toString()} 
                  isEditing={isEditing} 
                  onChange={(value) => handleInputChange('phoneNumber', parseInt(value, 10))} 
                />
                <InfoItem 
                  label="Address of Clinic" 
                  value={doctorData.clinicAddress} 
                  isEditing={isEditing} 
                  onChange={(value) => handleInputChange('clinicAddress', value)} 
                />
              </div>
            </div>
            <div className="info-column">
              <div className="info-group">
                <h3>Additional Information</h3>
                <InfoItem 
                  label="Specialization" 
                  value={doctorData.specialization}
                  isEditing={isEditing}
                  onChange={(value) => handleInputChange('specialization', value)} 
                />
                <InfoItem 
                  label="Availability" 
                  value={doctorData.availability}
                  isEditing={isEditing}
                  onChange={(value) => handleInputChange('availability', value)}
                />
                <InfoItem 
                  label="Working Hours" 
                  value={doctorData.workingHours}
                  isEditing={isEditing}
                  onChange={(value) => handleInputChange('workingHours', value)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorProfileDashboard;