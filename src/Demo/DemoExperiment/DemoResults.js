import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import "../../style/Results.css";
import { calculateAge } from "../../utils/ExperimentUtils";
import Navbar from "../../Componenets/Navbar/Navbar";

const DemoResults = () => {
    const location = useLocation();
    const resultData = location.state ? location.state.resultData : null;
    const experimentId = location.state ? location.state.experimentId : null;

    console.log('results:', resultData);

    if (!resultData || Object.keys(resultData).length === 0) {
        return (
            <div>
                <Navbar />
                <p className="no-results-message">No results available.</p>
            </div>
        );
    }

    return (
        <div className="results-container">
            <Navbar />

            <div className="pad-container">
                <h2>Experiment Results</h2>

                {/* Display patient information */}
                <h3>Patient Information</h3>
                <table>
                    <tbody>
                    <tr>
                        <td>Fullname:</td>
                        <td>{resultData.patientInfo.fullname}</td>
                    </tr>
                    <tr>
                        <td>Birth Date:</td>
                        <td>{resultData.patientInfo.birthDate ? new Date(resultData.patientInfo.birthDate).toLocaleDateString() : 'N/A'}</td>
                    </tr>
                    <tr>
                        <td>Age:</td>
                        <td>{resultData.patientInfo.age ? calculateAge(resultData.patientInfo.birthDate) : 'N/A'}</td>
                    </tr>
                    <tr>
                        <td>Strong Hand:</td>
                        <td>{resultData.patientInfo.strongHand}</td>
                    </tr>
                    <tr>
                        <td>Has Diseases:</td>
                        <td>{resultData.patientInfo.hasDiseases ? 'Yes' : 'No'}</td>
                    </tr>
                    {resultData.patientInfo.hasDiseases && (
                        <tr>
                            <td>Diseases:</td>
                            <td>{resultData.patientInfo.diseases}</td>
                        </tr>
                    )}
                    </tbody>
                </table>

                {/* Display experiment settings */}
                <h3>Experiment Settings</h3>
                <table>
                    <tbody>
                    <tr>
                        <td>Shape:</td>
                        <td>{resultData.experimentSettings.shape}</td>
                    </tr>
                    <tr>
                        <td>Experiment Length:</td>
                        <td>{resultData.experimentSettings.experimentLength} seconds</td>
                    </tr>
                    <tr>
                        <td>Is Color Blind:</td>
                        <td>{resultData.experimentSettings.isColorBlind ? "Yes" : "No"}</td>
                    </tr>
                    <tr>
                        <td>Blink Delay:</td>
                        <td>{resultData.experimentSettings.blinkDelay} seconds</td>
                    </tr>
                    <tr>
                        <td>Difficulty Level:</td>
                        <td>{resultData.experimentSettings.difficultyLevel}</td>
                    </tr>
                    </tbody>
                </table>

                {/* Display relevant information from resultData */}
                <h3>Reaction Times (in ms)</h3>
                {Object.keys(resultData.reactionTimes).map((experimentId) => {
                    const data = resultData.reactionTimes[experimentId];
                    return (
                        data && data.length > 0 ? (
                            <div key={experimentId}>
                                <div style={{ color: '#FFFFFF' }}>{`Experiment Data ID ${experimentId}`}</div>

                                <table style={{ marginBottom: '20px' }}>
                                    <thead>
                                    <tr>
                                        <th>Time</th>
                                        <th>Status</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {data.map((entry, index) => (
                                        <tr key={index}>
                                            <td>{entry.time}</td>
                                            <td>{entry.status}</td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                                <button
                                    style={{ marginTop: '10px', marginBottom: '10px' }}
                                    className="btn btn-dark"
                                >
                                    Delete {experimentId}
                                </button>
                            </div>
                        ) : null
                    );
                })}

                {/* Display average reaction times */}
                <h3>Average Reaction Times (in ms)</h3>
                <div key="averageReactionTimes">
                    <table>
                        <thead>
                        <tr>
                            <th>Condition</th>
                            <th>Average Reaction Time</th>
                        </tr>
                        </thead>
                        <tbody>
                        {Object.entries(resultData.averageReactionTimes || {}).map(([condition, time], index) => (
                            <tr key={index}>
                                <td>{condition}</td>
                                <td>{time}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default DemoResults;
