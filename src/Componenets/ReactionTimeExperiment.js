import React, {useState, useEffect, useRef} from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import '../style/ReactionTimeExperiment.css';
import {useNavigate} from 'react-router-dom';
import {useLocation} from 'react-router-dom';
import InfoBox from "./InfoBox";
import {saveExperimentResults} from '../Api/Api'; // Import the savePatientData function
import RedoExperimentModal from './RedoExperimentModal'
import {formatTime, saveToFile, calculateAverageReactionTime} from '../utils/ExperimentUtils';
import Navbar from "./Navbar";
import '@fortawesome/fontawesome-free/css/all.css';
import ntc from "ntc";
import {Modal} from "react-bootstrap";



const ReactionTimeExperiment = () => {
    // State variables for the experiment
    const [shape, setShape] = useState("circle");
    const [backgroundColor, setBackgroundColor] = useState("white");
    const [userResponse, setUserResponse] = useState("");
    const [isWaiting, setIsWaiting] = useState(true);
    const [startTime, setStartTime] = useState(0);
    const [reactionTimes, setReactionTimes] = useState([]);
    const [experimentStarted, setExperimentStarted] = useState(false);
    const [timeRemaining, setTimeRemaining] = useState(60);
    const [experimentLength, setExperimentLength] = useState(60);
    const [lastReactionTime, setLastReactionTime] = useState(0);
    const [blinkDelay, setBlinkDelay] = useState(1); // Default to 0 seconds
    const target = useRef(null);
    const [showSaveButton, setShowSaveButton] = useState(false);
    const [spacebarEnabled, setSpacebarEnabled] = useState(true);
    const [isColorBlind, setIsColorBlind] = useState("");
    const [selectedColors, setSelectedColors] = useState({richtigColor: 'red', falschColor: 'green'});
    const shapes = ['circle', 'square', 'rectangle'];
    const [showRedoModal, setShowRedoModal] = useState(false);
    const [intervalId, setIntervalId] = useState(null); // New state variable to store the interval ID
    const navigate = useNavigate();
    const location = useLocation();
    const {state} = location;
    const patientData = state?.patientData || null;
    const settingsData = state?.settingsData || null;
    const settingsId = state?.settingsId || null;
    const [experimentSettings, setExperimentSettings] = useState({

    }); // State variables for experiment settings and patient information
    const [patientInfo, setPatientInfo] = useState({
        fullname: '',
        birthDate: new Date(),
        age: '',
        strongHand: 'Right',
        hasDiseases: false,
        diseases: '',
        expDate: '',
    });
    const [showInfoBox, setShowInfoBox] = useState(false);
    const [showModal, setShowModal] = useState(false);






    useEffect(() => {
        if (location.state && location.state.showModal) {
            setShowModal(true);
        }
    }, [location.state]);




    const handleCloseModal = () => setShowModal(false)





    // Function to clear the text content of the target element
    const clearTargetText = () => {
        if (target.current) {
            target.current.textContent = "";
        }
    };

    // Function to apply experiment settings 
    const applyExperimentSettings = () => {
        setShape(settingsData.shape);
        setExperimentLength(settingsData.experimentLength);
        setIsColorBlind(settingsData.isColorBlind);
        setBlinkDelay(settingsData.blinkDelay);

        // Check if difficulty level is easy, and update the selected colors
        if (settingsData.difficultyLevel === 'Easy') {
            setSelectedColors({ richtigColor: settingsData.color1, falschColor: settingsData.color2 });
        } else if (settingsData.difficultyLevel === 'Medium') {
            setSelectedColors({
                richtigColor: settingsData.color1,
                falschColor: settingsData.color2,
                color2: settingsData.color3,
            });
        } else if (settingsData.difficultyLevel === 'Hard') {
            setSelectedColors({
                richtigColor: settingsData.color1,
                falschColor: settingsData.color2,
                color2: settingsData.color3,
            });
        }
    };

    // Function to generate a random color based on color blindness setting or selected colors
    const generateRandomColor = () => {
        const randomNumber = Math.random();
        const newShape = shapes[Math.floor(Math.random() * shapes.length)];

        if (!settingsData) {
            // Handle the case where settingsData is null or undefined (dummy experiment)
            return randomNumber < 0.5 ? selectedColors.richtigColor = 'red' : selectedColors.falschColor = 'green';
        }
        // Color generation for the experiment levels
        if (isColorBlind && settingsData.difficultyLevel === 'Easy') {
            return randomNumber < 0.5 ? 'blue' : 'yellow';
        } else if (isColorBlind && settingsData.difficultyLevel === 'Medium') {
            setShape(newShape);
            return randomNumber < 0.5 ? 'blue' : 'yellow';
        } else {
            if (settingsData.difficultyLevel === 'Easy') {
                return randomNumber < 0.5 ? selectedColors.richtigColor : selectedColors.falschColor;
            } else if (settingsData.difficultyLevel === 'Medium') {
                const selectedColorOptions = [selectedColors.richtigColor, selectedColors.falschColor, selectedColors.color2];
                return selectedColorOptions[Math.floor(Math.random() * selectedColorOptions.length)];
            } else if (settingsData.difficultyLevel === 'Hard') {
                const selectedColorOptions = [selectedColors.richtigColor, selectedColors.falschColor, selectedColors.color2];
                setShape(newShape);
                return selectedColorOptions[Math.floor(Math.random() * selectedColorOptions.length)];
            }
        }
    };


    // Function to show the redo modal
    const showRedoExperimentModal = () => {
        console.log("Showing Redo Modal");
        setShowRedoModal(true);
    };

    const handleRedoExperiment = () => {
        // Reset experiment-related state variables
        resetExperiment()

        // Close the modal
        setShowRedoModal(false);

        // Clear the interval when redoing the experiment
        if (intervalId) {
            clearInterval(intervalId);
            setIntervalId(null);
        }
    };


    // Function to reset experiment-related state variables
    const resetExperiment = () => {
        setReactionTimes([]);
        setLastReactionTime(0);
        setShowSaveButton(false);
        setExperimentStarted(false);
        setShowSaveButton(false);
        setBackgroundColor("white");
        setTimeRemaining(experimentLength); // Set time remaining to experiment length

    };

    // Function to start a new experiment
    const startNewExperiment = () => {
        setIsWaiting(true);
        clearTargetText();
        setSpacebarEnabled(true);

        const fadeDuration = 200;

        setBackgroundColor("transparent"); // Set a transparent color for transition

        setTimeout(() => {
            setBackgroundColor(() => {
                const newColor = generateRandomColor();
                setStartTime(performance.now());
                setIsWaiting(false);
                return newColor;
            });
        }, fadeDuration);
    };

    // Effect to show save button when a reaction time is recorded
    useEffect(() => {
        if (lastReactionTime !== 0) {
            setShowSaveButton(true);
        }
    }, [lastReactionTime]);

    // Function to handle the start of the experiment
    const handleStartExperiment = () => {
        setExperimentStarted(true);
        setTimeRemaining(experimentLength);

        const id = setInterval(() => {
            setTimeRemaining((prevTime) => {
                if (prevTime > 0) {
                    return prevTime - 1;
                } else {
                    setExperimentStarted(false);
                    setSpacebarEnabled(false);
                    setBackgroundColor("white");
                    clearInterval(id); // Clear the interval when the time is up
                    return 0;
                }
            });
        }, 1000);

        setIntervalId(id); // Save the interval ID to the state

        startNewExperiment();
    };

    // update infoBox Data (we can delete this if we decide to delete the info box from the experiment page)
    useEffect(() => {
        if (patientData) {
            setPatientInfo({
                fullname: patientData.fullname || '',
                birthDate: patientData.birthDate || '',
                age: patientData.age || '',
                strongHand: patientData.strongHand || 'Right',
                hasDiseases: patientData.hasDiseases || '',
                diseases: patientData.diseases || '',
                expDate: patientData.expDate || '',
            });
        }

        console.log('settingsData:', settingsData);

        if (settingsData) {
            setExperimentSettings({
                shape: settingsData.shape || 'circle',
                experimentLength: settingsData.experimentLength || 60,
                isColorBlind: settingsData.isColorBlind || '',
                blinkDelay: settingsData.blinkDelay || 1,
                difficultyLevel: settingsData.difficultyLevel || 'Easy',
            });
        }
    }, [patientData, settingsData]);


    /* is responsible for applying experiment settings when the settingsData changes,
    ensuring that the component responds to updates in the settingsData prop and applies
    the corresponding side effect.*/
    useEffect(() => {
        if (settingsData) {
            applyExperimentSettings();
        }
    }, [settingsData]);


    // Function to handle saving results
    const handleSaveResults = async () => {
        setShowSaveButton(false);

        // Calculate average reaction time for "correct" and "incorrect" tries
        const correctTimes = reactionTimes.filter((entry) => entry.status.includes("correct"));
        const incorrectTimes = reactionTimes.filter((entry) => entry.status.includes("incorrect"));
        const averageCorrectTime = calculateAverageReactionTime(correctTimes);
        const averageIncorrectTime = calculateAverageReactionTime(incorrectTimes);
        const age = patientData?.age;
        const expDate = patientData?.expDate


        // Combine experiment settings, patient info, and reaction times
        const resultData = {
            experimentSettings: {
                shape,
                experimentLength,
                isColorBlind,
                blinkDelay,
                difficultyLevel: experimentSettings.difficultyLevel,
            },
            patientInfo: {
                ...patientInfo,
                birthDate: patientInfo.birthDate,
                age,
                expDate,

            },
            reactionTimes,
            averageReactionTimes: {
                correct: averageCorrectTime,
                incorrect: averageIncorrectTime,
            },
        };

        const payload = {
            reactionTimes,
            averageReactionTimes: {
                correct: averageCorrectTime,
                incorrect: averageIncorrectTime,
            },
        };


        console.log('Payload:', resultData.averageReactionTimes);
        console.log('settingsId:', settingsId);


        // Check if patient data is available
        if (settingsId) {
            try {
                console.log('Saving settings data...');

                // Save settings data to the server
                const savedExperiment = await saveExperimentResults(settingsId, payload);

                // Save experimentDataId to localStorage
                localStorage.setItem('experimentDataId', savedExperiment.id);

                navigate('/results', {state: {resultData}});

                console.log('the experiment ', savedExperiment.id);

            } catch (error) {
                console.error('Error saving settings data:', error);
                // Handle error as needed
                navigate('/results', {state: {resultData}});
            }
        }

        // Log the result data to the console
        console.log('Result Data:', resultData);

        // Save the resultData to a file
        //saveToFile(resultData);



        // Reset experiment-related state variables
        resetExperiment();
    };


    // Function to handle a click on the experiment bar
    const handleBarClick = () => {
        if (!isWaiting && timeRemaining > 0) {
            const endTime = performance.now();
            const reactionTime = endTime - startTime;

            setLastReactionTime(reactionTime);

            const isResponseCorrect = backgroundColor === (isColorBlind ? "blue" : selectedColors.richtigColor);

            let status;
            if (isResponseCorrect) {
                status = `correct`;
            } else if (backgroundColor === (isColorBlind ? "yellow" : selectedColors.falschColor)) {
                status = `incorrect`;
            } else if (backgroundColor === selectedColors.color2) {
                // Add condition for the third color in the medium difficulty level
                status = `incorrect`;
            } else {
                status = `incorrect`;
            }

            setBackgroundColor("white");

            setUserResponse(status);

            setReactionTimes((prevReactionTimes) => [
                ...prevReactionTimes,
                {time: reactionTime, status},
            ]);

            setTimeout(() => {
                setUserResponse("");
                startNewExperiment();
            }, 1000);
        }
    };
    // Effect to handle keydown events for spacebar
    useEffect(() => {
        const handleKeyDown = (event) => {
            if (spacebarEnabled && event.key === ' ') {
                event.preventDefault();
                handleBarClick();
            }
        };

        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [spacebarEnabled, startTime, backgroundColor, timeRemaining]);

    // Effect to check conditions and start a new experiment if needed
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (!isWaiting && backgroundColor === (isColorBlind ? "yellow" : selectedColors.falschColor)) {
                startNewExperiment();
            } else if (!isWaiting && backgroundColor === (isColorBlind ? "blue" : selectedColors.richtigColor) && lastReactionTime === 0 && timeRemaining > 0) {
                setShowSaveButton(true);
            } else if (!isWaiting && timeRemaining === 0) {
                // If time is up, reset experiment-related state variables and ensure the background color is white
                setBackgroundColor("white");
            }
        }, 1000);

        return () => {
            clearTimeout(timeoutId);
        };
    }, [isWaiting, backgroundColor, lastReactionTime, timeRemaining]);


    // Effect to check conditions and show redo modal if needed
    useEffect(() => {
        let timeoutId;

        const showRedoModalAfterDelay = () => {
            timeoutId = setTimeout(() => {
                showRedoExperimentModal();
            }, 10000);
        };

        // Define the color for which you want to show the redo modal
        const definedColor = selectedColors.richtigColor;

        // Reset the timeout only when the background color matches the defined color
        if (!isWaiting && backgroundColor === definedColor) {
            clearTimeout(timeoutId);
            showRedoModalAfterDelay();
        }

        return () => {
            clearTimeout(timeoutId);
        };
    }, [isWaiting, backgroundColor, selectedColors.richtigColor]);


    // Render the component
    return (
        <div className="container-fluid">
            <Navbar/>
            { settingsData !== null ? (
            <div className="container">
                {/* Experiment container */}
                <div className="experiment-container">
                    {/* Shape container */}
                    <div className={`shape-container ${shape}`} style={{backgroundColor}} onClick={handleBarClick}>
                        <div ref={target}></div>
                    </div>

                    {/* Save button */}
                    <div className="button-container">
                        {showSaveButton && (
                            <button className="btn btn-success" onClick={handleSaveResults}>
                                Save Results
                            </button>
                        )}
                    </div>

                    {/* Countdown container */}
                    {experimentStarted && (
                        <div className="countdown-container">
                            <div className="experiment-status-box">
                                <p className="experiment-status">Experiment in Progress - Time
                                    Remaining: {formatTime(timeRemaining)}</p>
                            </div>
                        </div>
                    )}

                    {/* Start experiment button */}
                    <div className="button-container">
                        {!experimentStarted && (
                            <button className="btn btn-primary" onClick={handleStartExperiment}>
                                Start Experiment
                            </button>
                        )}
                    </div>



                    {/* Toggle Info Box button with icon */}
                    <div className="button-container">
                        <button className="btn btn-info" onClick={() => setShowInfoBox(!showInfoBox)}>
                            <i className={`fas ${showInfoBox ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                        </button>
                    </div>

                    {/* Display patient info and experiment settings based on visibility state */}
                    {showInfoBox && (
                        <InfoBox patientInfo={patientData?.fullname ? patientInfo : {}} experimentSettings={experimentSettings} />
                    )}
                    {/* Render the RedoExperimentModal */}
                    <RedoExperimentModal show={showRedoModal} onHide={() => setShowRedoModal(false)}
                                         onRedo={handleRedoExperiment}/>
                </div>
            </div> ) :  <div className="container-fluid">
                <h1> Please set the experiment settings first </h1>
            </div>
            }
        </div>
    );
};
export default ReactionTimeExperiment;


