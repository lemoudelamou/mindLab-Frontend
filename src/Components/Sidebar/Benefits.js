import React from 'react';
import Navbar from '../Navbar/Navbar';
import '../../style/Benefits.css';

const Benefits = () => {


    return (
        <div>
            <Navbar />
            <div className="benef-container">
                <div
                    className="benef-custom-box"
                    style={{
                        marginBottom: '20px',
                        width: '50%',
                        border: '1px solid #ccc', // Border color
                        borderRadius: '20px',
                        boxShadow: '0 0 10px rgba(0, 0, 0, 0.7), 0 4px 8px rgba(0, 0, 0, 0.4)',
                    }}
                >

                    <div style={{ textAlign: 'center', marginTop: '20px' }}>
                        <h2 className="benef-custom-box-title">
                            <b>Benefits</b>
                        </h2>
                    </div>
                    <div
                        style={{ textAlign: 'left', marginTop: '20px', padding: '0 20px', maxHeight: '200px', overflow: 'hidden' }}
                    >

                        <ul>
                            <li><b>Modularity:</b> Customize tests to specific research goals or clinical needs.</li>
                            <li><b>Data Integrity:</b> Ensure accurate and reliable data collection for qualitative analyses.</li>
                            <li><b>User-Friendliness:</b> Enjoy an intuitive user interface that requires no technical expertise.
                            </li>
                            <li><b>Privacy:</b> Ensure the protection and confidentiality of sensitive information with our
                                robust security protocols.</li>
                        </ul>


                    </div>

                </div>
            </div>
        </div>
    );
};

export default Benefits;
