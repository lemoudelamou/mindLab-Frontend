import React, {useEffect, useRef, useState} from 'react';
import Navbar from '../Navbar/Navbar';
import '../../style/DemoVersion.css';

const DemoVersion = () => {
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
            <div className="demo-menu-container">
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
                            <b>Demo version</b>
                        </h2>
                    </div>
                    <div
                        ref={contentRef}
                        style={{ textAlign: 'left', marginTop: '20px', padding: '0 20px', maxHeight: isExpanded ? 'none' : '400px', overflow: 'hidden' }}
                    >

                        <p className="demo-text">Welcome to the demo version of our cutting-edge platform! This version is designed to provide you with a glimpse into the capabilities of our platform and to showcase the seamless integration of our experiment features. Please note that the data presented here is entirely fictional, utilizing dummy information for demonstration purposes only.</p>

                        <h3>Key Features:</h3>

                        <ol>
                            <li><strong>Experiment Testing:</strong> Explore the functionalities of our experiment feature through a simulated environment. Understand how our platform handles and processes data related to various experiments.</li>
                            <li><strong>Intuitive Interface:</strong> Experience the user-friendly interface that our platform offers. Navigate through different sections effortlessly to get a sense of the smooth and efficient workflow.</li>
                            <li><strong>Data Visualization:</strong> Interact with visually appealing and informative representations of experiment results. Our platform provides clear and concise visualizations to help you understand and interpret data effortlessly.</li>
                            <li><strong>Search and Filter:</strong> Test the search and filter capabilities of our platform, allowing you to efficiently locate specific information within the system. Easily tailor the data to meet your specific needs.</li>
                        </ol>

                        <h3>Why Use the Demo Version?</h3>

                        <ul>
                            <li><strong>Platform Overview:</strong> Get a comprehensive overview of our platform's structure, layout, and user interface.</li>
                            <li><strong>Experiment Simulation:</strong> Witness how our platform manages and processes experiment-related data, providing you with insights into its powerful capabilities.</li>
                            <li><strong>User Testing:</strong> Take the opportunity to test the platform's usability and functionality, providing valuable feedback for enhancements.</li>
                            <li><strong>Decision-Making Support:</strong> Even in this demo version, grasp how our platform can potentially support informed decision-making through organized and accessible data.</li>
                        </ul>

                        <p className="demo-text" style={{paddingTop: '25px'}}>Please keep in mind that the data used in this demo is entirely fictitious and is for illustrative purposes only. For a more personalized experience and to explore the full potential of our platform, contact our team to discuss a tailored solution that aligns with your specific requirements.</p>

                        <p className="demo-text" style={{paddingBottom: '25px'}}>Thank you for choosing our demo version. We look forward to hearing your feedback and assisting you on your journey with our innovative platform.</p>

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

export default DemoVersion;
