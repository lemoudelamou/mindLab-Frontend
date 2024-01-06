import React, { useState, useEffect } from 'react';
import { fetchDataForGroup } from '../../Api/Api';
import Spinner from '../../utils/Spinner';
import '../../style/GroupResults.css'
import Navbar from "../../Components/Navbar/Navbar";

const DemoGroupResults = () => {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState(null);
    const demoGroup = localStorage.getItem('DemoGroup');


    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await import(`../json/allData.json`);
                console.log('fetched data:', result.default);
                console.log('demo group:', demoGroup);

                let combinedData = [];

                const storedDemoResult = JSON.parse(localStorage.getItem('DemoResultData'));

                if (storedDemoResult && storedDemoResult.patientInfo.groupe === demoGroup) {
                    console.log('DemoGroup found in local storage.');

                    // If demoGroup is found in local storage, use that data
                    combinedData = Object.entries(storedDemoResult.experiments).map(([experimentId, experiment]) => ({
                        experimentId,
                        experimentSettings: storedDemoResult.experimentSettings,
                        patient: storedDemoResult.patientInfo,
                        id: experiment.id,
                        reactionTimes: experiment.reactionTimes,
                        averageReactionTimes: {
                            id: experiment.averageReactionTimes.id,
                            correct: experiment.averageReactionTimes.correct || 0,
                            incorrect: experiment.averageReactionTimes.incorrect || 0,
                        },
                    }));
                }

                // Filter data based on demoGroup in the JSON file
                const filteredDataFromJSON = result.default.filter(item => item.patient.groupe === demoGroup);

                // Add additional data from JSON file
                combinedData = [...combinedData, ...filteredDataFromJSON];

                console.log('Combined Group Results:', combinedData);
                setData(combinedData);
                setLoading(false);
            } catch (error) {
                console.error('Error in component:', error);
                setLoading(false);
            }
        };

        fetchData();
    }, [demoGroup]);

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
                    <p>No data available for the specified group</p>
                </div>
            </div>
        );
    }

    return (
        <div className="results-container-group">
            <Navbar />
            <div className="pad-container-group">
                <h2>Group Results</h2>
                {data.map((groupData) => (
                    <div key={groupData.id} className="group-results">

                        {/* Display relevant information from resultData */}
                        {groupData.reactionTimes?.length > 0 && (

                            <>
                                <h3>Patient: {groupData.patient.fullname}</h3>

                                <h3>Reaction Times (in ms)</h3>
                                <table>
                                    <thead>
                                    <tr>
                                        <th>Time</th>
                                        <th>Status</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {groupData.reactionTimes.map((entry) => (
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
                        {groupData.averageReactionTimes && (
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
                                        <td>{groupData.averageReactionTimes.correct}</td>
                                    </tr>
                                    <tr>
                                        <td>incorrect</td>
                                        <td>{groupData.averageReactionTimes.incorrect}</td>
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

export default DemoGroupResults;
