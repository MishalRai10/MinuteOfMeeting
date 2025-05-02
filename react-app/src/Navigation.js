import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import logo from './media/logo.jpg';

function Navigation({ onLoginClick, onRegisterClick }) {
  const [isOpen, setIsOpen] = useState(false);

  // Common classes for all navigation items
  const navItemClasses = "text-white hover:text-[#ff7b02] transition-colors text-lg font-semibold py-2 px-4 rounded-lg hover:bg-[#ff7b02]/20 whitespace-nowrap";

  return (
    <nav className="fixed top-0 left-0 w-full h-14 bg-[#003347] z-50">
      <div className="container mx-auto flex justify-between items-center h-full px-6">
        <Link to="/" className="w-12">
          <img src={logo} alt="nav logo" className="object-cover object-center" />
        </Link>

        {/* Desktop Navigation - Now properly aligned in row */}
        <div className="hidden lg:flex items-center gap-4 h-full">
          <Link
            to="/profile"
            className={`${navItemClasses} h-full flex items-center no-underline`}
          >
            Profile
          </Link>
          <button
            onClick={onLoginClick}
            className={`${navItemClasses} h-full`}
          >
            Login
          </button>
          <button
            onClick={onRegisterClick}
            className={`${navItemClasses} h-full`}
          >
            Register
          </button>
        </div>

        {/* Mobile Menu Toggle */}
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="lg:hidden text-white p-2 hover:bg-[#ff7b02]/20 rounded-lg"
        >
          ☰
        </button>

        {/* Mobile Navigation - Stacked vertically */}
        {isOpen && (
          <div className="lg:hidden absolute top-full left-0 w-full bg-[#003347] shadow-lg">
            <div className="flex flex-col py-2">
              <Link
                to="/profile"
                onClick={() => setIsOpen(false)}
                className={`${navItemClasses} w-full text-left px-6 py-3 no-underline`}
              >
                Profile
              </Link>
              <button
                onClick={() => {
                  setIsOpen(false);
                  onLoginClick();
                }}
                className={`${navItemClasses} w-full text-left px-6 py-3`}
              >
                Login
              </button>
              <button
                onClick={() => {
                  setIsOpen(false);
                  onRegisterClick();
                }}
                className={`${navItemClasses} w-full text-left px-6 py-3`}
              >
                Register
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

Navigation.propTypes = {
  onLoginClick: PropTypes.func.isRequired,
  onRegisterClick: PropTypes.func.isRequired
};

export default Navigation;