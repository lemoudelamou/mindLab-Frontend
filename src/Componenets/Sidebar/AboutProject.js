import React, { useState, useRef, useEffect } from 'react';
import Navbar from '../Navbar/Navbar';
import Logo from '../../assets/mindlab.png';
import '../../style/AboutProject.css';

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
            <div className="about-container">
                <div
                    className={`about-custom-box ${isExpanded ? 'expanded' : ''}`}
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
                                <h2>Demo Version Description</h2>
                                <p>
                                    Welcome to the demo version of our cutting-edge platform! This version is designed to provide
                                    you with a glimpse into the capabilities of our platform and to showcase the seamless integration of our experiment features. Please note that the data presented here is entirely fictional, utilizing dummy information for demonstration purposes only.
                                </p>
                            </li>
                            <li>
                                <h2>Key Features</h2>
                                <ol>
                                    <li>
                                        <h3>Experiment Testing</h3>
                                        <p>
                                            Explore the functionalities of our experiment feature through a simulated environment. Understand
                                            how our platform handles and processes data related to various experiments.
                                        </p>
                                    </li>
                                    <li>
                                        <h3>Intuitive Interface</h3>
                                        <p>
                                            Experience the user-friendly interface that our platform offers. Navigate through different
                                            sections effortlessly to get a sense of the smooth and efficient workflow.
                                        </p>
                                    </li>
                                    <li>
                                        <h3>Real-time Data Insights</h3>
                                        <p>
                                            Witness real-time insights into cognitive reactions. MindLab doesn't just collect data; it
                                            transforms raw information into meaningful visualizations, allowing researchers to interpret results on the fly and make informed decisions.                                        </p>
                                    </li>
                                </ol>
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
