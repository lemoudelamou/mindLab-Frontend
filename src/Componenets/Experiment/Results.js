import React, {useState, useEffect} from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import Navbar from "../Navbar/Navbar";
import '../../style/Results.css'
import {calculateAge} from "../../utils/ExperimentUtils";
import {getExperimentsDataById} from "../../Api/Api";
import  secureLocalStorage  from  "react-secure-storage";
import Spinner from "../../utils/Spinner";


const Results = () => {

    const navigate = useNavigate();
    const location = useLocation();
    const resultData = location.state && location.state.resultData;
    const [experimentDetails, setExperimentDetails] = useState(null);
    const storedExperimentDataId = secureLocalStorage.getItem('experimentDataId');
    const [loading, setLoading] = useState(true);



    // Access data from experimentDetails with additional checks

    console.log("the experiment data id is: ", storedExperimentDataId)

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (storedExperimentDataId) {
                    // Call the API to get detailed experiment data
                    const allData = await getExperimentsDataById(storedExperimentDataId);
                    setExperimentDetails(allData);
                    setLoading(false);

                }
            } catch (error) {
                console.error('Error getting experiment details:', error);
            }
        };

        fetchData(); // Call the async function
    }, []);


    if (!experimentDetails) {
        // Handle the case where resultData is not available
        return <div>
            <Navbar/>
            <p className="no-results-message">No results available.</p>;
        </div>
    }

    const handleSubmit = (event) => {
        navigate('/data', { state: { resultData } });
        console.log('submitted resultData from results page:', resultData);
    };


    const { experimentSettings, patient, reactionTimes, averageReactionTimes } = experimentDetails || {};

    return (
        <div className="results-container">
            <Navbar/>

            {loading ?
                (<div>
                    <Spinner/>
                </div>) : (
            <div className="pad-container">
                <h2>Experiment Results</h2>

                {/* Display patient information */}
                <h3>Patient Information</h3>
                <table>
                    <tbody>
                    <tr>
                        <td>Fullname:</td>
                        <td>{patient.fullname}</td>
                    </tr>
                    <tr>
                        <td>Birth Date:</td>
                        <td>{patient.birthDate ? new Date(patient?.birthDate).toLocaleDateString() : 'N/A'}</td>
                    </tr>
                    <tr>
                        <td>Age:</td>
                        <td>{ patient.age ? calculateAge(patient?.birthDate) : 'N/A'}</td>
                    </tr>
                    <tr>
                        <td>Strong Hand:</td>
                        <td>{patient.strongHand}</td>
                    </tr>
                    <tr>
                        <td>Has Diseases:</td>
                        <td>{patient?.hasDiseases  ? 'Yes' : 'No'}</td>
                    </tr>
                    {patient?.hasDiseases && (
                        <tr>
                            <td>Diseases:</td>
                            <td>{patient?.diseases}</td>
                        </tr>
                    )}
                    <tr>
                        <td>Experiment taken on:</td>
                        <td>{patient.expDate}</td>
                    </tr>
                    </tbody>
                </table>



                {/* Display experiment settings */}
                <h3>Experiment Settings</h3>
                <table>
                    <tbody>
                    <tr>
                        <td>Shape:</td>
                        <td>{experimentDetails.experimentSettings.shape}</td>
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
                        <td>{experimentSettings.difficultyLevel} </td>
                    </tr>
                    </tbody>
                </table>

                {/* Display relevant information from resultData */}
                <h3>Reaction Times (in ms)</h3>
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
                <h3>Average Reaction Times (in ms)</h3>
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
                        <td>{averageReactionTimes.correct} </td>
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

            </div> )}
        </div>
    );
};

export default Results;
