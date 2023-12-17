import React, { useState, useEffect } from 'react';
import { getPatientByFullnameAndId} from '../../Api/Api';
import Navbar from '../Navbar/Navbar';
import Spinner from '../../utils/Spinner';
import '../../style/GroupResults.css';

const PatientResults = () => {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState(null);
    const fullname = localStorage.getItem('fullname'); // Change 'groupName' to 'fullname'
    const patientId = localStorage.getItem("patientById");

    console.log("patient Id in patient result", patientId);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await getPatientByFullnameAndId(fullname, patientId); // Change 'group' to 'fullname'
                setData(result);
                setLoading(false);
            } catch (error) {
                console.error('Error in component:', error);
                setLoading(false);
            }
        };

        fetchData();
    }, [fullname]);



    if (loading) {
        return (
            <div>
                <Navbar />
                <div>
                    <Spinner />
                </div>
            </div>
        );
    }

    if (!data || data.length === 0) {
        return (
            <div>
                <Navbar />
                <div className="centered-text">
                    <p>No data available for {fullname}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="results-container-group">
            <Navbar />
            <div className="pad-container-group">
                <h1>Results for "{fullname}"</h1>
                <h3>Experiment Settings</h3>
                <table>
                    <tbody>
                    <tr>
                        <td>Shape:</td>
                        <td>{data[0].experimentSettings.shape}</td>
                    </tr>
                    <tr>
                        <td>Experiment Length:</td>
                        <td>{data[0].experimentSettings.experimentLength} seconds</td>
                    </tr>
                    <tr>
                        <td>Is Color Blind:</td>
                        <td>{data[0].experimentSettings.isColorBlind ? "Yes" : "No"}</td>
                    </tr>
                    <tr>
                        <td>Blink Delay:</td>
                        <td>{data[0].experimentSettings.blinkDelay} seconds</td>
                    </tr>
                    <tr>
                        <td>Difficulty Level:</td>
                        <td>{data[0].experimentSettings.difficultyLevel} </td>
                    </tr>
                    {/* Add more experiment settings fields as needed */}
                    </tbody>
                </table>


                {data.map((patient) => (
                    <div key={patient.id} className="group-results">

                        {/* Display relevant information from resultData */}
                        {patient.reactionTimes?.length > 0 && (
                            <>

                                <h3>Reaction Times (in ms)</h3>
                                <table>
                                    <thead>
                                    <tr>
                                        <th>Time</th>
                                        <th>Status</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {patient.reactionTimes.map((entry) => (
                                        <tr key={entry.id}>
                                            <td>{entry.time}</td>
                                            <td>{entry.status}</td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </>
                        )}

                        {/* Display average reaction times */}
                        {patient.averageReactionTimes && (
                            <>
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
                                        <td>{patient.averageReactionTimes.correct}</td>
                                    </tr>
                                    <tr>
                                        <td>incorrect</td>
                                        <td>{patient.averageReactionTimes.incorrect}</td>
                                    </tr>
                                    </tbody>
                                </table>
                            </>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PatientResults;
