import React from 'react';
import './Navbar.css';

const Navbar = ({ activeSection, onSectionChange }) => {
  return (
    <div className="navbar-container">
      <nav className="navbar">
        <div className="navbar-content">
          {/* Logo Section */}
          <div className="logo-section">
            <div className="portal-text">
              <span>Mapping of Guthi and other lands affected by</span>
              <span></span>
            <div className="logo-text">Fast Track Expressway Project</div>
            </div>
          </div>
          
          {/* Navigation Buttons */}
          <div className="nav-buttons">
            <button 
              className={`nav-button ${activeSection === 'MAP' ? 'active' : ''}`}
              onClick={() => onSectionChange('MAP')}
            >
              MAP
            </button>
            <button 
              className={`nav-button ${activeSection === 'ABOUT' ? 'active' : ''}`}
              onClick={() => onSectionChange('ABOUT')}
            >
              ABOUT
            </button>
          </div>
        </div>
      </nav>
      <div className="navbar-line"></div>
    </div>
  );
};

export default Navbar;