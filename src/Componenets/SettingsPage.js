// src/SettingsPage.js
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { saveSettingsData } from '../Api/Api'; // Import the savePatientData function
import '../style/SettingsPage.css';

const SettingsPage = ({ selectedShape }) => {
  const defaultShapes = ['circle', 'square', 'rectangle'];
  const defaultDifficultyLevels = ['Easy', 'Medium', 'Hard'];

  const [shapes, setShapes] = useState(defaultShapes);
  const [settingsData, setSettingsData] = useState({
    selectedShape: selectedShape || defaultShapes[0],
    experimentLength: 60,
    isColorBlind: '',
    blinkDelay: 1,
    difficultyLevel: defaultDifficultyLevels[0],
    color1: '#ff0000', // Default color 1
    color2: '#00ff00', // Default color 2
    color3: '#0000ff', // Default color 3
    color4: '#ffff00', // Default color 4
  });

  const navigate = useNavigate();
  const location = useLocation();
  const patientData = location.state && location.state.patientData;
  const patientId = location.state && location.state.patientId;




  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setSettingsData((prevSettingsData) => ({
      ...prevSettingsData,
      [name]: name === 'isColorBlind' ? value : type === 'checkbox' ? checked : value,
    }));
  };

  const handleSaveChanges = async () => {
    console.log('Handling save changes...');

    let savedData = {
      shape: settingsData.selectedShape,
      experimentLength: settingsData.experimentLength,
      isColorBlind: settingsData.isColorBlind,
      blinkDelay: settingsData.blinkDelay,
      difficultyLevel: settingsData.difficultyLevel,
      color1: settingsData.color1,
      color2: settingsData.color2,
      color3: settingsData.color3,
      color4: settingsData.color4,
    };


    if (
        (settingsData.difficultyLevel === 'Hard' && settingsData.isColorBlind !== 'colorBlind') ||
        (settingsData.difficultyLevel === 'Medium' && settingsData.isColorBlind === 'coloBlind')
    ) {
      savedData = { ...savedData, shape: '' };
    }

    console.log('Saved data:', savedData);
    console.log('patient data:', patientData);



    // Check if patient data is available
    if (patientId) {
      try {
        console.log('Saving settings data...');

        // Save settings data to the server
        const savedSettingsData = await saveSettingsData(patientId, savedData);

        // Redirect to the experiment page with patient and settings data
        navigate('/ReactiontimeExperiment', { state: { patientData, settingsId: savedSettingsData.id, settingsData: savedSettingsData } });
        console.log('PatientData inside Api response:', location.state.patientData);
      } catch (error) {
        console.error('Error saving settings data:', error);
        // Handle error as needed
      }
    } else {
      // If patient data is null, allow the user to proceed with the experiment
      navigate('/ReactiontimeExperiment', { state: { settingsData: savedData } });
      console.log('Form submitted without patient data');
    }
  };



  return (
      <div className="experiment-settings-container">
        <h2 className="title-settings">Experiment Settings</h2>
        <div className="experiment-settings-form">
          <div className="form-group">
            <label>Select Shape:</label>
            <select
                className="form-control"
                name="selectedShape"
                value={settingsData.selectedShape}
                onChange={handleChange}
                disabled={settingsData.difficultyLevel === 'Hard'}
            >
              {shapes.map((shapeOption) => (
                  <option key={shapeOption} value={shapeOption}>
                    {shapeOption}
                  </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Experiment Duration (seconds):</label>
            <input
                type="number"
                className="form-control"
                name="experimentLength"
                value={settingsData.experimentLength}
                onChange={handleChange}
                min="1"
            />
          </div>
          <div className="form-group">
            <label>Blink Delay (seconds):</label>
            <input
                type="number"
                className="form-control"
                name="blinkDelay"
                value={settingsData.blinkDelay}
                onChange={handleChange}
                min="1"
            />
          </div>
          <div className="form-group">
            <label>Color Vision:</label>
            <select
                className="form-control"
                name="isColorBlind"
                value={settingsData.isColorBlind}
                onChange={handleChange}
            >
              <option value="normal">Normal</option>
              <option value="colorBlind">Color Blind</option>
            </select>
          </div>
          <div className="form-group">
            <label>Difficulty Level:</label>
            <select
                className="form-control"
                name="difficultyLevel"
                value={settingsData.difficultyLevel}
                onChange={handleChange}
            >
              {defaultDifficultyLevels.map((level) => (
                  // Disable the "Hard" difficulty level if color blindness is selected
                  <option key={level} value={level} disabled={settingsData.isColorBlind === 'colorBlind' && level === 'Hard'}>
                    {level}
                  </option>
              ))}
            </select>
          </div>
          {settingsData.difficultyLevel === 'Easy' && settingsData.isColorBlind !== 'colorBlind' && (
              <>
                <div className="form-group">
                  <label>Color 1:</label>
                  <input
                      type="color"
                      className="form-control"
                      name="color1"
                      value={settingsData.color1}
                      onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label>Color 2:</label>
                  <input
                      type="color"
                      className="form-control"
                      name="color2"
                      value={settingsData.color2}
                      onChange={handleChange}
                  />
                </div>
              </>
          )}
          {settingsData.difficultyLevel === 'Medium' && settingsData.isColorBlind !== 'colorBlind' && (
              <>
                <div className="form-group">
                  <label>Color 1:</label>
                  <input
                      type="color"
                      className="form-control"
                      name="color1"
                      value={settingsData.color1}
                      onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label>Color 2:</label>
                  <input
                      type="color"
                      className="form-control"
                      name="color2"
                      value={settingsData.color2}
                      onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label>Color 3:</label>
                  <input
                      type="color"
                      className="form-control"
                      name="color3"
                      value={settingsData.color3}
                      onChange={handleChange}
                  />
                </div>
              </>
          )}
          {settingsData.difficultyLevel === 'Hard' && (
              <>
                <div className="form-group">
                  <label>Color 1:</label>
                  <input
                      type="color"
                      className="form-control"
                      name="color1"
                      value={settingsData.color1}
                      onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label>Color 2:</label>
                  <input
                      type="color"
                      className="form-control"
                      name="color2"
                      value={settingsData.color2}
                      onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label>Color 3:</label>
                  <input
                      type="color"
                      className="form-control"
                      name="color3"
                      value={settingsData.color3}
                      onChange={handleChange}
                  />
                </div>
              </>
          )}
          <div className="btn-settings">
            <button className="btn btn-primary" onClick={handleSaveChanges}>
              Save Changes
            </button>
          </div>
        </div>
      </div>
  );
};

export default SettingsPage;
