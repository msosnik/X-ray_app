import React, { useState } from 'react';
import '../styles/patientDashboard.css';  // Import your styles
import { Home, Calendar, Upload, MessageSquare, User, LogOut } from 'lucide-react';
const PatientDashboard = () => {
  const [tabContent, setTabContent] = useState('home');
  const [activeTab, setActiveTab] = useState('home');
  const [activeDoctor, setActiveDoctor] = useState(null);  // Track the selected doctor
  const [isCreatingAppointment, setIsCreatingAppointment] = useState(false);

  // Simulating user data
  const userData = {
    firstName: "John",
    lastName: "Doe",
  };

  // Simulating appointments data
  const [appointments, setAppointments] = useState([
    { id: 1, doctor: "Dr. Jane Smith", date: "2024-10-05", time: "14:00" },
    { id: 2, doctor: "Dr. Michael Johnson", date: "2024-10-10", time: "10:30" },
    { id: 3, doctor: "Dr. Emily Brown", date: "2024-10-15", time: "16:15" }
  ]);

  const doctors = [
    { id: 1, name: "Dr. Jane Smith" },
    { id: 2, name: "Dr. Michael Johnson" },
    { id: 3, name: "Dr. Emily Brown" },
    { id: 4, name: "Dr. David Lee" },
    { id: 5, name: "Dr. Sarah Wilson" }
  ];

  const chatMessages = {
    1: [
      { sender: "Dr. Jane Smith", message: "Hello! How can I help you today?" },
      { sender: "You", message: "I have a question about my recent prescription." }
    ],
    2: [
      { sender: "Dr. Michael Johnson", message: "Your test results are back. Everything looks normal." },
      { sender: "You", message: "That's great news, thank you!" }
    ],
    // Add more messages if needed for other doctors
  };

  const showHomeTab = () => (
    <div className="home-content">
      <div className="welcome-message">Welcome {userData.firstName} {userData.lastName}!</div>
      <div className="tab-description">
        <ul>
          <li>- <strong>Appointments</strong>: Plan, edit and cancel appointments</li>
          <li>- <strong>Upload X-Ray</strong>: Upload images to analyze</li>
          <li>- <strong>Messages</strong>: Chat with your doctor</li>
        </ul>
      </div>
    </div>
  );

  const handleEditAppointment = (id) => {
    // In a real app, this would open an edit form or modal
    alert(`Editing appointment with ID: ${id}`);
  };

  const handleDeleteAppointment = (id) => {
    // In a real app, you'd want to show a confirmation dialog before deleting
    setAppointments(appointments.filter(app => app.id !== id));
    alert(`Appointment with ID: ${id} has been deleted`);
  };

  const handleProfileClick = () => {
    // In a real app, this would navigate to the profile page or open a profile modal
    alert("Opening profile...");
  };

  const handleLogout = () => {
    // In a real app, this would handle the logout process
    alert("Logging out...");
  };

  const showAppointmentsTab = () => (
    <div>
      <div className="appointments-list">
        {appointments.map(app => (
          <div className="appointment-item" key={app.id}>
            <div>{app.doctor}</div>
            <div className="date-time">{app.date} {app.time}</div>
            <div className="appointment-actions">
              <button onClick={() => handleEditAppointment(app.id)}>Edit</button>
              <button onClick={() => handleDeleteAppointment(app.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
      <div className="create-appointment">
        <button 
          onClick={() => {
            setIsCreatingAppointment(true);
            // Here you would typically open a modal or navigate to a form
            alert("Opening appointment request form...");
            // Simulating an async operation
            setTimeout(() => setIsCreatingAppointment(false), 2000);
          }}
          disabled={isCreatingAppointment}
        >
          {isCreatingAppointment ? "Processing..." : "Create New Appointment Request"}
        </button>
      </div>
    </div>
  );
  

  const showUploadXRayTab = () => (
    <div className="upload-xray">
      <div className="body-part-selection">
        <label htmlFor="bodyPart">Body part:</label>
        <select id="bodyPart">
          <option value="chest">Chest</option>
          <option value="hand">Hand</option>
          <option value="foot">Foot</option>
          <option value="skull">Skull</option>
          <option value="spine">Spine</option>
        </select>
      </div>
      <div className="xray-content">
        <div className="xray-section">
          <h3>Original</h3>
          <div id="originalImage" className="xray-image"></div>
          <input type="file" id="xrayUpload" accept="image/png" style={{ display: 'none' }} />
          <button id="uploadBtn" onClick={() => document.getElementById('xrayUpload').click()}>Upload Image (PNG)</button>
        </div>
        <div className="xray-section">
          <h3>Results</h3>
          <div id="processedImage" className="xray-image">Processed image will appear here</div>
        </div>
      </div>
    </div>
  );

  const showMessagesTab = () => (
    <div className="messages-container">
      <div className="doctors-list">
        <button className="create-chat-btn" onClick={() => alert("Create new chat clicked!")}>+ Create Chat</button>
        {doctors.map(doctor => (
          <div
            className={`doctor-item ${activeDoctor === doctor.id ? 'active' : ''}`}  // Highlight the selected doctor
            key={doctor.id}
            onClick={() => setActiveDoctor(doctor.id)}  // Set the active doctor on click
          >
            {doctor.name}
          </div>
        ))}
      </div>
      <div className="chat-area">
        <div className="chat-messages" id="chatMessages">
          {activeDoctor && chatMessages[activeDoctor] ? (
            chatMessages[activeDoctor].map((msg, index) => (
              <div key={index}>
                <strong>{msg.sender}:</strong> {msg.message}
              </div>
            ))
          ) : (
            <div>Select a doctor to view the chat.</div>
          )}
        </div>
        <div className="chat-input">
          <input type="text" id="messageInput" placeholder="Type your message..." />
          <button id="sendMessageBtn" onClick={() => alert("Send message clicked!")}>Send</button>
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (tabContent) {
      case 'home':
        return showHomeTab();
      case 'appointments':
        return showAppointmentsTab();
      case 'upload':
        return showUploadXRayTab();
      case 'messages':
        return showMessagesTab();
      default:
        return null;
    }
  };



  return (
    <>
      {/* Header with Profile and Logout buttons */}
      <div className="header">
        <button id="profileBtn" onClick={handleProfileClick}>
          <User size={20} />
          Profile
        </button>
        <button id="logoutBtn" onClick={handleLogout}>
          <LogOut size={20} />
          Logout
        </button>
      </div>

      {/* Main dashboard container */}
      <div className="dashboard-container">
        {/* Tab Content */}
        <div id="tabContent">
          {renderTabContent()}
        </div>

        {/* Tabs */}
        <div className="tabs">
          <button
            className={`fab-button ${activeTab === 'home' ? 'active' : ''}`}
            onClick={() => { setTabContent('home'); setActiveTab('home'); }}>
            <Home size={28} />
            Home
          </button>
          <button
            className={`fab-button ${activeTab === 'appointments' ? 'active' : ''}`}
            onClick={() => { setTabContent('appointments'); setActiveTab('appointments'); }}>
            <Calendar size={28} />
            Appointments
          </button>
          <button
            className={`fab-button ${activeTab === 'upload' ? 'active' : ''}`}
            onClick={() => { setTabContent('upload'); setActiveTab('upload'); }}>
            <Upload size={28} />
            Upload X-Ray
          </button>
          <button
            className={`fab-button ${activeTab === 'messages' ? 'active' : ''}`}
            onClick={() => { setTabContent('messages'); setActiveTab('messages'); }}>
            <MessageSquare size={28} />
            Messages
          </button>
        </div>
      </div>
    </>
  );
};


export default PatientDashboard;