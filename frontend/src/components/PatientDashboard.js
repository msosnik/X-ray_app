import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/patientDashboard.css';
import { Home, Calendar, Upload, MessageSquare, User, LogOut, Phone } from 'lucide-react';
import PatientProfileDashboard from './PatientProfileDashboard';
import { 
  Call, 
  StreamCall, 
  StreamVideo, 
  StreamVideoClient, 
  CallControls,
  ParticipantView,
} from '@stream-io/video-react-sdk';
import 'stream-chat-react/dist/css/index.css';
import '@stream-io/video-react-sdk/dist/css/styles.css';

const PatientDashboard = ({ onLogout }) => {
  const [tabContent, setTabContent] = useState('home');
  const [activeTab, setActiveTab] = useState('home');
  const [activeDoctor, setActiveDoctor] = useState(null);
  const [isCreatingAppointment, setIsCreatingAppointment] = useState(false);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [processedImage, setProcessedImage] = useState(null);
  const [upcomingConsultations, setUpcomingConsultations] = useState([]);
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [videoCall, setVideoCall] = useState(null);
  const [streamVideoClient, setStreamVideoClient] = useState(null);

  const API_KEY = process.env.REACT_APP_STREAM_API_KEY;
  const USER_ID = 'patient_john_doe';
  const USER_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoicGF0aWVudF9qb2huX2RvZSJ9.placeholder_patient_token';
  const CONSULTATION_ROOM_ID = 'consultation_room';

  const userData = {
    firstName: "John",
    lastName: "Doe",
  };

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
    alert(`Editing appointment with ID: ${id}`);
  };

  const handleDeleteAppointment = (id) => {
    setAppointments(appointments.filter(app => app.id !== id));
    alert(`Appointment with ID: ${id} has been deleted`);
  };

  const handleProfileClick = () => {
    setTabContent('profile');
    setActiveTab('profile');
  };

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    }

    // window.location.href = '/login';
    navigate('/login');
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = () => {
        setUploadedImage(reader.result);
        setProcessedImage('Processed image will be shown here after backend processing');
      };
      reader.readAsDataURL(file);
    } else {
      alert('Please upload a valid image file');
    }
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
            alert("Opening appointment request form...");
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
          <div id="originalImage" className={`xray-image ${uploadedImage ? 'has-image' : ''}`}>
            {uploadedImage ? (
              <img 
                src={uploadedImage} 
                alt="Original X-Ray" 
                style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} 
              />
            ) : (
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageUpload}
                accept="image/*"
                style={{ display: 'none' }}
              />
            )}
            <button 
              id="uploadBtn" 
              onClick={() => fileInputRef.current.click()}
              style={{ display: uploadedImage ? 'none' : 'flex' }}
            >
              Upload Image
            </button>
          </div>
          {uploadedImage && (
            <button 
              onClick={() => {
                setUploadedImage(null);
                setProcessedImage(null);
                if (fileInputRef.current) {
                  fileInputRef.current.value = '';
                }
              }}
              className="clear-image-btn"
            >
              Clear Image
            </button>
          )}
        </div>
        <div className="xray-section">
          <h3>Results</h3>
          <div id="processedImage" className="xray-image">
            {processedImage ? (
              typeof processedImage === 'string' ? (
                <div className="processing-message">{processedImage}</div>
              ) : (
                <img 
                  src={processedImage} 
                  alt="Processed X-Ray" 
                  style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} 
                />
              )
            ) : (
              <div className="placeholder-message">Upload an image to see results</div>
            )}
          </div>
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
            className={`doctor-item ${activeDoctor === doctor.id ? 'active' : ''}`}
            key={doctor.id}
            onClick={() => setActiveDoctor(doctor.id)}
          >
            {doctor.name}
          </div>
        ))}
      </div>
      <div className="chat-area">
        {activeDoctor && (
          <div className="message-bar">
            <span className="doctor-name">{doctors.find(d => d.id === activeDoctor)?.name}</span>
            <button className="call-button" onClick={handleCall} disabled={!activeDoctor}>
              <Phone size={16} /> Call
            </button>
          </div>
        )}
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
      case 'profile':
        return <PatientProfileDashboard />;
      default:
        return null;
    }
  };

  useEffect(() => {
    const initStreamVideoClient = async () => {
      try {
        const videoClient = new StreamVideoClient({ 
          apiKey: API_KEY, 
          user: { 
            id: USER_ID, 
            name: `${userData.firstName} ${userData.lastName}` 
          },
          token: USER_TOKEN
        });
        setStreamVideoClient(videoClient);
      } catch (error) {
        console.error('Stream initialization error:', error);
      }
    };

    if (API_KEY) {
      initStreamVideoClient();
    }

    // Cleanup
    return () => {
      if (streamVideoClient) {
        streamVideoClient.disconnectUser();
      }
    };
  }, [API_KEY]);

  const handleCall = async () => {
    if (!streamVideoClient || !activeDoctor) {
      alert('Video client not initialized');
      return;
    }

    try {
      const call = streamVideoClient.call('default', CONSULTATION_ROOM_ID);
      
      await call.join({ create: false });
      
      await call.camera.enable();
      await call.microphone.enable();
  
      setVideoCall(call);
      navigate(`/consultation/${CONSULTATION_ROOM_ID}`);

    } catch (error) {
      console.error('Video call join error:', error);
      alert(`Failed to join video call: ${error.message}`);
    }
  };

  const endVideoCall = async () => {
    if (videoCall) {
      await videoCall.leave();
      setVideoCall(null);
    }
  };

  return (
    <>
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

      <div className="dashboard-container">
        <div id="tabContent">
          {renderTabContent()}
        </div>

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
      {videoCall && streamVideoClient && (
        <StreamVideo client={streamVideoClient}>
          <StreamCall call={videoCall}>
            <div className="video-call-container">
              {videoCall.participants.map((participant) => (
                <div key={participant.user_id} className="participant-container">
                  <ParticipantView 
                    participant={participant} 
                    className={participant.user_id === USER_ID ? 'local-participant' : 'remote-participant'}
                  />
                </div>
              ))}
              <CallControls onLeave={endVideoCall} />
            </div>
          </StreamCall>
        </StreamVideo>
      )}
    </>
  );
};

export default PatientDashboard;