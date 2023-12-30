import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../Navbar/Navbar";
import "../../style/Results.css";
import { calculateAge } from "../../utils/ExperimentUtils";
import {deleteExperimentDataById, deletePatientById, getExperimentsDataById} from "../../Api/Api";
import secureLocalStorage from "react-secure-storage";
import Spinner from "../../utils/Spinner";

const Results = () => {
    const [experimentDetails, setExperimentDetails] = useState("");
    const [loading, setLoading] = useState(true);
    const [fetchDataTrigger, setFetchDataTrigger] = useState(true); // Added state variable

    useEffect(() => {
        const fetchData = async () => {
            try {
                const patientId = localStorage.getItem("patientId");
                if (patientId && fetchDataTrigger) {
                    const allData = await getExperimentsDataById(patientId);
                    console.log("allData: ", allData);

                    setExperimentDetails(allData);
                    setLoading(false);
                    setFetchDataTrigger(false); // Set the trigger to false after fetching data
                }
            } catch (error) {
                console.error("Error getting experiment details:", error);
                setLoading(false);


            }
        };

        fetchData();
    }, [fetchDataTrigger]); // Fetch data when fetchDataTrigger changes



    const handleDeleteExperimentData = async (experimentDataId) => {
        const confirmDelete = window.confirm('Are you sure you want to delete all reaction times for this experiment?');

        if (confirmDelete) {
            try {
                await deleteExperimentDataById(experimentDataId);

                // Update state to remove the deleted experiment
                setExperimentDetails((prevExperimentDetails) =>
                    prevExperimentDetails.filter((experiment) => experiment.experimentDataId !== experimentDataId)
                );
            } catch (error) {
                console.error('Error deleting experiment data:', error);
                // Handle errors (e.g., show an error message)
            }
        }
    };


    if (loading) {
        return <div className="spinner-container">
        <Spinner />
        </div>;
    }

    if (!experimentDetails || experimentDetails.length === 0) {

        return (
            <div className="results-container">
                <Navbar />
                <p className="no-results-message">No results available.</p>
            </div>
        );
    }




    return (
        <div className="results-container">
            <Navbar />

            {loading ? (
                <div>
                    <Spinner />
                </div>
            ) : (
                <div className="pad-container">
                    <h2>Experiment Results</h2>

                    {/* Display patient information */}
                    <h3>Patient Information</h3>
                    <table>
                        <tbody>
                        <tr>
                            <td>Fullname:</td>
                            <td>{experimentDetails[0].patientInfo.fullname}</td>
                        </tr>
                        <tr>
                            <td>Birth Date:</td>
                            <td>{experimentDetails[0].patientInfo.birthDate ? new Date(experimentDetails[0].patientInfo.birthDate).toLocaleDateString() : 'N/A'}</td>
                        </tr>
                        <tr>
                            <td>Age:</td>
                            <td>{ experimentDetails[0].patientInfo.age ? calculateAge(experimentDetails[0].patientInfo.birthDate) : 'N/A'}</td>
                        </tr>
                        <tr>
                            <td>Strong Hand:</td>
                            <td>{experimentDetails[0].patientInfo.strongHand}</td>
                        </tr>
                        <tr>
                            <td>Has Diseases:</td>
                            <td>{experimentDetails[0].patientInfo.hasDiseases  ? 'Yes' : 'No'}</td>
                        </tr>
                        {experimentDetails[0].patientInfo.hasDiseases && (
                            <tr>
                                <td>Diseases:</td>
                                <td>{experimentDetails[0].patientInfo.diseases}</td>
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
                            <td>{experimentDetails[0].experimentSettings.shape}</td>
                        </tr>
                        <tr>
                            <td>Experiment Length:</td>
                            <td>{experimentDetails[0].experimentSettings.experimentLength} seconds</td>
                        </tr>
                        <tr>
                            <td>Is Color Blind:</td>
                            <td>{experimentDetails[0].experimentSettings.isColorBlind ? "Yes" : "No"}</td>
                        </tr>
                        <tr>
                            <td>Blink Delay:</td>
                            <td>{experimentDetails[0].experimentSettings.blinkDelay} seconds</td>
                        </tr>
                        <tr>
                            <td>Difficulty Level:</td>
                            <td>{experimentDetails[0].experimentSettings.difficultyLevel} </td>
                        </tr>
                        {/* Add more experiment settings fields as needed */}
                        </tbody>
                    </table>




                    {/* Display relevant information from resultData */}
                    <h3>Reaction Times (in ms)</h3>
                    {Array.isArray(experimentDetails) ? (
                        experimentDetails.map((data) => (
                            data.reactionTimes && data.reactionTimes.length > 0 ? (
                                <div key={data.experimentDataId}>
                                    <div style={{ color: '#FFFFFF' }}>{`Experiment Data ID ${data.experimentDataId}`}</div>

                                    <table style={{ marginBottom: '20px' }}>
                                        <thead>
                                        <tr>
                                            <th>Time</th>
                                            <th>Status</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {data.reactionTimes.map((entry, index) => (
                                            <tr key={index}>
                                                <td>{entry.time}</td>
                                                <td>{entry.status}</td>
                                            </tr>
                                        ))}
                                        </tbody>
                                    </table>
                                    <button
                                        onClick={() => handleDeleteExperimentData(data.experimentDataId)}
                                        style={{ marginTop: '10px', marginBottom: '10px' }}
                                        className="btn btn-dark"
                                    >
                                        Delete {data.experimentDataId}
                                    </button>
                                </div>
                            ) : null
                        ))
                    ) : null}

                    <h3>Average Reaction Times (in ms)</h3>
                    {experimentDetails
                        .filter(experiment => experiment.averageReactionTimes && experiment.averageReactionTimes.id)
                        .map((experiment) => (
                            <div key={experiment.averageReactionTimes.id}>
                                <div style={{color: '#FFFFFF', paddingTop: '10px'}}>{`Experiment Data ID ${experiment.averageReactionTimes.id}`}</div>
                                <table>
                                    <thead>
                                    <tr>
                                        <th>Condition</th>
                                        <th>Average Reaction Time</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {Object.entries(experiment.averageReactionTimes || {}).map(([condition, time], index) => (
                                        <tr key={index}>
                                            <td>{condition}</td>
                                            <td>{time}</td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        ))}
                </div>
            )}
        </div>
    );
};


export default Results;
