import React, { useState } from 'react';
import { LogIn, UserPlus } from 'lucide-react';
import '../styles/loginDashboard.css';

const LoginDashboard = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    onLogin(username, password);
  };

  const handleRegister = () => {
    // Here you would typically navigate to a registration page or open a registration modal
    alert('Register functionality to be implemented');
  };

  const handleForgotPassword = (e) => {
    e.preventDefault();
    // Here you would typically navigate to a password reset page or open a reset password modal
    alert('Forgot password functionality to be implemented');
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1 className="login-title">X-Ray Image Interpretation System</h1>
        <div className="login-form">
          <div className="input-field">
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
            />
          </div>
          <div className="input-field">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
            />
          </div>
          <div className="button-group">
            <button className="register-button" onClick={handleRegister}>
              <UserPlus size={24} />
              <span>Register</span>
            </button>
            <button className="login-button" onClick={handleLogin}>
              <LogIn size={24} />
              <span>Login</span>
            </button>
          </div>
          <a href="#" className="forgot-password" onClick={handleForgotPassword}>forgot your password?</a>
        </div>
      </div>
    </div>
  );
};

export default LoginDashboard;