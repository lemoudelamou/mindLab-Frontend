import React, { useState, useEffect } from 'react';
import { fetchDataForGroup } from '../../Api/Api';
import Navbar from '../Navbar/Navbar';
import Spinner from '../../utils/Spinner';
import '../../style/GroupResults.css'

const GroupResults = () => {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState(null);
    const group = localStorage.getItem('groupName');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await fetchDataForGroup(group);
                setData(result);
                setLoading(false);
            } catch (error) {
                console.error('Error in component:', error);
                setLoading(false);
            }
        };

        fetchData();
    }, [group]);

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
                                <h3>Person: {groupData.patient.fullname}</h3>

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

export default GroupResults;
