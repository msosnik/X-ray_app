import React, { useState, useRef, useEffect } from 'react';
import { Home, Users, Calendar, Upload, MessageSquare, User, LogOut, Phone, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import '../styles/doctorDashboard.css'
import 'stream-chat-react/dist/css/index.css';
import '@stream-io/video-react-sdk/dist/css/styles.css';
import { StreamChat } from 'stream-chat';
import { 
  Call, 
  StreamCall, 
  StreamVideo, 
  StreamVideoClient, 
  CallControls,
  ParticipantView,
} from '@stream-io/video-react-sdk';

const DoctorDashboard = ({ onLogout }) => {
  const [tabContent, setTabContent] = useState('home');
  const [activeTab, setActiveTab] = useState('home');
  const [activePatient, setActivePatient] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [uploadedImage, setUploadedImage] = useState(null);
  const [processedImage, setProcessedImage] = useState(null);
  const [selectedPatient, setSelectedPatient] = useState('');
  const [selectedBodyPart, setSelectedBodyPart] = useState('chest');
  const [scheduledConsultations, setScheduledConsultations] = useState([]);
  const [videoCall, setVideoCall] = useState(null);
  const [streamVideoClient, setStreamVideoClient] = useState(null);
  const [streamChatClient, setStreamChatClient] = useState(null);
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [patients, setPatients] = useState([]);
  const storedUserData = JSON.parse(localStorage.getItem('userInfo'));
  const [doctorId, setDoctorId] = useState(storedUserData?.id || null);
  const [userData, setUserData] = useState({
    firstName: storedUserData?.firstName || 'User',
    lastName: storedUserData?.lastName || '',
    email: storedUserData?.email || '',
  });

  const API_KEY = process.env.REACT_APP_STREAM_API_KEY;

  const USER_ID = 'doctor_jane_smith';
  const USER_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiZG9jdG9yX2phbmVfc21pdGgifQ.placeholder_token_for_testing';
  const CONSULTATION_ROOM_ID = 'consultation_room';
  
  const [newAppointment, setNewAppointment] = useState({
    patientId: null,
    doctorId: doctorId,
    appointmentDateTime: '',
    status: 'SCHEDULED'
  });

  const chatMessages = {
    1: [
      { sender: "You", message: "Hello John, how are you feeling today?" },
      { sender: "John Doe", message: "Much better, Doctor. The pain medication helped." }
    ],
    2: [
      { sender: "You", message: "Hi Sarah, I've reviewed your latest X-rays." },
      { sender: "Sarah Johnson", message: "How does it look, Doctor?" }
    ],
  };

  const fetchAppointments = async () => {
    try {
      setIsLoading(true);
      const appointmentsResponse = await fetch(`http://localhost:8080/appointment/doctor/${doctorId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!appointmentsResponse.ok) {
        throw new Error('Failed to fetch appointments');
      }

      const appointmentsData = await appointmentsResponse.json();

      const formattedAppointments = await Promise.all(
        appointmentsData.map(async (appointment) => {
          try {
            const patientResponse = await fetch(`http://localhost:8080/patient/${appointment.patientId}`, {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
              }
            });

            if (!patientResponse.ok) {
              throw new Error(`Failed to fetch patient ${appointment.patientId}`);
            }

            const patientData = await patientResponse.json();
            return {
              id: appointment.id,
              patient: `${patientData.firstName} ${patientData.lastName}`,
              status: appointment.status || 'SCHEDULED',
              date: new Date(appointment.appointmentDateTime).toISOString().split('T')[0],
              time: new Date(appointment.appointmentDateTime).toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: false
              }),
              originalData: appointment
            };
          } catch (patientError) {
            console.error(`Error fetching patient ${appointment.patientId}:`, patientError);
            
            return {
              id: appointment.id,
              patient: 'Unknown Patient',
              status: appointment.status || 'SCHEDULED',
              date: new Date(appointment.appointmentDateTime).toISOString().split('T')[0],
              time: new Date(appointment.appointmentDateTime).toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: false
              }),
              originalData: appointment
            };
          }
        })
      );

      setAppointments(formattedAppointments);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      setError('Failed to load appointments');
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    if (doctorId) {
      fetchAppointments();
    }
  }, [doctorId]);

  const handleEditAppointment = (id) => {
    alert(`Editing appointment with ID: ${id}`);
  };

  const handleDeleteAppointment = async (id) => {
    try {
      const response = await fetch(`http://localhost:8080/appointment/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        }
      });
  
      if (!response.ok) {
        throw new Error('Failed to delete appointment');
      }
  
      setAppointments(appointments.filter(app => app.id !== id));
      
      alert('Appointment successfully deleted');
    } catch (error) {
      console.error('Error deleting appointment:', error);
      alert(`Failed to delete appointment: ${error.message}`);
    }
  };

  const handleCreateAppointment = async (e) => {
    e.preventDefault();
  
    try {
      if (!newAppointment.patientId || !newAppointment.appointmentDateTime) {
        alert('Please select a patient and appointment time');
        return;
      }

      const selectedPatient = patients.find(p => p.id === newAppointment.patientId);

      const appointmentDateTimeLocal = new Date(newAppointment.appointmentDateTime);

      const appointmentDateTimeUTC = new Date(
        appointmentDateTimeLocal.getTime() - appointmentDateTimeLocal.getTimezoneOffset() * 60000
      );

      const appointmentData = {
        id: 0,
        patientId: newAppointment.patientId,
        doctorId: doctorId,
        appointmentDateTime: appointmentDateTimeUTC.toISOString(),
        status: "SCHEDULED",
        createdAt: new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString().split('T')[0]
      };

      console.log('Appointment Creation Payload:', JSON.stringify(appointmentData, null, 2));
  
      const response = await fetch('http://localhost:8080/appointment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(appointmentData)
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error Response:', errorText);
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }
  
      const createdAppointment = await response.json();
  
      const appointmentDateLocal = new Date(createdAppointment.appointmentDateTime);
      const formattedDate = appointmentDateLocal.toISOString().split('T')[0];
      const formattedTime = appointmentDateLocal.toLocaleTimeString('en-GB', {
        hour: '2-digit',
        minute: '2-digit',
      });
  
      const formattedAppointment = {
        id: createdAppointment.id,
        patient: selectedPatient 
          ? `${selectedPatient.firstName} ${selectedPatient.lastName}` 
          : 'Unknown Patient',
        status: createdAppointment.status || 'SCHEDULED',
        date: formattedDate,
        time: formattedTime,
        originalData: createdAppointment
      };
  
      setAppointments(prevAppointments => [...prevAppointments, formattedAppointment]);
      setNewAppointment({
        patientId: null,
        doctorId: doctorId,
        appointmentDateTime: '',
        status: 'SCHEDULED'
      });
  
      alert('Appointment created successfully!');
    } catch (error) {
      console.error('Error creating appointment:', error);
      alert(`Failed to create appointment: ${error.message}`);
    }
  };

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await fetch('http://localhost:8080/patient/', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          }
        });
  
        if (!response.ok) {
          throw new Error('Failed to fetch doctors');
        }
  
        const patientsData = await response.json();
        
        const formattedPatients = patientsData.map(patient => ({
          id: patient.id,
          name: patient.firstName,
          firstName: patient.firstName,
          lastName: patient.lastName,
        }));
  
        setPatients(formattedPatients);
      } catch (error) {
        console.error('Error fetching doctors:', error);
        alert(`Failed to load doctors: ${error.message}`);
      }
    };
  
    fetchPatients();
  }, []);

  const showHomeTab = () => (
    <div className="home-content">
      <div className="welcome-message">Welcome Dr. {userData.lastName}!</div>
      <div className="tab-description">
        <ul>
          <li>- <strong>Patients</strong>: View and manage patient records</li>
          <li>- <strong>Appointments</strong>: Schedule and manage appointments</li>
          <li>- <strong>X-Ray Analysis</strong>: Review and analyze patient X-rays</li>
          <li>- <strong>Messages</strong>: Communicate with your patients</li>
        </ul>
      </div>
    </div>
  );

  const showPatientsTab = () => (
    <div className="patients-container">
      <div className="search-bar">
        <Search size={20} />
        <input 
          type="text" 
          placeholder="Search patients..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>
      <div className="patients-list">
        {patients
          .filter(patient => 
            patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            patient.condition.toLowerCase().includes(searchTerm.toLowerCase())
          )
          .map(patient => (
            <div key={patient.id} className="patient-card">
              <div className="patient-info">
                <div className="patient-header">
                  <h3>{patient.name}</h3>
                  <span className="patient-age">Age: {patient.age}</span>
                </div>
                <div className="patient-details">
                  <p>Last Visit: {patient.lastVisit}</p>
                  <p>Condition: {patient.condition}</p>
                </div>
                <div className="patient-actions">
                  <button onClick={() => alert(`Viewing records for ${patient.name}`)}>
                    View Records
                  </button>
                  <button onClick={() => alert(`Schedule appointment for ${patient.name}`)}>
                    Schedule
                  </button>
                  <button onClick={() => setActivePatient(patient.id)}>
                    Message
                  </button>
                </div>
              </div>
            </div>
        ))}
      </div>
    </div>
  );

  const showAppointmentsTab = () => (
    <div>
      <div className="appointments-list">
        {appointments.map(app => (
          <div className="appointment-item" key={app.id}>
            <div className="patient-name">{app.patient}</div>
            <div className="appointment-status"> {app.status}</div>
            <div className="date-time">{app.date} {app.time}</div>
            <div className="appointment-actions">
              <button onClick={() => handleEditAppointment(app.id)}>Edit</button>
              <button onClick={() => handleDeleteAppointment(app.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
      <div className="create-appointment">
        <form onSubmit={handleCreateAppointment}>
          <div>
            <label htmlFor="patientSelect">Select Patient:</label>
            <select
              id="patientSelect"
              value={newAppointment.patientId || ''}
              onChange={(e) => setNewAppointment({
                ...newAppointment, 
                patientId: parseInt(e.target.value)
              })}
              required
            >
              <option value="">Select a Patient</option>
              {patients.map(patient => (
                <option key={patient.id} value={patient.id}>
                  {patient.firstName} {patient.lastName}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="appointmentDateTime">Appointment Date and Time:</label>
            <input
              type="datetime-local"
              id="appointmentDateTime"
              value={newAppointment.appointmentDateTime}
              onChange={(e) => setNewAppointment({
                ...newAppointment, 
                appointmentDateTime: e.target.value
              })}
              required
            />
          </div>
          <button type="submit">Create Appointment</button>
        </form>
      </div>
    </div>
  );

  const showXRayAnalysisTab = () => (
    <div className="upload-xray">
      <div className="analysis-controls">
        <div className="analysis-select-group">
          <label htmlFor="patientSelect">Patient:</label>
          <select 
            id="patientSelect"
            value={selectedPatient}
            onChange={(e) => setSelectedPatient(e.target.value)}
            className="analysis-select"
          >
            <option value="">Select Patient</option>
            {patients.map(patient => (
              <option key={patient.id} value={patient.id}>
                {patient.name}
              </option>
            ))}
          </select>
        </div>
        <div className="analysis-select-group">
          <label htmlFor="bodyPart">Body part:</label>
          <select 
            id="bodyPart"
            value={selectedBodyPart}
            onChange={(e) => setSelectedBodyPart(e.target.value)}
            className="analysis-select"
          >
            <option value="chest">Chest</option>
            <option value="hand">Hand</option>
            <option value="foot">Foot</option>
            <option value="skull">Skull</option>
            <option value="spine">Spine</option>
          </select>
        </div>
      </div>
      <div className="xray-content">
        <div className="xray-section">
          <h3>Original</h3>
          <div className={`xray-image ${uploadedImage ? 'has-image' : ''}`}>
            {uploadedImage ? (
              <img src={uploadedImage} alt="Original" />
            ) : (
              <input
                type="file"
                ref={fileInputRef}
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onload = () => {
                      setUploadedImage(reader.result);
                      setProcessedImage('Analysis in progress...');
                    };
                    reader.readAsDataURL(file);
                  }
                }}
                accept="image/*"
                style={{ display: 'none' }}
              />
            )}
            <button 
              className="upload-btn"
              onClick={() => fileInputRef.current.click()}
              style={{ display: uploadedImage ? 'none' : 'block' }}
            >
              Upload Image
            </button>
          </div>
        </div>
        <div className="xray-section">
          <h3>Analysis Results</h3>
          <div className="xray-image">
            <div className="analysis-results">
              {processedImage ? (
                <>
                  <div className="analysis-text">
                    <h4>AI Analysis Summary:</h4>
                    <ul>
                      <li>No significant abnormalities detected</li>
                      <li>Bone density: Normal</li>
                      <li>Joint spacing: Within normal limits</li>
                    </ul>
                  </div>
                  <button className="generate-report-btn" onClick={() => alert("Generating report...")}>
                    Generate Report
                  </button>
                </>
              ) : (
                <div className="placeholder-message">
                  Upload an image to see results
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const showMessagesTab = () => (
    <div className="messages-container">
      <div className="patients-list">
        <div className="search-bar">
          <Search size={20} />
          <input 
            type="text" 
            placeholder="Search conversations..." 
            className="search-input"
          />
        </div>
        {patients.map(patient => (
          <div
            className={`patient-chat-item ${activePatient === patient.id ? 'active' : ''}`}
            key={patient.id}
            onClick={() => setActivePatient(patient.id)}
          >
            {patient.firstName} {patient.lastName}
          </div>
        ))}
      </div>
      <div className="chat-area">
        {activePatient && (
          <>
            <div className="message-bar">
              <span className="patient-name">
                {patients.find(p => p.id === activePatient)?.firstName}
              </span>
              <button className="call-button" onClick={
                startVideoCall
              }>
              <Phone size={16} /> Call
              </button>
            </div>
            <div className="chat-messages">
              {chatMessages[activePatient] ? (
                chatMessages[activePatient].map((msg, index) => (
                  <div key={index} className={`message ${msg.sender === 'You' ? 'sent' : 'received'}`}>
                    <strong>{msg.sender}:</strong> {msg.message}
                  </div>
                ))
              ) : (
                <div className="no-messages">No messages yet</div>
              )}
            </div>
            <div className="chat-input">
              <input type="text" placeholder="Type your message..." />
              <button onClick={() => alert("Sending message...")}>Send</button>
            </div>
          </>
        )}
      </div>
    </div>
  );

  useEffect(() => {
    const initStreamVideoClient = async () => {
      try {
        const videoClient = new StreamVideoClient({ 
          apiKey: API_KEY, 
          user: { 
            id: USER_ID, 
            name: 'Dr. Jane Smith' 
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

    return () => {
      if (streamVideoClient) {
        streamVideoClient.disconnectUser();
      }
    };
  }, [API_KEY]);

  const startVideoCall = async (patient) => {
    if (!streamVideoClient) return;
    try {
      const call = streamVideoClient.call('default', CONSULTATION_ROOM_ID);
      
      await call.create({
        data: {
          members: [
            {
              user_id: USER_ID,
              role: 'call_member'
            }
          ]
        }
      });
      
      await call.join({ create: true });
  
      await call.camera.enable();
      await call.microphone.enable();
  
      setVideoCall(call);
      navigate(`/consultation/${CONSULTATION_ROOM_ID}`);
    } catch (error) {
      console.error('Video call error:', error);
      alert(`Failed to start video call: ${error.message}`);
    }
  };

  const endVideoCall = async () => {
    if (videoCall) {
      await videoCall.leave();
      setVideoCall(null);
    }
  };

  const handleProfileClick = () => {
    setTabContent('profile');
    setActiveTab('profile');
  };

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    }

    navigate('/login');
  };

  const renderTabContent = () => {
    switch (tabContent) {
      case 'home':
        return showHomeTab();
      case 'patients':
        return showPatientsTab();
      case 'appointments':
        return showAppointmentsTab();
      case 'xray':
        return showXRayAnalysisTab();
      case 'messages':
        return showMessagesTab();
      default:
        return null;
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
            className={`fab-button ${activeTab === 'patients' ? 'active' : ''}`}
            onClick={() => { setTabContent('patients'); setActiveTab('patients'); }}>
            <Users size={28} />
            Patients
          </button>
          <button
            className={`fab-button ${activeTab === 'appointments' ? 'active' : ''}`}
            onClick={() => { setTabContent('appointments'); setActiveTab('appointments'); }}>
            <Calendar size={28} />
            Appointments
          </button>
          <button
            className={`fab-button ${activeTab === 'xray' ? 'active' : ''}`}
            onClick={() => { setTabContent('xray'); setActiveTab('xray'); }}>
            <Upload size={28} />
            X-Ray Analysis
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

export default DoctorDashboard;