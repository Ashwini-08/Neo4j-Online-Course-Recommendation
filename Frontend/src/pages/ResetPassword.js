import React, { useState } from 'react';
import './ResetPassword.css'; // Add styles here if needed

const ResetPassword = () => {
  const [formData, setFormData] = useState({
    token: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError(''); // Clear errors on input change
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { token, newPassword, confirmPassword } = formData;

    // Basic validation
    if (!token || !newPassword || !confirmPassword) {
      setError('All fields are required.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    // Call your API to reset password (replace this mock logic)
    console.log('Reset Password Data:', formData);
    setSuccess(true);
  };

  return (
    <div className="reset-password-container">
      <h2>Reset Password</h2>
      {error && <div className="error-message">{error}</div>}
      {success ? (
        <div className="success-message">Password reset successfully!</div>
      ) : (
        <form onSubmit={handleSubmit} className="reset-password-form">
          <div className="form-group">
            <label htmlFor="token">Token</label>
            <input
              type="text"
              id="token"
              name="token"
              value={formData.token}
              onChange={handleChange}
              placeholder="Enter your reset token"
            />
          </div>
          <div className="form-group">
            <label htmlFor="newPassword">New Password</label>
            <input
              type="password"
              id="newPassword"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              placeholder="Enter your new password"
            />
          </div>
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm your new password"
            />
          </div>
          <button type="submit" className="reset-password-button">
            Reset Password
          </button>
        </form>
      )}
    </div>
  );
};

export default ResetPassword;
