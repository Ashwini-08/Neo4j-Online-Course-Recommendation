  import React, { useState } from 'react';
  import { forgotPassword } from '../services/api';
  import './ForgotPassword.css';

  const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    const handleForgotPassword = async (e) => {
      e.preventDefault();
      try {
        const response = await forgotPassword(email);
        setMessage(response.message);
      } catch (error) {
        setMessage('Error sending reset link. Please try again.');
      }
    };

    return (
      <div className="forgot-password">
        <h2>Forgot Password</h2>
        <form onSubmit={handleForgotPassword}>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button type="submit">Send Reset Link</button>
        </form>
        {message && <p>{message}</p>}
      </div>
    );
  };

  export default ForgotPassword;
