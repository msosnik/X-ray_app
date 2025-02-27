import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { LogIn, UserPlus, Download } from 'lucide-react';
import '../styles/loginDashboard.css';

const LoginDashboard = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    setError('');
    setIsLoading(true);

    const loginRequest = {
      email: email,
      password: password
    };

    try {
      const loginResponse = await fetch('http://localhost:8080/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(loginRequest)
      });

      if (!loginResponse.ok) {
        const errorText = await loginResponse.text();
        throw new Error(errorText || 'Login failed');
      }

      const loginResponseText = await loginResponse.text();

      console.log(loginResponseText);
      const roleMatch = loginResponseText.match(/Login successful for user: ([A-Z]+)(\d+)/);

      const role = roleMatch[1].toLowerCase();
      const userId = parseInt(roleMatch[2]);

      if (loginResponseText.includes('Login successful')) {
        const endpoint = role === 'patient' ? 'patient' : 'doctor';

        const usersResponse = await fetch(`http://localhost:8080/${endpoint}/`);
      
        if (!usersResponse.ok) {
          throw new Error(`Failed to fetch ${endpoint} information`);
        }

        const users = await usersResponse.json();
        const currentUser = users.find(user => user.email === email);

        if (currentUser) {
          onLogin(email, password, role, {
            ...currentUser,
            id: userId
          });          
          switch(role) {
            case 'patient':
              window.location.href = '/patient-dashboard';
              break;
            case 'doctor':
              window.location.href = '/doctor-dashboard';
              break;
            default:
              window.location.href = '/dashboard';
          }
        } else {
          setError('User information not found');
        }
      } else {
        setError('Login failed. Please check your credentials.');
      }
    } catch (err) {
      console.error('Detailed error:', err);
      setError(err.message || 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = () => {
    navigate('/register');
  };

  const handleForgotPassword = (e) => {
    e.preventDefault();
    alert('Forgot password functionality to be implemented');
  };

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      const response = await fetch('http://localhost:8080/xray-images/files/consented', {
        method: 'GET',
        headers: {
          'accept': '*/*'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to download files');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');

      a.href = url;
      a.download = 'consented-images.zip';

      document.body.appendChild(a);
      a.click();
      
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

    } catch (err) {
      console.error('Download error:', err);
      setError('Failed to download files. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1 className="login-title">X-Ray Image Interpretation System</h1>
        {error && (
          <div className="error-message" style={{ color: 'red', marginBottom: '15px' }}>
            {error}
          </div>
        )}
        <div className="login-form">
          <div className="input-field">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              disabled={isLoading}
            />
          </div>
          <div className="input-field">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              disabled={isLoading}
            />
          </div>
          <div className="button-group">
            <button 
              className="download-button" 
              onClick={handleDownload}
              disabled={isDownloading}
            >
              <span className="button-content">
                <span className="button-text">Download</span>
                <Download size={24} />
              </span>
            </button>
            <button 
              className="register-button" 
              onClick={handleRegister}
              disabled={isLoading}
            >
              <span className="button-content">
                <span className="button-text">Register</span>
                <UserPlus size={24} />
              </span>
            </button>
            <button 
              className="login-button" 
              onClick={handleLogin}
              disabled={isLoading}
            >
              {isLoading ? 'Logging in...' : (
                <span className="button-content">
                  <span className="button-text">Login</span>
                  <LogIn size={24} />
                </span>
              )}
            </button>
          </div>
          <a 
            href="#" 
            className="forgot-password" 
            onClick={handleForgotPassword}
            style={{ pointerEvents: isLoading ? 'none' : 'auto' }}
          >
            forgot your password?
          </a>
        </div>
      </div>
    </div>
  );
};

LoginDashboard.propTypes = {
  onLogin: PropTypes.func.isRequired
};

export default LoginDashboard;