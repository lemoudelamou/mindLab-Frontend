import React, {useEffect, useRef, useState} from 'react';
import {FaBars, FaTimes} from 'react-icons/fa';
import {Link, useLocation} from 'react-router-dom';
import  secureLocalStorage  from  "react-secure-storage";
import QuitDemoButton from './QuitDemoButton';
import '../../style/Navbar.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Logo from '../../assets/mindlab.png';
import Home from '../../assets/home-w.png';
import Data from '../../assets/data-w.png';
import Flask from '../../assets/exp-w.png';


export default function Navbar({activeTab}) {
    const navRef = useRef();
    const dropdownRef = useRef();
    const [showDropdown, setShowDropdown] = useState(false);


    const location = useLocation();

    const isDemoMode = JSON.parse(secureLocalStorage.getItem('isDemoMode'));

// Check if the value exists
    if (isDemoMode !== null) {
        // The value exists in local storage, you can use it
        console.log('Retrieved value:', isDemoMode);
    } else {
        // The value doesn't exist in local storage
        console.log('Value not found in local storage');
    }


    const showNavbar = () => {
        try {
            navRef.current.classList.toggle('responsive_nav');
        } catch (error) {
            console.error('Error toggling navbar:', error);
        }
    };

    const toggleDropdown = (event) => {
        try {
            event.stopPropagation();
            setShowDropdown(!showDropdown);
        } catch (error) {
            console.error('Error toggling dropdown:', error);
        }
    };

    useEffect(() => {
        const handleClickOutsideDropdown = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                // Clicked outside the dropdown, close it
                setShowDropdown(false);
            }
        };

        // Add event listener when the component mounts
        document.addEventListener('click', handleClickOutsideDropdown);

        // Remove event listener when the component unmounts
        return () => {
            document.removeEventListener('click', handleClickOutsideDropdown);
        };
    }, []); // Empty dependency array means this effect runs once when the component mounts



    console.log('isDemoMode:', isDemoMode);


    return (
        <div className="navbar-wrapper">

            <header>
                <div className="logo-div">
                    <img className="logo" src={Logo} alt="Logo"/>
                    {isDemoMode &&
                        <div style={{paddingLeft: '50px'}}>
                            <QuitDemoButton/>
                        </div>
                    }
                </div>

                <nav ref={navRef}>

                    <div className="nav-item">
                        <img className="home-tab" src={Home} alt="Home"/>
                        <Link to={isDemoMode ? "/demoHome" : "/home"} className={activeTab === 'home' ? 'active' : ''}>
                            Home
                        </Link>
                    </div>

                    <div className="separator"></div>


                        <div
                            className={`nav-item dropdown`}
                            onClick={toggleDropdown}
                            ref={dropdownRef}
                        >
                            <div className={`nav-item-content custom-dropdown-menu ${showDropdown ? 'show' : ''}`}>
                                <img className="experiment-tab" src={Flask} alt="Experiment" />
                                <a className={  activeTab === 'experiment' ? 'active' : ''}  style={{paddingLeft:'0'}}>
                                    Experiment
                                </a>
                                <div className={`dropdown-menu ${showDropdown ? 'show' : ''}`}>
                                    <div className='dropdown-list'>
                                        <Link to={isDemoMode ? "/demo-patient-info" : "/patient-info"} className="dropdown-item">
                                            Patient Info
                                        </Link>
                                        <Link to={isDemoMode ? "/demo-settings" : "/settings"} className="dropdown-item">
                                            Experiment Settings
                                        </Link>
                                        <Link to={isDemoMode ? "/demo-experiment" : "/reactionTimeExperiment"} className="dropdown-item">
                                            Experiment
                                        </Link>
                                        <Link to={isDemoMode ? "/demo-results" : "/results"} className="dropdown-item">
                                            Results
                                        </Link>
                                        <Link to={isDemoMode ? "/demo-patientList" : "/patientList"} className="dropdown-item">
                                            Patient List
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>

                    <div className="separator"></div>

                    <div className="nav-item">
                        <img className="data-tab" src={Data} alt="data"/>
                        <Link to={isDemoMode ? "/demo-data" : "/data"} className={activeTab === 'Data' ? 'active' : ''}>
                            Data
                        </Link>
                    </div>



                    <button className="nav-btn nav-close-btn" onClick={showNavbar}>
                        <FaTimes/>
                    </button>
                </nav>

                <button className="nav-btn" onClick={showNavbar}>
                    <FaBars/>
                </button>


            </header>
        </div>
    );
}
