import React, { useState } from 'react';
import { User, FileText, Activity, AlertCircle, Edit2, Save } from 'lucide-react';
import '../styles/patientProfileDashboard.css';

const PatientProfileDashboard = () => {
  const [activeSection, setActiveSection] = useState('personal');
  const [isEditing, setIsEditing] = useState(false);
  const [patientData, setPatientData] = useState({
    personal: {
      firstName: "John",
      lastName: "Doe",
      dateOfBirth: "1990-01-01",
      gender: "Male",
      email: "john.doe@example.com",
      phone: "123-456-7890",
      address: "123 Main St, Anytown, USA",
      emergencyContact: "Jane Doe (Wife) - 987-654-3210"
    },
    medical: {
      bloodType: "A+",
      allergies: "Peanuts, Penicillin",
      chronicConditions: "Asthma",
      currentMedications: "Albuterol inhaler",
      lastPhysicalExam: "2024-05-15",
      vaccinations: "Flu shot (2024-09-01), COVID-19 (2024-03-15)",
      familyHistory: "Father: Hypertension, Mother: Diabetes"
    },
    history: [
      { date: "2024-09-15", event: "Annual checkup", details: "All vitals normal" },
      { date: "2024-07-03", event: "Flu shot", details: "Administered seasonal flu vaccine" },
      { date: "2024-03-20", event: "Sprained ankle", details: "Prescribed rest and ice therapy" },
      { date: "2023-11-10", event: "Dental cleaning", details: "No cavities found" },
      { date: "2023-08-05", event: "Eye examination", details: "Prescription unchanged" }
    ]
  });

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    setIsEditing(false);
    alert("Profile updated successfully!");
  };

  const handleInputChange = (section, field, value) => {
    setPatientData(prevData => ({
      ...prevData,
      [section]: {
        ...prevData[section],
        [field]: value
      }
    }));
  };


  const renderPersonalInfo = () => (
    <div className="info-section">
      <h2>Personal Information</h2>
      <div className="info-grid">
        <div className="info-column">
          <div className="info-group">
            <h3>Basic Information</h3>
            <InfoItem label="First Name" value={patientData.personal.firstName} isEditing={isEditing} onChange={(value) => handleInputChange('personal', 'firstName', value)} />
            <InfoItem label="Last Name" value={patientData.personal.lastName} isEditing={isEditing} onChange={(value) => handleInputChange('personal', 'lastName', value)} />
            <InfoItem label="Date of Birth" value={patientData.personal.dateOfBirth} isEditing={isEditing} onChange={(value) => handleInputChange('personal', 'dateOfBirth', value)} />
            <InfoItem label="Gender" value={patientData.personal.gender} isEditing={isEditing} onChange={(value) => handleInputChange('personal', 'gender', value)} />
          </div>
        </div>
        <div className="info-column">
          <div className="info-group">
            <h3>Contact Information</h3>
            <InfoItem label="Email" value={patientData.personal.email} isEditing={isEditing} onChange={(value) => handleInputChange('personal', 'email', value)} />
            <InfoItem label="Phone" value={patientData.personal.phone} isEditing={isEditing} onChange={(value) => handleInputChange('personal', 'phone', value)} />
            <InfoItem label="Address" value={patientData.personal.address} isEditing={isEditing} onChange={(value) => handleInputChange('personal', 'address', value)} />
          </div>
        </div>
        <div className="info-column">
          <div className="info-group">
            <h3>Emergency Contact</h3>
            <InfoItem label="Emergency Contact" value={patientData.personal.emergencyContact} isEditing={isEditing} onChange={(value) => handleInputChange('personal', 'emergencyContact', value)} />
          </div>
        </div>
      </div>
    </div>
  );

  const renderMedicalInfo = () => (
    <div className="info-section">
      <h2>Medical Information</h2>
      <div className="info-grid">
        <div className="info-column">
          <div className="info-group">
            <h3>General Health</h3>
            <InfoItem label="Blood Type" value={patientData.medical.bloodType} isEditing={isEditing} onChange={(value) => handleInputChange('medical', 'bloodType', value)} />
            <InfoItem label="Allergies" value={patientData.medical.allergies} isEditing={isEditing} onChange={(value) => handleInputChange('medical', 'allergies', value)} />
            <InfoItem label="Chronic Conditions" value={patientData.medical.chronicConditions} isEditing={isEditing} onChange={(value) => handleInputChange('medical', 'chronicConditions', value)} />
          </div>
        </div>
        <div className="info-column">
          <div className="info-group">
            <h3>Medications and Exams</h3>
            <InfoItem label="Current Medications" value={patientData.medical.currentMedications} isEditing={isEditing} onChange={(value) => handleInputChange('medical', 'currentMedications', value)} />
            <InfoItem label="Last Physical Exam" value={patientData.medical.lastPhysicalExam} isEditing={isEditing} onChange={(value) => handleInputChange('medical', 'lastPhysicalExam', value)} />
            <InfoItem label="Vaccinations" value={patientData.medical.vaccinations} isEditing={isEditing} onChange={(value) => handleInputChange('medical', 'vaccinations', value)} />
          </div>
        </div>
        <div className="info-column">
          <div className="info-group">
            <h3>Family History</h3>
            <InfoItem label="Family History" value={patientData.medical.familyHistory} isEditing={isEditing} onChange={(value) => handleInputChange('medical', 'familyHistory', value)} />
          </div>
        </div>
      </div>
    </div>
  );

  const renderMedicalHistory = () => (
    <div className="info-section">
      <h2>Medical History</h2>
      <div className="medical-history">
        {patientData.history.map((event, index) => (
          <div key={index} className="history-item">
            <div className="history-date">{event.date}</div>
            <div className="history-event">{event.event}</div>
            <div className="history-details">{event.details}</div>
          </div>
        ))}
      </div>
    </div>
  );

  const InfoItem = ({ label, value, isEditing, onChange }) => (
    <div className="info-item">
      <label>{label}:</label>
      {isEditing ? (
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
    <div className="profile-dashboard">
      <div className="profile-header">
        <h1>Patient Profile</h1>
        {isEditing ? (
          <button className="edit-button" onClick={handleSave}>
            <Save size={20} />
            Save Changes
          </button>
        ) : (
          <button className="edit-button" onClick={handleEdit}>
            <Edit2 size={20} />
            Edit Profile
          </button>
        )}
      </div>
      <div className="profile-content">
        <div className="profile-nav">
          <button
            className={`nav-button ${activeSection === 'personal' ? 'active' : ''}`}
            onClick={() => setActiveSection('personal')}
          >
            <User size={20} />
            Personal Info
          </button>
          <button
            className={`nav-button ${activeSection === 'medical' ? 'active' : ''}`}
            onClick={() => setActiveSection('medical')}
          >
            <FileText size={20} />
            Medical Info
          </button>
          <button
            className={`nav-button ${activeSection === 'history' ? 'active' : ''}`}
            onClick={() => setActiveSection('history')}
          >
            <Activity size={20} />
            Medical History
          </button>
        </div>
        <div className="profile-details">
          {activeSection === 'personal' && renderPersonalInfo()}
          {activeSection === 'medical' && renderMedicalInfo()}
          {activeSection === 'history' && renderMedicalHistory()}
        </div>
      </div>
    </div>
  );
};


export default PatientProfileDashboard;