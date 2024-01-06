import React, {useState, useEffect} from "react";
import "../../style/Results.css";
import {calculateAge} from "../../utils/ExperimentUtils";

import Spinner from "../../utils/Spinner";
import Navbar from "../../Components/Navbar/Navbar";

const DemoModifyPatientResults = () => {
    const [experimentDetails, setExperimentDetails] = useState("");
    const [loading, setLoading] = useState(true);
    const [fetchDataTrigger, setFetchDataTrigger] = useState(true); // Added state variable
    const demoFullname = localStorage.getItem("DemoFullname");


    useEffect(() => {
        const fetchData = async () => {
            try {
                if (fetchDataTrigger) {
                    const response = await import('../json/allData.json');
                    const allData = await response.default;

                    // Filter data based on demoFullname
                    let filteredData = allData.filter(item => item.patient && item.patient.fullname === demoFullname);
                    console.log("filteredData: ", filteredData);

                    // Check if data is not found in JSON file
                    if (filteredData.length === 0) {
                        const storedDemoResult = JSON.parse(localStorage.getItem('DemoResultData'));

                        if (storedDemoResult) {
                            let normalizedData = [];

                            // Check if storedDemoResult has experiments
                            if (storedDemoResult.experiments) {
                                // Iterate over experiments and normalize the structure
                                for (let [experimentId, experiment] of Object.entries(storedDemoResult.experiments)) {
                                    normalizedData.push({
                                        experimentId,
                                        experimentSettings: storedDemoResult.experimentSettings,
                                        patient: storedDemoResult.patientInfo, // Change patientInfo to patient
                                        id: experiment.id,
                                        reactionTimes: experiment.reactionTimes,
                                        averageReactionTimes: {
                                            id: experiment.averageReactionTimes.id,
                                            correct: experiment.averageReactionTimes.correct || 0,
                                            incorrect: experiment.averageReactionTimes.incorrect || 0,
                                        },
                                    });
                                }
                            } else {
                                // Use the storedDemoResult directly if it has the expected structure
                                normalizedData = [storedDemoResult];
                            }

                            // Filter normalized data based on demoFullname
                            filteredData = normalizedData.filter(item => item.patient.fullname === demoFullname);
                            console.log("filteredData: ", filteredData);
                        }
                    }

                    setExperimentDetails(filteredData);
                    setLoading(false);
                    setFetchDataTrigger(false);
                }
            } catch (error) {
                console.error("Error getting experiment details:", error);
                setLoading(false);
            }
        };

        fetchData();
    }, [fetchDataTrigger, demoFullname]);


    const handleDeleteExperimentData = async (experimentId) => {
        const confirmDelete = window.confirm('Are you sure you want to delete all reaction times for this experiment?');

        if (confirmDelete) {
            try {
                // Update state to remove the deleted experiment
                setExperimentDetails((prevExperimentDetails) => {
                    console.log('Previous Experiment Details:', prevExperimentDetails);
                    const updatedDetails = prevExperimentDetails.filter((experiment) => experiment.experimentId !== experimentId);
                    console.log('Updated Experiment Details:', updatedDetails);
                    return updatedDetails;
                });
            } catch (error) {
                console.error('Error deleting experiment data:', error);
            }
        }
    };


    if (loading) {
        return <div className="spinner-container">
            <Spinner/>
        </div>;
    }

    if (!experimentDetails || experimentDetails.length === 0) {

        return (
            <div className="results-container">
                <Navbar/>
                <p className="no-results-message">No results available.</p>
            </div>
        );
    }


    return (
        <div className="results-container">
            <Navbar/>

            {loading ? (
                <div>
                    <Spinner/>
                </div>
            ) : (
                <div className="pad-container">
                    <h2>Experiment Results</h2>

                    {/* Display patient information */}
                    <h3>Patient
                        Information: {experimentDetails[0]?.patient?.fullname || experimentDetails[0]?.patientInfo?.fullname}</h3>
                    <table>
                        <tbody>
                        <tr>
                            <td>Fullname:</td>
                            <td>{experimentDetails[0]?.patient?.fullname || experimentDetails[0]?.patientInfo?.fullname}</td>
                        </tr>
                        <tr>
                            <td>Birth Date:</td>
                            <td>{(experimentDetails[0]?.patient?.birthDate || experimentDetails[0]?.patientInfo?.birthDate) ? new Date((experimentDetails[0]?.patient?.birthDate || experimentDetails[0]?.patientInfo?.birthDate)).toLocaleDateString() : 'N/A'}</td>
                        </tr>
                        <tr>
                            <td>Age:</td>
                            <td>{experimentDetails[0]?.patient?.age || calculateAge(experimentDetails[0]?.patient?.birthDate) || 'N/A'}</td>
                        </tr>
                        <tr>
                            <td>Strong Hand:</td>
                            <td>{experimentDetails[0]?.patient?.strongHand || experimentDetails[0]?.patientInfo?.strongHand}</td>
                        </tr>
                        <tr>
                            <td>Group:</td>
                            <td>{experimentDetails[0]?.patient?.groupe || experimentDetails[0]?.patientInfo?.groupe}</td>
                        </tr>
                        <tr>
                            <td>Has Diseases:</td>
                            <td>{experimentDetails[0]?.patient?.hasDiseases || experimentDetails[0]?.patientInfo?.hasDiseases ? 'Yes' : 'No'}</td>
                        </tr>
                        {experimentDetails[0]?.patient?.hasDiseases && (
                            <tr>
                                <td>Diseases:</td>
                                <td>{experimentDetails[0]?.patient?.diseases || experimentDetails[0]?.patientInfo?.diseases}</td>
                            </tr>
                        )}
                        <tr>
                            <td>Experiment date:</td>
                            <td>{experimentDetails[0]?.patient?.expDate || experimentDetails[0]?.patientInfo?.expDate}</td>
                        </tr>
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
                        experimentDetails.map((data, index) => (
                            data.reactionTimes && data.reactionTimes.length > 0 ? (
                                <div key={data.experimentId}>
                                    <div style={{color: '#FFFFFF'}}>{`Attempt ${index + 1}`}</div>

                                    <table style={{marginBottom: '20px'}}>
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
                                        onClick={() => handleDeleteExperimentData(data.experimentId)}
                                        style={{marginTop: '10px', marginBottom: '10px'}}
                                        className="btn btn-dark"
                                    >
                                        Delete
                                    </button>
                                </div>
                            ) : null
                        ))
                    ) : null}

                    <h3>Average Reaction Times (in ms)</h3>
                    {experimentDetails
                        .filter(experiment => experiment.averageReactionTimes && experiment.averageReactionTimes.id)
                        .map((experiment, index) => (
                            <div key={experiment.experimentId}>
                                <div style={{color: '#FFFFFF', paddingTop: '10px'}}>{`Attempt ${index + 1}`}</div>
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


export default DemoModifyPatientResults;
