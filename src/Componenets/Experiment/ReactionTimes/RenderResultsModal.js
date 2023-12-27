// RenderResultsModal.js
import React from 'react';
import Modal from 'react-modal';
import RenderExperimentData from './RenderExperimentData';
import RenderAverages from './RenderAverages';

const RenderResultsModal = React.memo(({ tablesVisible, experimentData, calculateAverages, handleToggleClick, handleResultsPage }) => {

    return (
        <Modal
            isOpen={tablesVisible}
            ariaHideApp={false}
            onRequestClose={handleToggleClick}
            contentLabel="Experiment Results"
            style={{
                content: {
                    top: '50%',
                    left: '50%',
                    right: 'auto',
                    bottom: 'auto',
                    marginRight: '-50%',
                    transform: 'translate(-50%, -50%)',
                    maxHeight: '80%', // Set the maximum height of the modal content
                    overflowY: 'auto', // Enable vertical scrolling
                    display: 'flex', // Use Flexbox
                    flexDirection: 'column', // Stack items vertically
                    alignItems: 'center', // Center items horizontally
                },
            }}>
            <div>
                <div className="results-section experiment-results">
                    <h2>Experiment Results</h2>
                    <RenderExperimentData tablesVisible={tablesVisible} experimentData={experimentData} />
                </div>

                <div className="results-section average-reaction-times">
                    <h2>Average Reaction Times</h2>
                    <RenderAverages tablesVisible={tablesVisible} calculateAverages={calculateAverages} />
                </div>
            </div>
            <button onClick={handleResultsPage} className="btn btn-dark"
                    style={{marginTop: '10px', flexDirection: 'column', alignItems: 'center'}}>
                To Results
            </button>
        </Modal>
    );
});

export default RenderResultsModal;
