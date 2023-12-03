// src/SettingsPage.js
import React, {useState} from 'react';
import {useNavigate, useLocation} from 'react-router-dom';
import {saveSettingsData} from '../Api/Api';
import '../style/SettingsPage.css';
import Navbar from "../Componenets/Navbar";
import {Modal} from "react-bootstrap";
import ntc from "ntc";


const DemoSettings = ({selectedShape}) => {
    const defaultShapes = ['circle', 'square', 'rectangle'];
    const defaultDifficultyLevels = ['Easy', 'Medium', 'Hard'];
    const defaultExperiments = ['Reaction Time'];


    const [shapes, setShapes] = useState(defaultShapes);
    const [experiments, setExperiments] = useState(defaultExperiments);
    const [settingsData, setSettingsData] = useState({
        selectedShape: selectedShape || defaultShapes[0],
        experimentLength: 60,
        isColorBlind: '',
        blinkDelay: 1,
        difficultyLevel: defaultDifficultyLevels[0],
        color1: '#ff0000', // Default color 1
        color2: '#00ff00', // Default color 2
        color3: '#0000ff', // Default color 3
    });

    const navigate = useNavigate();
    const location = useLocation();
    const patientData = location.state && location.state.patientData;
    const [showModal, setShowModal] = useState(false);



    const getColorName = () => {
        const colorName = ntc.name(settingsData.color1);
        return colorName[1]; // colorName is an array, and the name is at index 1
    };




    const handleSaveSettings = () =>{

        if (settingsData.color1 === settingsData.color2 && settingsData.difficultyLevel === 'Easy') {
            // Show an error message (you can implement your own way to display errors)
            alert("Please choose different colors for color1, color2.");
            return; // Do not proceed with saving settings and navigating
        } else if (settingsData.color1 === settingsData.color2 && settingsData.color1 === settingsData.color3 && settingsData.difficultyLevel === 'Medium' || settingsData.difficultyLevel === 'Hard') {
            alert("Please choose different colors for color1, color2 and color3.");

        }

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
        };


        if (
            (settingsData.difficultyLevel === 'Hard' && settingsData.isColorBlind !== 'colorBlind') ||
            (settingsData.difficultyLevel === 'Medium' && settingsData.isColorBlind === 'coloBlind')
        ) {
            savedData = {...savedData, shape: ''};
        }

        console.log('Saved data:', savedData);
        console.log('patient data:', patientData);


        // Check if patient data is available
        if (patientData) {
            console.log('Saving settings data...');

            // Save settings data to the server

            // Redirect to the experiment page with patient and settings data
            navigate('/demo-experiment', {
                state: {
                    patientData,
                    settingsData: savedData
                }
            });

        } else {
            // If patient data is null, allow the user to proceed with the experiment
            navigate('/demo-experiment', {state: {settingsData: savedData}});
            console.log('Form submitted without patient data');
        }
        setShowModal(false);
    }
    const handleShowModal = () => setShowModal(true);
    const handleCloseModal = () => setShowModal(false)







    const handleChange = (e) => {
        const {name, value, type, checked} = e.target;

        setSettingsData((prevSettingsData) => ({
            ...prevSettingsData,
            [name]: name === 'isColorBlind' ? value : type === 'checkbox' ? checked : value,
        }));
    };




    return (
        <div className="experiment-settings-container">
            <Navbar/>
            <h2 className="title-settings">Experiment Settings</h2>
            <div className="experiment-settings-form">
                <div className="form-group">
                    <label>Select Experiment:</label>
                    <select
                        className="form-control"
                        name="selectedShape"
                        value={settingsData.selectedExperiment}
                    >
                        <option value="Reaction Time" disabled>Select Experiment</option>
                        {experiments.map((experimentOption) => (
                            <option key={experimentOption} value={experimentOption}>
                                {experimentOption}
                            </option>
                        ))}
                    </select>
                </div>
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
                            <option key={level} value={level}
                                    disabled={settingsData.isColorBlind === 'colorBlind' && level === 'Hard'}>
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
                    <button className="btn btn-primary" onClick={handleShowModal}>
                        Save Changes
                    </button>
                </div>
                <Modal show={showModal}  onHide={handleCloseModal} centered>
                    <Modal.Header closeButton>
                        <Modal.Title>Notice</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p>
                            {`When you see the color `}
                            <strong>{`${getColorName()}`}</strong>
                            {` (color 1) please click on the space bar`}
                        </p>
                    </Modal.Body>
                    <Modal.Footer>
                        <button className="btn btn-primary" onClick={handleSaveSettings}>
                            OK, Saved
                        </button>
                    </Modal.Footer>
                </Modal>
            </div>
        </div>
    );
};

export default DemoSettings;
