import React, { useState } from 'react';
import { register } from '../services/api';

const Register = ({ onClose, showLogin }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        try {
            await register(username, password);
            onClose(); // Close modal on success
            showLogin(); // Switch to login modal
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Create Account</h2>
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
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                >
                    Create Account
                </button>
            </form>
            <p className="text-center text-sm text-gray-600">
                Already have an account?{' '}
                <button
                    onClick={() => {
                        onClose();
                        showLogin();
                    }}
                    className="text-blue-600 hover:underline focus:outline-none"
                >
                    Login here
                </button>
            </p>
        </div>
    );
};

export default Register;