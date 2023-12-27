import React from 'react';

const RenderExperimentData = ({ tablesVisible, experimentData }) => {
    return tablesVisible && Object.entries(experimentData).map(([experimentId, data], index) => (
        <div key={experimentId} className={tablesVisible ? 'visible' : 'hidden'} >
            <h3 style={{ textAlign: 'center' }}>{`Experiment ${index + 1}`}</h3>
            <table style={{ minWidth: '700px'}}>
                <thead>
                <tr>
                    <th>Time</th>
                    <th>Status</th>
                </tr>
                </thead>
                <tbody>
                {data.map((entry, entryIndex) => (
                    <tr key={entryIndex}>
                        <td>{entry.time}</td>
                        <td>{entry.status}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    ));
};

export default RenderExperimentData;
