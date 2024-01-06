import React, {useEffect, useState} from "react";
import {useLocation} from "react-router-dom";
import "../../style/Results.css";
import {calculateAge} from "../../utils/ExperimentUtils";
import Navbar from "../../Components/Navbar/Navbar";

const DemoResults = () => {
    const storedDemoResult = JSON.parse(localStorage.getItem('DemoResultData'));
    const [resultData, setResultData] = useState(storedDemoResult);
    const experimentDate = Date.now();
    const expDateObject = new Date(experimentDate);
    const expDate = expDateObject.toISOString().split("T")[0];


    console.log("results:", resultData);

    useEffect(() => {

    }, [resultData]);

    // Updated handleDeleteExperiment function
    const handleDeleteExperiment = (experimentId) => {
        const confirmDelete = window.confirm('Are you sure you want to delete all reaction times for this experiment?');

        if (confirmDelete) {
            try {
                setResultData((prevResultData) => {
                    const updatedResultData = {...prevResultData};

                    delete updatedResultData.experiments[experimentId];

                    return updatedResultData;
                });
            } catch (error) {
                console.error('Error deleting experiment data:', error);
            }
        }
    };


    if (!storedDemoResult || Object.keys(storedDemoResult).length === 0) {
        return (
            <div>
                <Navbar/>
                <p className="no-results-message">No results available.</p>
            </div>
        );
    }

    // Dummy patient data if resultData.patientInfo is null
    const dummyPatientInfo = {
        fullname: "Dummy Dummy",
        birthDate: "1955-01-01",
        age: calculateAge("1955-01-01"),
        strongHand: "Right",
        groupe: "s1",
        hasDiseases: false,
        diseases: "",
        expDate,
    };

    return (
        <div className="results-container">
            <Navbar/>

            <div className="pad-container">
                <h2>Experiment Results</h2>

                {/* Display patient information */}
                <h3>Patient Information</h3>
                <table>
                    <tbody>
                    <tr>
                        <td>Fullname:</td>
                        <td>{resultData.patientInfo.fullname || dummyPatientInfo.fullname}</td>
                    </tr>
                    <tr>
                        <td>Birth Date:</td>
                        <td>
                            {resultData.patientInfo.birthDate
                                ? new Date(resultData.patientInfo.birthDate).toLocaleDateString()
                                : dummyPatientInfo.birthDate}
                        </td>
                    </tr>
                    <tr>
                        <td>Age:</td>
                        <td>{resultData.patientInfo.age ? calculateAge(resultData.patientInfo.birthDate) : dummyPatientInfo.age}</td>
                    </tr>
                    <tr>
                        <td>Strong Hand:</td>
                        <td>{resultData.patientInfo.strongHand || dummyPatientInfo.strongHand}</td>
                    </tr>
                    <tr>
                        <td>Group:</td>
                        <td>{resultData.patientInfo.groupe || dummyPatientInfo.groupe}</td>
                    </tr>
                    <tr>
                        <td>Has Diseases:</td>
                        <td>
                            {(resultData.patientInfo.hasDiseases ? "Yes" : "No") ||
                                (dummyPatientInfo.hasDiseases ? "Yes" : "No")}
                        </td>
                    </tr>
                    {(resultData.patientInfo.hasDiseases || dummyPatientInfo.hasDiseases) && (
                        <tr>
                            <td>Diseases:</td>
                            <td>{resultData.patientInfo.diseases || dummyPatientInfo.diseases}</td>
                        </tr>
                    )}
                    <tr>
                        <td>Expiment taken on:</td>
                        <td>{resultData.patientInfo.expDate || dummyPatientInfo.expDate}</td>
                    </tr>
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
                {/* Display reaction times */}
                {Object.entries(resultData.experiments).map(([experimentId, experimentData], index) => (
                    <div key={experimentId}>
                        <div style={{color: "#FFFFFF"}}>Attempt {index + 1}</div>
                        <table style={{marginBottom: '20px'}}>
                            <thead>
                            <tr>
                                <th>Time</th>
                                <th>Status</th>
                            </tr>
                            </thead>
                            <tbody>
                            {experimentData.reactionTimes.map((entry, entryIndex) => (
                                <tr key={entryIndex}>
                                    <td>{entry.time}</td>
                                    <td>{entry.status}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                        <button
                            onClick={() => handleDeleteExperiment(experimentId)}
                            style={{marginTop: '10px', marginBottom: '10px'}}
                            className="btn btn-dark"
                        >
                            Delete {index + 1}
                        </button>
                    </div>
                ))}


                {/* Display average reaction times */}
                <h3>Average reaction times (in ms)</h3>
                {Object.entries(resultData.experiments).map(([experimentId, experimentData], index) => (
                    <div key={index}>
                        <div style={{color: "#FFFFFF"}}>Attempt {index + 1}</div>
                        <table>
                            <thead>
                            <tr>
                                <th>Condition</th>
                                <th>Average Reaction Time</th>
                            </tr>
                            </thead>
                            <tbody>
                            {Object.entries(experimentData.averageReactionTimes).map(([condition, avgTime]) => (
                                <tr key={condition}>
                                    <td>{condition}</td>
                                    <td>{avgTime}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                ))}


            </div>
        </div>
    );
};

export default DemoResults;
