import React, { useState, useRef, useEffect } from 'react';
import Navbar from '../Navbar/Navbar';
import Logo from '../../assets/mindlab.png';
import '../../style/UserGuide.css';

const UserGuide = () => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [isTextOverflowed, setIsTextOverflowed] = useState(false);

    const contentRef = useRef(null);

    useEffect(() => {
        const isOverflowed = contentRef.current.scrollHeight > contentRef.current.clientHeight;
        setIsTextOverflowed(isOverflowed);
    }, [isExpanded]);

    const handleExpand = () => {
        setIsExpanded(!isExpanded);
    };

    return (
        <div>
            <Navbar />
            <div className="guide-container">
                <div
                    className={`custom-box ${isExpanded ? 'expanded' : ''}`}
                    style={{
                        marginBottom: '20px',
                        width: '50%',
                        height: isExpanded ? 'auto' : '700px',
                        border: '1px solid #ccc', // Border color
                        borderRadius: '20px',
                        boxShadow: '0 0 10px rgba(0, 0, 0, 0.7), 0 4px 8px rgba(0, 0, 0, 0.4)',
                        overflowY: isExpanded ? 'visible' : 'hidden', // Ensure content doesn't overflow
                    }}
                >

                    <div style={{ textAlign: 'center', marginTop: '20px' }}>
                        <h2>
                            <b>User Guide</b>
                        </h2>
                    </div>
                    <div
                        ref={contentRef}
                        style={{ textAlign: 'left', marginTop: '20px', padding: '0 20px', maxHeight: isExpanded ? 'none' : '400px', overflow: 'hidden' }}
                    >



                        <ol>
                            <li>
                                <strong>Navigation Bar:</strong>
                                <ul>
                                    <li>Home</li>
                                    <li>Experiment</li>
                                    <li>Data</li>
                                </ul>
                            </li>

                            <li>
                                <strong>Home Page:</strong>
                                <p>The home page serves as the showcase for our platform, providing a comprehensive overview through a sidebar. Users can explore key aspects of the project, including details about the project itself, its associated benefits, a user guide, descriptions of different levels, a demonstration version, and contact information.</p>
                            </li>

                            <li>
                                <strong>Experiment:</strong>
                                <p>This section is organized as a dropdown menu, offering a structured approach to managing experiments:</p>

                                <ul>
                                    <li>
                                        <strong>Patient Info Form:</strong>
                                        <ul>
                                            <li>This feature enables doctors to input relevant patient information into a structured form, ensuring accuracy and completeness.</li>
                                        </ul>
                                    </li>

                                    <li>
                                        <strong>Experiment Settings:</strong>
                                        <ul>
                                            <li>Doctors have the flexibility to customize the experimental parameters, including session duration, attempt lengths, and the option to display experiment instructions on the experiment page.</li>
                                        </ul>
                                    </li>

                                    <li>
                                        <strong>Experiment:</strong>
                                        <ul>
                                            <li>This section is dedicated to the execution of the experiment, where patients undergo the prescribed test based on the parameters set in the experiment settings.</li>
                                        </ul>
                                    </li>

                                    <li>
                                        <strong>Results:</strong>
                                        <ul>
                                            <li>A comprehensive display of the latest experiment data, providing doctors with the ability to modify results by selectively deleting individual attempts.</li>
                                        </ul>
                                    </li>

                                    <li>
                                        <strong>Patient List:</strong>
                                        <ul>
                                            <li>Patient information is presented in the form of cards, offering doctors the capability to manage patient data. This includes the ability to delete a patient, modify their information, or access detailed experiment results.</li>
                                        </ul>
                                    </li>
                                </ul>
                            </li>

                            <li>
                                <strong>Data:</strong>
                                <p>The Data tab serves as a centralized repository for all experiment-related information, providing a sophisticated presentation:</p>

                                <ul>
                                    <li>
                                        <strong>Experiment Data Table:</strong>
                                        <ul>
                                            <li>A structured presentation of experiment data for all patients, facilitating easy reference and analysis.</li>
                                        </ul>
                                    </li>

                                    <li>
                                        <strong>Chart Representation:</strong>
                                        <ul>
                                            <li>The experiment data is not just displayed in a tabular format but is also visually represented in a chart. This graphical representation enhances data interpretation and provides a more intuitive understanding of trends and patterns.</li>
                                        </ul>
                                    </li>
                                </ul>
                            </li>
                        </ol>


                    </div>
                    {isTextOverflowed && !isExpanded && (
                        <div style={{ textAlign: 'center', marginTop: '20px' }}>
                            <button onClick={handleExpand}>Read More</button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UserGuide;
