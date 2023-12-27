import React from 'react';
import '../../style/InfoBox.css';
import { calculateAge} from "../../utils/ExperimentUtils";





const DemoInfoBox = ({patientInfo, experimentSettings}) => {
    return (
        <div className="info-box">
            <h3>Patient Information</h3>
            <p>Name: {patientInfo.fullname}</p>
            <p>Birth Date: {patientInfo.birthDate ? new Date(patientInfo.birthDate).toLocaleDateString() : 'N/A'}</p>
            <p>Age: {calculateAge(patientInfo.birthDate) ? null : 'N/A'}</p>
            <strong>Has Diseases:</strong> {patientInfo.hasDiseases ? 'Yes' : 'No'}
            <p> Diseases: {patientInfo.diseases}</p>

            <h3>Experiment Settings</h3>
            <p>Shape: {experimentSettings.shape}</p>
            <p>Experiment Length: {experimentSettings.experimentLength} seconds</p>
            <p>Color Blind: {experimentSettings.isColorBlind ? 'Yes' : 'No'}</p>
            <p>Blink Delay: {experimentSettings.blinkDelay} seconds</p>
            <p>difficultyLevel: {experimentSettings.difficultyLevel}</p>

        </div>
    );
};

export default DemoInfoBox;
