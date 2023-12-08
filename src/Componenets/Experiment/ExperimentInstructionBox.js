// ExperimentInstructionsBox.jsx

import React from "react";
import '../../style/ExperimentInstructionBox.css'

const ExperimentInstructionsBox = () => {
    return (
        <div className="instructions-container" >

            <div className="instructions-box">
                <h3>Experiment Instructions</h3>
                <p>
                    Your experiment instructions go here. Provide clear guidance on how to proceed with the experiment.
                </p>
            </div>
        </div>
    );
};

export default ExperimentInstructionsBox;
