import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navigation from './Navigation';
import Login from './components/Login';
import Register from './components/Register';
import { Toaster } from 'react-hot-toast';
import Profile from './components/Profile';
import HomeLayout from './components/HomeLayout';

function App() {
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  const handleLoginClick = () => {
    setShowLogin(true);
  };

  const handleRegisterClick = () => {
    setShowRegister(true);
  };

  return (
    <div className="relative">
      <Navigation
        onLoginClick={handleLoginClick}
        onRegisterClick={handleRegisterClick}
      />

      {/* Login Modal */}
      {showLogin && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 w-full max-w-md relative">
            <button
              onClick={() => setShowLogin(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
            <Login
              onClose={() => setShowLogin(false)}
              showRegister={() => {
                setShowLogin(false);
                setShowRegister(true);
              }}
            />
          </div>
        </div>
      )}

      {/* Register Modal */}
      {showRegister && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 w-full max-w-md relative">
            <button
              onClick={() => setShowRegister(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
            <Register
              onClose={() => setShowRegister(false)}
              showLogin={() => {
                setShowRegister(false);
                setShowLogin(true);
              }}
            />
          </div>
        </div>
      )}

      <Routes>
        <Route path="/" element={<HomeLayout />}>
        </Route>
        <Route
          path="/profile"
          element={<Profile onLoginClick={handleLoginClick} />}
        />
      </Routes>
      <Toaster />
    </div>
  );
}

export default App;