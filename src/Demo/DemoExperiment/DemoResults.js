import React from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import Navbar from "../../Componenets/Navbar/Navbar";
import '../../style/Results.css';
import { calculateAge} from "../../utils/ExperimentUtils";


const Results = () => {

    const navigate = useNavigate();
    const location = useLocation();
    const resultData = location.state && location.state.resultData;

    if (!resultData) {
        // Handle the case where resultData is not available
        return <div>
            <Navbar/>
            <p className="no-results-message">No results available.</p>;
        </div>
    }

    // Access data from resultData
    const { experimentSettings, patientInfo, reactionTimes, averageReactionTimes } = resultData;

    console.log("the results data are", resultData);

    const handleSubmit =  (event) => {
        navigate('/demo-data', { state: { resultData } });
        console.log('submitted resultData from results page:', resultData);
    }
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
                        <td>{patientInfo.fullname}</td>
                    </tr>
                    <tr>
                        <td>Birth Date:</td>
                        <td>{patientInfo.birthDate ? new Date(patientInfo.birthDate).toLocaleDateString() : 'N/A'}</td>
                    </tr>
                    <tr>
                        <td>Age:</td>
                        <td>{ patientInfo.age ? calculateAge(patientInfo.birthDate) : 'N/A'}</td>
                    </tr>
                    <tr>
                        <td>Strong Hand:</td>
                        <td>{patientInfo.strongHand}</td>
                    </tr>
                    <tr>
                        <td>Has Diseases:</td>
                        <td>{patientInfo.hasDiseases  ? 'Yes' : 'No'}</td>
                    </tr>
                    {patientInfo.hasDiseases && (
                        <tr>
                            <td>Diseases:</td>
                            <td>{patientInfo.diseases}</td>
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
                        <td>{experimentSettings.shape}</td>
                    </tr>
                    <tr>
                        <td>Experiment Length:</td>
                        <td>{experimentSettings.experimentLength} seconds</td>
                    </tr>
                    <tr>
                        <td>Is Color Blind:</td>
                        <td>{experimentSettings.isColorBlind ? "Yes" : "No"}</td>
                    </tr>
                    <tr>
                        <td>Blink Delay:</td>
                        <td>{experimentSettings.blinkDelay} seconds</td>
                    </tr>
                    <tr>
                        <td>Difficulty Level:</td>
                        <td>{resultData.experimentSettings.difficultyLevel} </td>
                    </tr>
                    {/* Add more experiment settings fields as needed */}
                    </tbody>
                </table>

                {/* Display relevant information from resultData */}
                <h3>Reaction Times</h3>
                <table>
                    <thead>
                    <tr>
                        <th>Time</th>
                        <th>Status</th>
                    </tr>
                    </thead>
                    <tbody>
                    {reactionTimes.map((entry, index) => (
                        <tr key={index}>
                            <td>{entry.time}</td>
                            <td>{entry.status}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>

                {/* Display average reaction times */}
                <h3>Average Reaction Times</h3>
                <table>
                    <thead>
                    <tr>
                        <th>Condition</th>
                        <th>Average Reaction Time</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <td>correct</td>
                        <td>{averageReactionTimes.correct}</td>
                    </tr>
                    <tr>
                        <td>incorrect</td>
                        <td>{averageReactionTimes.incorrect}</td>
                    </tr>
                    </tbody>
                </table>
                <div className='transfer'>
                    {/* Button to transfer resultData to /Data */}

                    <Button className="transfer-button" type="submit" onClick={handleSubmit}>Transfer to Data</Button>
                </div>



            </div>
        </div>
    );
};

export default Results;
