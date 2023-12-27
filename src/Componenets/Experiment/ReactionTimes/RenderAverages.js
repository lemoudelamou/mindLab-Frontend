import React from 'react';

const RenderAverages = ({ tablesVisible, calculateAverages }) => {

    const averages = calculateAverages(); // Assuming calculateAverages is available


    return tablesVisible && Object.entries(averages).map(([experimentId, values], index) => (
        <div key={experimentId} className={tablesVisible ? 'visible' : 'hidden'}>
            <h3 style={{ textAlign: 'center' }}>{`Experiment ${index + 1}`}</h3>
            <table style={{ minWidth: '700px'}}>
                <thead>
                <tr>
                    <th>Statistic</th>
                    <th>Value</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td>Average Correct Time</td>
                    <td>{values.correct} ms</td>
                </tr>
                <tr>
                    <td>Average Incorrect Time</td>
                    <td>{values.incorrect} ms</td>
                </tr>
                </tbody>
            </table>
        </div>
    ));
};

export default RenderAverages;
