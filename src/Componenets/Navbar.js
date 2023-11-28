

import React, { useRef, useState } from 'react';
import { FaBars, FaTimes } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import '../style/Navbar.css';
import Logo from '../assets/mindlab.png';
import Home from '../assets/home.png';
import Data from '../assets/data.png';
import Flask from '../assets/flask.png';


export default function Navbar({ activeTab, handleTabClick }) {
  const navRef = useRef();
  const [showDropdown, setShowDropdown] = useState(false);

  const showNavbar = () => {
    try {
      navRef.current.classList.toggle('responsive_nav');
    } catch (error) {
      console.error('Error toggling navbar:', error);
    }
  };

  const toggleDropdown = () => {
    try {
      setShowDropdown(!showDropdown);
    } catch (error) {
      console.error('Error toggling dropdown:', error);
    }
  };

  return (
    <div className="navbar-wrapper">

    <header > 
      <div className="logo-div">
      <img className="logo" src={Logo} alt="Logo" />
      </div>
      <nav ref={navRef}>
      <div className="nav-item">
  <img className="home-tab" src={Home} alt="Home" />
  <Link to="/Home" className={activeTab === 'home' ? 'active' : ''}>
    Home
  </Link>
</div>
<div className="nav-item dropdown">
  <div
    className={`nav-item-content custom-dropdown-menu ${showDropdown ? 'show' : ''}`}
    onMouseEnter={toggleDropdown}
    onMouseLeave={toggleDropdown}
  >
    <img className="experiment-tab" src={Flask} alt="Experiment" />
    <a className={activeTab === 'experiment' ? 'active' : ''} href="#dropdown">
      Experiment
    </a>
    <div className={`dropdown-menu ${showDropdown ? 'show' : ''}`}>

    <Link to="/patient-info" className="dropdown-item">
        Patient Info
      </Link>

      <li><hr className="dropdown-divider"/></li>

      <Link to="/settings" className="dropdown-item">
        Experiment Settings
      </Link>

      <li><hr className="dropdown-divider"/></li>


      <Link to="/ReactiontimeExperiment" className="dropdown-item">
        Reaction time
      </Link>

      
      <li><hr className="dropdown-divider"/></li>

      <Link to="/Results" className="dropdown-item">
        Results
      </Link>
      
     
    </div>
  </div>
</div>
        {/* Add similar Bootstrap dropdowns for other menu items */}
        <div className="nav-item">
          <img className="data-tab" src={Data} alt="data" />
          <Link to="/Data" className={activeTab === 'Data' ? 'active' : ''}>
            Data
          </Link>
        </div>
       
        
        <button className="nav-btn nav-close-btn" onClick={showNavbar}>
          <FaTimes />
        </button>
      </nav>
      <button className="nav-btn" onClick={showNavbar}>
        <FaBars />
      </button>
    </header>
    </div>
  );
}
