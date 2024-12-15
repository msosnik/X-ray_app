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
  const [selectedBodyPart, setSelectedBodyPart] = useState('Chest');
  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const storedUserData = JSON.parse(localStorage.getItem('userInfo'));
  const [patientId, setPatientId] = useState(storedUserData?.id || null);
  const [userData, setUserData] = useState({
    firstName: storedUserData?.firstName || 'User',
    lastName: storedUserData?.lastName || '',
    email: storedUserData?.email || '',
  });

  const API_KEY = process.env.REACT_APP_STREAM_API_KEY;
  const USER_ID = 'patient_john_doe';
  const USER_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoicGF0aWVudF9qb2huX2RvZSJ9.placeholder_patient_token';
  const CONSULTATION_ROOM_ID = 'consultation_room';

  const [newAppointment, setNewAppointment] = useState({
    patientId: patientId,
    doctorId: null,
    appointmentDateTime: '',
    status: 'SCHEDULED'
  });

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
  
  const fetchAppointments = async () => {
    try {
      setIsLoading(true);
      const appointmentsResponse = await fetch(`http://localhost:8080/appointment/patient/${patientId}`, {
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
            const doctorResponse = await fetch(`http://localhost:8080/doctor/${appointment.doctorId}`, {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
              }
            });

            if (!doctorResponse.ok) {
              throw new Error(`Failed to fetch doctor ${appointment.doctorId}`);
            }

            const doctorData = await doctorResponse.json();
            return {
              id: appointment.id,
              doctor: `Dr. ${doctorData.passwordHash} ${doctorData.lastName}`,
              status: appointment.status || 'SCHEDULED',
              date: new Date(appointment.appointmentDateTime).toISOString().split('T')[0],
              time: new Date(appointment.appointmentDateTime).toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: false
              }),
              originalData: appointment
            };
          } catch (doctorError) {
            console.error(`Error fetching doctor ${appointment.doctorId}:`, doctorError);
            
            return {
              id: appointment.id,
              doctor: 'Unknown Doctor',
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
    if (patientId) {
      fetchAppointments();
    }
  }, [patientId]);

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
      if (!newAppointment.doctorId || !newAppointment.appointmentDateTime) {
        alert('Please select a doctor and appointment time');
        return;
      }

      const selectedDoctor = doctors.find(d => d.id === newAppointment.doctorId);

      const appointmentDateTimeLocal = new Date(newAppointment.appointmentDateTime);

      const appointmentDateTimeUTC = new Date(
        appointmentDateTimeLocal.getTime() - appointmentDateTimeLocal.getTimezoneOffset() * 60000
      );

      const appointmentData = {
        id: 0,
        patientId: patientId,
        doctorId: newAppointment.doctorId,
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
        doctor: selectedDoctor 
          ? `Dr. ${selectedDoctor.firstName} ${selectedDoctor.lastName}` 
          : 'Unknown Doctor',
        status: createdAppointment.status || 'SCHEDULED',
        date: formattedDate,
        time: formattedTime,
        originalData: createdAppointment
      };
  
      setAppointments(prevAppointments => [...prevAppointments, formattedAppointment]);
      setNewAppointment({
        patientId: patientId,
        doctorId: null,
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
    const fetchDoctors = async () => {
      try {
        const response = await fetch('http://localhost:8080/doctor/', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          }
        });
  
        if (!response.ok) {
          throw new Error('Failed to fetch doctors');
        }
  
        const doctorsData = await response.json();
        
        const formattedDoctors = doctorsData.map(doctor => ({
          id: doctor.id,
          name: doctor.passwordHash,
          firstName: doctor.passwordHash,
          lastName: doctor.lastName,
          specialization: doctor.specialization,
          availability: doctor.availability
        }));
  
        setDoctors(formattedDoctors);
      } catch (error) {
        console.error('Error fetching doctors:', error);
        alert(`Failed to load doctors: ${error.message}`);
      }
    };
  
    fetchDoctors();
  }, []);

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

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];

    const currentDate = new Date().toISOString().split('T')[0];

    const imageMetadata = {
        patientId: 1,
        bodyPart: selectedBodyPart,
        uploadDate: currentDate,
        imagePath: "wololo",
    };

    if (file && file.type.startsWith("image/")) {
        try {
            console.log("Uploading full image:", {
                metadata: imageMetadata,
                fileName: file.name,
                fileType: file.type,
                fileSize: file.size,
            });

            const formData = new FormData();
            formData.append(
                "data",
                new Blob([JSON.stringify(imageMetadata)], { type: "application/json" })
            );
            formData.append("file", file);

            const uploadResponse = await fetch("http://localhost:8080/xray-images/full", {
                method: "POST",
                body: formData,
            });

            console.log("Response details:", {
                status: uploadResponse.status,
                statusText: uploadResponse.statusText,
                headers: Object.fromEntries(uploadResponse.headers),
            });

            if (!uploadResponse.ok) {
                throw new Error(`Upload failed: ${uploadResponse.status}`);
            }

            const uploadResponseData = await uploadResponse.json();
            console.log("Uploaded full X-ray image response:", uploadResponseData);

            const imageId = 1;

            const analysisResponse = await fetch(`http://localhost:8080/analysis-result/image/${imageId}`);

            if (!analysisResponse.ok) {
              throw new Error(`Analysis fetch failed: ${analysisResponse.status}`);
            }

            const analysisData = await analysisResponse.json();

            const imageUrl = URL.createObjectURL(file);
            setUploadedImage(imageUrl);

            setProcessedImage(analysisData);

            alert("Full image upload successful!");
        } catch (error) {
            console.error("Full upload error details:", {
                message: error.message,
                name: error.name,
                stack: error.stack,
            });
            setProcessedImage(`Analysis failed: ${error.message}`);
            alert(`Full upload failed: ${error.message}`);
        }
    } else {
        alert("Please upload a valid image file");
    }
  };

  const renderAnalysisResults = (analysisData) => {
    const {
      detectedAbnormalities,
      analysisDate,
      doctorReviewed,
      doctorComments
    } = analysisData;
  
    return (
      <div className="analysis-details">
        <h4>X-Ray Analysis</h4>
        <p><strong>Date:</strong> {analysisDate}</p>
        
        <div className="abnormalities-section">
          <strong>Detected Abnormalities:</strong>
          {detectedAbnormalities && detectedAbnormalities.length > 0 ? (
            <ul className="abnormalities-list">
              {detectedAbnormalities.map((abnormality, index) => (
                <li key={index}>{abnormality.replace(/^\s+/, '')}</li>
              ))}
            </ul>
          ) : (
            <p>No abnormalities detected</p>
          )}
        </div>
  
        <div className="doctor-review-section">
          <strong>Doctor Review Status:</strong>
          <p>{doctorReviewed ? 'Reviewed' : 'Pending Review'}</p>
          
          {doctorComments && (
            <div className="doctor-comments">
              <strong>Doctor Comments:</strong>
              <p>{doctorComments}</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  const showAppointmentsTab = () => (
    <div>
      <div className="appointments-list">
        {appointments.map(app => (
          <div className="appointment-item" key={app.id}>
            <div className="doctor-name">{app.doctor}</div>
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
        <h3>Create New Appointment</h3>
        <form onSubmit={handleCreateAppointment}>
          <div>
            <label htmlFor="doctorSelect">Select Doctor:</label>
            <select
              id="doctorSelect"
              value={newAppointment.doctorId || ''}
              onChange={(e) => setNewAppointment({
                ...newAppointment, 
                doctorId: parseInt(e.target.value)
              })}
              required
            >
              <option value="">Select a Doctor</option>
              {doctors.map(doctor => (
                <option key={doctor.id} value={doctor.id}>
                  {doctor.name} - {doctor.specialization} ({doctor.availability})
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
  

  const showUploadXRayTab = () => (
    <div className="upload-xray">
      <div className="body-part-selection">
        <label htmlFor="bodyPart">Body part:</label>
        <select id="bodyPart" value={selectedBodyPart} onChange={(e) => setSelectedBodyPart(e.target.value)}>
          <option value="Chest">Chest</option>
          <option value="Hand">Hand</option>
          <option value="Foot">Foot</option>
          <option value="Skull">Skull</option>
          <option value="Spine">Spine</option>
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
              <div className="analysis-results">
                {renderAnalysisResults(processedImage)}
              </div>
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