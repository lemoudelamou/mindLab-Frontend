import React, { useState, useEffect } from 'react';
import { fetchDataForGroup} from '../../Api/Api';
import Navbar from '../Navbar/Navbar';
import Spinner from '../../utils/Spinner';


const GroupResults = () => {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState(null);
    const group = localStorage.getItem("groupName");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await fetchDataForGroup(group);

                console.log("fetched group data:", result)
                setData(result);
                setLoading(false);
            } catch (error) {
                // Handle the error, e.g., set an error state
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
                <div>
                    <p>No data available for the specified group.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="results-container">
            <Navbar />

            <div className="pad-container">
                <h2>Group Results</h2>

                {/* Display information for each group */}
                {data.map((groupData) => (
                    <div key={groupData.id} className="group-results">
                        <h3>Person ID: {groupData.id}</h3>

                        {/* Display relevant information from resultData */}
                        <h3>Reaction Times (in ms)</h3>
                        {groupData.reactionTimes && groupData.reactionTimes.length > 0 ? (
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
                        ) : (
                            <p>No reaction times data available.</p>
                        )}

                        {/* Display average reaction times */}
                        <h3>Average Reaction Times (in ms)</h3>
                        {groupData.averageReactionTimes ? (
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
                                    <td>{groupData.averageReactionTimes.correct} </td>
                                </tr>
                                <tr>
                                    <td>incorrect</td>
                                    <td>{groupData.averageReactionTimes.incorrect}</td>
                                </tr>
                                </tbody>
                            </table>
                        ) : (
                            <p>No average reaction times data available.</p>
                        )}
                    </div>
                ))}

                <div className='transfer'>
                    {/* Additional content for the transfer section if needed */}
                </div>
            </div>
        </div>
    );
};

export default GroupResults;
