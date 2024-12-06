import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { LogIn, UserPlus, ChevronDown } from 'lucide-react';
import '../styles/loginDashboard.css';

const LoginDashboard = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState('patient');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    // onLogin(username, password, selectedRole);
    setError('');
    setIsLoading(true);

    // Prepare login request
    const loginRequest = {
      email: username,
      password: password
    };

    try {
      const response = await fetch('http://localhost:8080/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(loginRequest)
      });

      // Parse response
      const data = await response.json();

      console.log('Full response:', response);
      console.log('Response data:', data);

      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);

      // Check response status
      if (response.ok && data.token) {
        // Successful login
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('userRole', selectedRole);
        
        // Redirect based on role or update app state
        switch(selectedRole) {
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
        // Handle login error
        setError(data.message || 'Login failed. Please check your credentials.');
      }
    } catch (err) {
      // Network or other errors
      console.error('Detailed error:', err);
      setError(err.message || 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = () => {
    alert('Register functionality to be implemented');
  };

  const handleForgotPassword = (e) => {
    e.preventDefault();
    alert('Forgot password functionality to be implemented');
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
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
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
          <div className="input-field role-selection">
            <label htmlFor="roleSelect">Role:</label>
            <select 
              id="roleSelect" 
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="role-select"
              disabled={isLoading}
            >
              <option value="patient">Patient</option>
              <option value="doctor">Doctor</option>
            </select>
          </div>
          <div className="button-group">
            <button 
              className="register-button" 
              onClick={handleRegister}
              disabled={isLoading}
            >
              <UserPlus size={24} />
              <span>Register</span>
            </button>
            <button 
              className="login-button" 
              onClick={handleLogin}
              disabled={isLoading}
            >
              {isLoading ? 'Logging in...' : (
                <>
                  <LogIn size={24} />
                  <span>Login</span>
                </>
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
  onLogin: PropTypes.func
};

export default LoginDashboard;