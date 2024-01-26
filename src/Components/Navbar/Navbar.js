import React, { useEffect, useRef, useState } from 'react';
import { FaBars, FaTimes } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import secureLocalStorage from 'react-secure-storage';
import QuitDemoButton from './QuitDemoButton';
import '../../style/Navbar.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Logo from '../../assets/mindlab.png';
import Home from '../../assets/home-w.png';
import Data from '../../assets/data-w.png';
import Flask from '../../assets/exp-w.png';
import { useAuth } from '../../utils/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt, faSignInAlt, faUserPlus, faAngleDown } from '@fortawesome/free-solid-svg-icons';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from '@mui/material';

export default function Navbar({ activeTab }) {
    const navRef = useRef();
    const dropdownRef = useRef();
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRefUser = useRef();
    const [showDropdownUser, setShowDropdownUser] = useState(false);

    const { logOut, isLoggedIn } = useAuth();
    const navigate = useNavigate();
    const isDemoMode = JSON.parse(secureLocalStorage.getItem('isDemoMode'));
    const [showLoginDialog, setShowLoginDialog] = useState(false);

    const handleLoginDialogClose = () => {
        setShowLoginDialog(false);
    };

    const handleLoginDialogOpen = () => {
        setShowLoginDialog(true);
    };

    const handleLogin = () => {
        handleLoginDialogClose();
        navigate('/login');
    };

    const handleRegister = () => {
        handleLoginDialogClose();
        navigate('/register');
    };

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

    const toggleDropdownUser = (event) => {
        try {
            event.stopPropagation();
            setShowDropdownUser(!showDropdownUser);
            setShowDropdown(false); // Close the experiment dropdown if open
        } catch (error) {
            console.error('Error toggling User dropdown:', error);
        }
    };

    useEffect(() => {
        const handleClickOutsideDropdown = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        };

        const handleClickOutsideDropdownUser = (event) => {
            if (dropdownRefUser.current && !dropdownRefUser.current.contains(event.target)) {
                setShowDropdownUser(false);
            }
        };

        document.addEventListener('click', handleClickOutsideDropdown);
        document.addEventListener('click', handleClickOutsideDropdownUser);

        return () => {
            document.removeEventListener('click', handleClickOutsideDropdown);
            document.removeEventListener('click', handleClickOutsideDropdownUser);
        };
    }, []);

    return (
        <div className="navbar-wrapper">
            <header>
                <div className="logo-div">
                    <img className="logo" src={Logo} alt="Logo" />
                    {isDemoMode && (
                        <div style={{ paddingLeft: '50px' }}>
                            <QuitDemoButton />
                        </div>
                    )}
                </div>

                <nav ref={navRef}>
                    <div className="links">
                        <div className="nav-item">
                            <img className="home-tab" src={Home} alt="Home" />
                            <Link to={isDemoMode ? '/demoHome' : '/home'} className={activeTab === 'home' ? 'active' : ''}>
                                Home
                            </Link>
                        </div>

                        <div className="separator"></div>

                        <div
                            className={`nav-item dropdown`}
                            onClick={(event) => {
                                toggleDropdown(event);
                            }}
                            ref={dropdownRef}
                        >
                            <div className={`nav-item-content custom-dropdown-menu ${showDropdown ? 'show' : ''}`}>
                                <img className="experiment-tab" src={Flask} alt="Experiment" />
                                <Link
                                    to="#"
                                    className={activeTab === 'experiment' ? 'active' : ''}
                                    style={{ paddingLeft: '0', position: 'relative' }}
                                >
                                    Experiment
                                </Link>
                                <div className={`dropdown-menu ${showDropdown ? 'show' : ''}`} style={{ top: '100%', position: 'absolute' }}>
                                    <div className="dropdown-list">
                                        <Link
                                            to={(!isLoggedIn && !isDemoMode) ? '#' : (isDemoMode ? '/demo-patient-info' : '/patient-info')}
                                            className={`dropdown-item ${(!isLoggedIn && !isDemoMode) }`}
                                            onClick={(e) => {
                                                if (!isLoggedIn && !isDemoMode) {
                                                    e.preventDefault();
                                                    handleLoginDialogOpen();
                                                }
                                            }}
                                        >
                                            Patient Info
                                        </Link>
                                        <Link
                                            to={isDemoMode ? '/demo-settings' : '/settings'}
                                            className="dropdown-item"
                                            onClick={(e) => {
                                                if (!isLoggedIn && !isDemoMode) {
                                                    e.preventDefault();
                                                    handleLoginDialogOpen();
                                                }
                                            }}
                                        >
                                            Experiment Settings
                                        </Link>
                                        <Link
                                            to={isDemoMode ? '/demo-experiment' : '/reactionTimeExperiment'}
                                            className="dropdown-item"
                                            onClick={(e) => {
                                                if (!isLoggedIn && !isDemoMode) {
                                                    e.preventDefault();
                                                    handleLoginDialogOpen();
                                                }
                                            }}
                                        >
                                            Experiment
                                        </Link>
                                        <Link
                                            to={isDemoMode ? '/demo-results' : '/results'}
                                            className="dropdown-item"
                                            onClick={(e) => {
                                                if (!isLoggedIn && !isDemoMode) {
                                                    e.preventDefault();
                                                    handleLoginDialogOpen();
                                                }
                                            }}
                                        >
                                            Results
                                        </Link>
                                        <Link
                                            to={isDemoMode ? '/demo-patientList' : '/patientList'}
                                            className="dropdown-item"
                                            onClick={(e) => {
                                                if (!isLoggedIn && !isDemoMode) {
                                                    e.preventDefault();
                                                    handleLoginDialogOpen();
                                                }
                                            }}
                                        >
                                            Patient List
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="separator"></div>

                        <div className="nav-item">
                            <img className="data-tab" src={Data} alt="data" />
                            <Link to={isDemoMode ? '/demo-data' : '/data'} className={activeTab === 'Data' ? 'active' : ''}>
                                Data
                            </Link>
                        </div>
                    </div>

                    {/* Login and Register buttons */}
                    {!isDemoMode && (
                        <div>
                            {!isLoggedIn ? (
                                <div className="login-link" >
                                    <div className="separator"></div>

                                    <FontAwesomeIcon icon={faSignInAlt} style={{ marginRight: '5px' }} />

                                    <Link to="/login" className="login" >
                                        Sign In
                                    </Link>
                                    <div className="separator"></div>

                                    <FontAwesomeIcon icon={faUserPlus} style={{ marginRight: '5px' }} />
                                    <Link to="/register" className="register-link" >
                                        Sign up
                                    </Link>
                                </div>
                            ) : (
                                <div className={`nav-item dropdown`} onClick={toggleDropdownUser} ref={dropdownRefUser}>
                                    <div className={`logout-link nav-item-content custom-dropdown-menu ${showDropdownUser ? 'show' : ''}`}>
                                        <span
                                            style={{ marginRight: '10px', fontSize: '14pt', cursor: 'pointer' }}
                                            onClick={toggleDropdownUser}
                                        >
                                            <FontAwesomeIcon icon={faAngleDown} style={{ marginLeft: '5px' }} />
                                        </span>
                                        <div className={`user-drop dropdown-menu ${showDropdownUser ? 'show' : ''}`}>
                                            <div className="dropdown-list" >
                                                <Link to="/dashboard" className="dropdown-item">
                                                    Dashboard
                                                </Link>
                                                <Link onClick={logOut} className="dropdown-item">
                                                    Sign out
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    <button className="nav-btn nav-close-btn" onClick={showNavbar}>
                        <FaTimes />
                    </button>
                </nav>

                <button className="nav-btn" onClick={showNavbar}>
                    <FaBars />
                </button>
            </header>

            {/* Login Dialog */}
            <Dialog open={showLoginDialog} onClose={handleLoginDialogClose}>
                <DialogTitle style={{color: "white", backgroundColor: "rgb(128,128,128,0.7)"}}>Sign in/Sign up Required</DialogTitle>
                <DialogContent sx={{ padding: "16px", display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <Typography variant="body1" color="textSecondary" fullWidth maxWidth="xs" style={{ paddingTop: "20px"}}>
                        You need to be logged in to access this feature. If you don't have an account, please sign up.
                    </Typography>
                </DialogContent>
                <DialogActions sx={{ borderTop: `1px solid black`, padding: "16px", justifyContent: "flex-end" }}>
                    <Button onClick={handleLoginDialogClose} color="secondary">
                        Cancel
                    </Button>
                    <Button onClick={handleLogin} color="primary" variant="contained">
                        Sign in
                    </Button>
                    <Button onClick={handleRegister} color="primary" variant="contained">
                        Sign Up
                    </Button>
                </DialogActions>
            </Dialog>

        </div>
    );
}
