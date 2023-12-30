import React from "react";
import '../../../style/ExperimentInstructionBox.css'
import HexToColorPreview from '../../../utils/HexToColorPreview';

const ExperimentInstructionsBox = () => {
    const isColorBlind =  localStorage.getItem("colorBlind")
    const hexColor = isColorBlind ? "blue" : localStorage.getItem("color1");

    return (
        <div className="instructions-container" >
            <div className="instructions-box">
                <h3>Experiment Instructions</h3>
                <p style={{paddingBottom: '20px'}}>
                    <b>The Following instructions will guide you through the experiment:</b>
                </p>
                <ul>
                    <li>To be able to start the experiment you have to click on start the session. The start experiment will be activated.</li>
                    <li>When clicking on start experiment a counter down will be displayed. So be prepared!</li>
                    <li>When it reaches 1 the experiment is about to start.</li>
                    <li>When you see the color below, you have to click on the space bar. <HexToColorPreview hexColor={hexColor}/></li>
                </ul>
                <p style={{paddingTop: '20px', paddingBottom: '20px'}}>
                    <b>Please do not click on the Button save results</b>
                </p>
            </div>
        </div>
    );
};

export default ExperimentInstructionsBox;
