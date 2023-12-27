import React from 'react';
import { House, Heart, Speedometer2, Info, Window, Postcard } from 'react-bootstrap-icons';
import '../../style/Menubar.css';
import { Tooltip as ReactTooltip } from 'react-tooltip'
import { Link } from "react-router-dom";

const MenuBar = ({ currentMode }) => {
    return (
        <div className="flex-column menu-bar">
            <ReactTooltip place="right" effect="solid" />

            <div style={{ marginTop: '100px' }}>
                <Link to="/about" className="menu-link" data-bs-toggle="tooltip" data-bs-placement="right" data-bs-trigger="hover" data-bs-delay='{"show": 1000, "hide": 250}' title="About the Project">
                    <House size={20} className="me-2" />
                    <span className="menu-text" data-tip="About the Project">
                        About the Project
                    </span>
                </Link>
                <Link to="/benefits" className="menu-link" data-bs-toggle="tooltip" data-bs-placement="right" data-bs-trigger="hover" data-bs-delay='{"show": 1000, "hide": 250}' title="Benefits">
                    <Heart size={20} className="me-2" />
                    <span className="menu-text" data-tip="Benefits">
                        Benefits
                    </span>
                </Link>
                <Link to="/userGuide" className="menu-link" data-bs-toggle="tooltip" data-bs-placement="right" data-bs-trigger="hover" data-bs-delay='{"show": 1000, "hide": 250}' title="User Guide">
                    <Speedometer2 size={20} className="me-2" />
                    <span className="menu-text" data-tip="User Guide">
                        User Guide
                    </span>
                </Link>

                <Link to="/levelsDescription" className="menu-link" data-bs-toggle="tooltip" data-bs-placement="right" data-bs-trigger="hover" data-bs-delay='{"show": 1000, "hide": 250}' title="Levels Description">
                    <Info size={20} className="me-2" />
                    <span className="menu-text" data-tip="Levels Description">
                        Levels Description
                    </span>
                </Link>
                {currentMode === false && (
                    <Link to="/demo-version" className="menu-link" data-bs-toggle="tooltip" data-bs-placement="right" data-bs-trigger="hover" data-bs-delay='{"show": 1000, "hide": 250}' title="Demo version">
                        <Window size={20} className="me-2" />
                        <span className="menu-text" data-tip="Demo Version">
                            Demo Version
                        </span>
                    </Link>
                )}
                <Link to="/contact" className="menu-link" data-bs-toggle="tooltip" data-bs-placement="right" data-bs-trigger="hover" data-bs-delay='{"show": 1000, "hide": 250}' title="Contact">
                    <Postcard size={20} className="me-2" />
                    <span className="menu-text" data-tip="Contact">
                        Contact
                    </span>
                </Link>
            </div>
        </div>
    );
};

export default MenuBar;
