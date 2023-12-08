import React from "react";

const DemoResultsDisplay = ({ allAttempts }) => {
    return (
        <div className="results-container">
            <h2>Results of Attempts</h2>
            {allAttempts.map((attempt, index) => (
                <div key={index} className="attempt-result">
                    <h3>Attempt {index + 1}</h3>
                    <table>
                        <thead>
                        <tr>
                            <th>Reaction Time (ms)</th>
                            <th>Status</th>
                        </tr>
                        </thead>
                        <tbody>
                        {attempt.reactionTimes.map((reaction, i) => (
                            <tr key={i}>
                                <td>{reaction.time.toFixed(2)}</td>
                                <td>{reaction.status}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                    <p>
                        <strong>Average Reaction Time (Correct):</strong>{" "}
                        {attempt.averageReactionTimes.correct.toFixed(2)} milliseconds
                    </p>
                    <p>
                        <strong>Average Reaction Time (Incorrect):</strong>{" "}
                        {attempt.averageReactionTimes.incorrect.toFixed(2)} milliseconds
                    </p>
                </div>
            ))}
        </div>
    );
};

export default DemoResultsDisplay;
