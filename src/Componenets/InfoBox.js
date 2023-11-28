// src/InfoBox.js
import React from 'react';
import '../style/InfoBox.css';



const calculateAge = (birthdate) => {
  const today = new Date();
  const birthdateDate = new Date(birthdate);
  let age = today.getFullYear() - birthdateDate.getFullYear();
  const monthDiff = today.getMonth() - birthdateDate.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthdateDate.getDate())) {
    age--;
  }

  return age;
};

const InfoBox = ({ patientInfo, experimentSettings }) => {
  return (
    <div className="info-box">
      <h3>Patient Information</h3>
      <p>Name: {patientInfo.fullname}</p>
      <p>Birth Date: {patientInfo.birthDate.toLocaleString()}</p>
      <p>Age: {calculateAge(patientInfo.birthDate)}</p>
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

export default InfoBox;
