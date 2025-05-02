import React, { useState } from 'react';

const EmailPopup = ({ onClose, onSend, minutesText }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSend = async () => {
    if (!email.trim()) {
      setError('Please enter an email address.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await onSend(email, minutesText);
      alert('Email sent successfully!');
      onClose(); // Close the popup after sending
    } catch (err) {
      setError('Failed to send email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
      <div className="bg-white rounded-lg p-6 shadow-lg">
        <h2 className="text-lg font-semibold mb-4">Send Meeting Minutes</h2>
        {error && <p className="text-red-500">{error}</p>}
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter email address"
          className="border border-gray-300 rounded-lg p-2 w-full mb-4"
        />
        <button
          onClick={handleSend}
          disabled={loading}
          className="bg-blue-600 text-white rounded-lg py-2 px-4"
        >
          {loading ? 'Sending...' : 'Send Email'}
        </button>
        <button onClick={onClose} className="mt-2 text-gray-600">
          Cancel
        </button>
      </div>
    </div>
  );
};

export default EmailPopup;