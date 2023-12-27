import React, {lazy, Suspense} from 'react';
import Modal from 'react-modal';
const ExperimentInstructionsBox = lazy(() => import('./ExperimentInstructionBox'));

const InstructionBox = ({ showContentBox, toggleContentBox, experimentInstructionsBoxVisible, setExperimentInstructionsBoxVisible }) => (
    <div style={{ paddingTop: '10px' }}>
        {/* Button to toggle the modal */}
        <div>
            <button onClick={toggleContentBox} className="btn btn-dark" style={{ justifySelf: 'center' }}>
                {showContentBox ? 'Hide Instructions' : 'Show Instructions'}
            </button>
        </div>

        {/* Lazy-loaded ExperimentInstructionsBox */}
        <Suspense fallback={<div>Loading...</div>}>
            {experimentInstructionsBoxVisible && (
                <Modal
                    isOpen={experimentInstructionsBoxVisible}
                    ariaHideApp={false}
                    onRequestClose={() => setExperimentInstructionsBoxVisible(false)}
                    contentLabel="Instructions"
                    style={{
                        content: {
                            top: '50%',
                            left: '50%',
                            width: '1000px',
                            right: 'auto',
                            bottom: 'auto',
                            marginRight: '-50%',
                            transform: 'translate(-50%, -50%)',
                        },
                    }}
                >
                    {/* Include the ExperimentInstructionsBox component here */}
                    <ExperimentInstructionsBox />
                </Modal>
            )}
        </Suspense>
    </div>
);

export default InstructionBox;
