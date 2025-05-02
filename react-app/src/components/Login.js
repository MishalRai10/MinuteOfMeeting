import React, { useState } from 'react';
import { login } from '../services/api';
import { toast } from 'react-hot-toast';

const Login = ({ onClose, showRegister }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const response = await login(username, password);
      sessionStorage.setItem('token', response.access_token);
      toast.success("Login successful!");
      onClose();
    } catch (error) {
      console.error("Login failed:", error);
      setError('Login failed. Please check your credentials.');
      toast.error("Login failed. Please check your credentials.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Welcome Back</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>
        <div>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Signing in...' : 'Sign In'}
        </button>
      </form>
      <p className="text-center text-sm text-gray-600">
        Don't have an account?{' '}
        <button
          onClick={showRegister}
          className="text-blue-600 hover:underline focus:outline-none"
        >
          Register here
        </button>
      </p>
    </div>
  );
};

export default Login;