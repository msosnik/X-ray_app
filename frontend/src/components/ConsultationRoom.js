import React, { useEffect, useState, useCallback } from 'react';
import { StreamChat } from 'stream-chat';
import { Chat, Channel, Window, MessageList, MessageInput } from 'stream-chat-react';
import {
  StreamVideo,
  StreamVideoClient,
  StreamCall,
  CallControls,
  SpeakerLayout  
} from '@stream-io/video-react-sdk';
import { useNavigate } from 'react-router-dom';
import '@stream-io/stream-chat-css/dist/v2/css/index.css';
import '@stream-io/video-react-sdk/dist/css/styles.css';

const apiKey = process.env.REACT_APP_STREAM_API_KEY;

function ConsultationRoom() {
  const [chatClient, setChatClient] = useState(null);
  const [videoClient, setVideoClient] = useState(null);
  const [channel, setChannel] = useState(null);
  const [call, setCall] = useState(null);
  const [error, setError] = useState(null);
  const [loadingState, setLoadingState] = useState('Initializing');
  const [userType, setUserType] = useState(null);
  const [isLeavingCall, setIsLeavingCall] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const initializeClients = async () => {
      try {
        setLoadingState('Checking credentials');
        const username = localStorage.getItem('username');
        const userTypeFromStorage = localStorage.getItem('userType');
        
        console.log('Username from localStorage:', username);
        console.log('UserType from localStorage:', userTypeFromStorage);

        if (!username || !userTypeFromStorage) {
          throw new Error('Username or UserType not found in localStorage');
        }

        setUserType(userTypeFromStorage);

        if (!apiKey) {
          throw new Error('Stream API key is not defined');
        }

        const userDetails = {
          id: username,
          name: username,
          role: userTypeFromStorage,
          image: `https://getstream.io/random_svg/?id=${username}&name=${username}`,
        };

        const chatClientInstance = StreamChat.getInstance(apiKey);
        const token = chatClientInstance.devToken(username);
        await chatClientInstance.connectUser(userDetails, token);
        setChatClient(chatClientInstance);

        const channelId = window.location.pathname.split('/').pop();
        const channelInstance = chatClientInstance.channel('messaging', channelId, {
          name: 'Consultation Channel',
          members: [username],
          created_by_id: username,
        });
        
        try {
          await channelInstance.watch();
        } catch (error) {
          if (error.code === 4) {
            await channelInstance.create({
              grants: {
                read: ['*'],
                write: ['*'],
                delete: ['*'],
              },
            });
          } else {
            throw error;
          }
        }
        
        await channelInstance.addMembers([username]);
        setChannel(channelInstance);

        const videoClientInstance = new StreamVideoClient({
          apiKey,
          user: userDetails,
          token,
        });
        setVideoClient(videoClientInstance);

        const callInstance = videoClientInstance.call('default', channelId);
        await callInstance.join({ create: true });
        setCall(callInstance);

        setLoadingState('Ready');
      } catch (error) {
        console.error('Error in initializeClients:', error);
        setError(`Error initializing: ${error.message}`);
        setLoadingState('Error');
      }
    };

    initializeClients();

    return () => {
      if (chatClient) {
        chatClient.disconnectUser().then(() => console.log('Chat client disconnected'));
      }
      if (videoClient) {
        videoClient.disconnectUser().then(() => console.log('Video client disconnected'));
      }
    };
  }, []);

  const handleLeaveCall = useCallback(async () => {
    try {
      console.log('handleLeaveCall function called');
      console.log('Current userType:', userType);
      console.log('Current call state:', call);
      console.log('Is leaving call:', isLeavingCall);

      if (isLeavingCall) {
        console.log('Already in the process of leaving the call. Redirecting...');
        redirectToDashboard();
        return;
      }

      setIsLeavingCall(true);

      if (call) {
        try {
          console.log('Attempting to leave the call');
          call.camera.disable();
          call.microphone.disable();
          call.screenShare.stop();

        } catch (error) {
          console.error('Error during call cleanup:', error);
        } finally {
          setCall(null);
          console.log('Call cleanup completed');
        }
      } else {
        console.log('No active call to leave');
      }

      if (videoClient) {
        try {
          await videoClient.disconnectUser();
          console.log('Video client disconnected');
        } catch (error) {
          console.error('Error disconnecting video client:', error);
        }
      }

      redirectToDashboard();
    } catch (error) {
      console.error('Unexpected error in handleLeaveCall:', error);
    } finally {
      redirectToDashboard();
    }
  }, [call, videoClient, userType, isLeavingCall]);

  const redirectToDashboard = useCallback(() => {
    console.log('Preparing to navigate');
    setTimeout(() => {
      if (userType === 'patient') {
        console.log('Navigating to patient dashboard');
        navigate('/patient-dashboard');
      } else if (userType === 'doctor') {
        console.log('Navigating to doctor dashboard');
        navigate('/doctor-dashboard');
      } else {
        console.error('Unknown userType:', userType);
        console.log('Navigating to home');
        navigate('/');
      }
    }, 500);
  }, [userType, navigate]);

  if (error) return <div>Error: {error}</div>;

  return (
    <div style={{ 
      display: 'flex', 
      height: 'calc(100vh - 80px)', 
      maxHeight: '100vh', 
      overflow: 'hidden' 
    }}>
      <div style={{ 
        width: '50%', 
        height: '100%', 
        overflowY: 'auto' 
      }}>
        {chatClient && channel && (
          <Chat client={chatClient} theme="messaging light">
            <Channel channel={channel}>
              <Window>
                <MessageList />
                <MessageInput />
              </Window>
            </Channel>
          </Chat>
        )}
      </div>
      <div style={{ 
        width: '50%', 
        height: '100%', 
        overflowY: 'auto' 
      }}>
        {videoClient && call ? (
          <StreamVideo client={videoClient}>
            <StreamCall call={call}>
              <VideoCallUI onLeaveCall={handleLeaveCall} />
            </StreamCall>
          </StreamVideo>
        ) : (
          <div>
            {loadingState === 'Ready' ? 'No active call.' : `Loading... ${loadingState}`}
            <button onClick={handleLeaveCall}>Return to Dashboard</button>
          </div>
        )}
      </div>
    </div>
  );
}

const VideoCallUI = ({ onLeaveCall }) => {
  return (
    <div className="stream-video-call-container">
      <SpeakerLayout />
      <CustomCallControls onLeaveCall={onLeaveCall} />
    </div>
  );
};

const CustomCallControls = ({ onLeaveCall }) => {
  return (
    <div style={{ position: 'absolute', bottom: '10px', left: '50%', transform: 'translateX(-50%)' }}>
      <CallControls
        onLeaveCall={onLeaveCall}
      />
    </div>
  );
};

export default ConsultationRoom;