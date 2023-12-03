import React from 'react';
import { Nav } from 'react-bootstrap';
import { House, Heart, Speedometer2, Info, Window } from 'react-bootstrap-icons';
import '../style/Menubar.css';
import { Tooltip as ReactTooltip } from 'react-tooltip'

const MenuBar = ({ currentMode }) => {
    return (
        <div className="flex-column menu-bar">
            <ReactTooltip place="right" effect="solid" />

            <Nav>
                <div style={{ marginTop: '100px' }}>
                    <Nav.Link href="#about-project" className="menu-link" data-bs-toggle="tooltip" data-bs-placement="right" data-bs-trigger="hover" data-bs-delay='{"show": 1000, "hide": 250}' title="About the Project">
                        <House size={20} className="me-2" />
                        <span className="menu-text" data-tip="About the Project">
                            About the Project
                        </span>
                    </Nav.Link>
                    <Nav.Link href="#benefits" className="menu-link" data-bs-toggle="tooltip" data-bs-placement="right" data-bs-trigger="hover" data-bs-delay='{"show": 1000, "hide": 250}' title="Benefits">
                        <Heart size={20} className="me-2" />
                        <span className="menu-text" data-tip="Benefits">
                            Benefits
                        </span>
                    </Nav.Link>
                    <Nav.Link href="#experiment-settings" className="menu-link" data-bs-toggle="tooltip" data-bs-placement="right" data-bs-trigger="hover" data-bs-delay='{"show": 1000, "hide": 250}' title="Experiment Settings">
                        <Speedometer2 size={20} className="me-2" />
                        <span className="menu-text" data-tip="Experiment Settings">
                            Experiment Settings
                        </span>
                    </Nav.Link>
                    <Nav.Link href="#experiment-information" className="menu-link" data-bs-toggle="tooltip" data-bs-placement="right" data-bs-trigger="hover" data-bs-delay='{"show": 1000, "hide": 250}' title="About the Project">
                        <Info size={20} className="me-2" />
                        <span className="menu-text" data-tip="Experiment Information">
                            Experiment Information
                        </span>
                    </Nav.Link>
                    {currentMode === false && (
                        <Nav.Link href="#demo-version" className="menu-link" data-bs-toggle="tooltip" data-bs-placement="right" data-bs-trigger="hover" data-bs-delay='{"show": 1000, "hide": 250}' title="Demo version">
                            <Window size={20} className="me-2" />
                            <span className="menu-text" data-tip="Demo Version">
                                Demo Version
                            </span>
                        </Nav.Link>
                    )}
                </div>
            </Nav>
        </div>
    );
};

export default MenuBar;
