import React from 'react';
import './Navbar.css';

const Navbar = ({ activeSection, onSectionChange }) => {
  return (
    <div className="navbar-container">
      <nav className="navbar">
        <div className="navbar-content">
          {/* Logo Section */}
          <div className="logo-section">
            <div className="logo-text">CEMSOJ</div>
            <div className="portal-text">
              <span>LAND</span>
              <span>MAPPING</span>
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
              className={`nav-button ${activeSection === 'DATASETS' ? 'active' : ''}`}
              onClick={() => onSectionChange('DATASETS')}
            >
              DATASETS
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