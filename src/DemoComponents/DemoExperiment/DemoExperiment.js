import React, {useState, useEffect, useRef, useCallback} from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../style/ReactionTimeExperiment.css';
import {useNavigate} from 'react-router-dom';
import {useLocation} from 'react-router-dom';
import {formatTime, calculateAverageReactionTime} from '../../utils/ExperimentUtils';
import '@fortawesome/fontawesome-free/css/all.css';
import {v4 as uuidv4} from "uuid";
import InstructionBox from "./DemoRenderInstructionsBox";
import RenderResultsModal from "../../Components/Experiment/ReactionTimes/RenderResultsModal";
import RedoExperimentModal from "../../Components/Experiment/ReactionTimes/RedoExperimentModal";
import Navbar from "../../Components/Navbar/Navbar";



const DemoExperiment = () => {
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
    const [experimentCountdown, setExperimentCountdown] = useState(3);
    const [intervalId, setIntervalId] = useState(null); // New state variable to store the interval ID
    const [countdownRunning, setCountdownRunning] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const {state} = location;
    const patientData = state && state.patientData  || null;;
    const settingsData = state?.settingsData || null;
    const sessionLength = state?.sessionLength || null;
    const showInstructionBoxButton = state?.showInstructionBoxButton || null;
    const [experimentSettings, setExperimentSettings] = useState({
        shape: "circle", experimentLength: 60, isColorBlind: '', blinkDelay: 1, difficultyLevel: 'Easy',
    }); // State variables for experiment settings and patient information


    // New state variable for session countdown
    const [sessionCountdown, setSessionCountdown] = useState(sessionLength ?? 180);
    const [allAttempts, setAllAttempts] = useState([]);
    const [experimentData, setExperimentData] = useState({});
    const [experimentId, setExperimentId] = useState(""); // State variable to store the experiment ID
    const currentExperimentDataRef = useRef([]);
    const [tablesVisible, setTablesVisible] = useState(false);
    const [showContentBox, setShowContentBox] = useState(false);
    const [experimentInstructionsBoxVisible, setExperimentInstructionsBoxVisible] = useState(false);
    const [isSpacebarPressed, setIsSpacebarPressed] = useState(false);


    // Function to clear the text content of the target element
    const clearTargetText = () => {
        if (target.current) {
            target.current.textContent = "";
        }
    };

    // Function to toggle the content box
    const toggleContentBox = () => {
        // Lazy load the ExperimentInstructionsBox when the button is clicked
        setExperimentInstructionsBoxVisible(!experimentInstructionsBoxVisible);
    };

    const handleToggleClick = () => {
        console.log('Button clicked!');
        setTablesVisible(!tablesVisible);
    };




    // Function to apply experiment settings
    const applyExperimentSettings = (settingsData) => {


        setShape(settingsData.shape);
        setExperimentLength(settingsData.experimentLength);
        setIsColorBlind(settingsData.isColorBlind);
        setBlinkDelay(settingsData.blinkDelay);

        // Check if difficulty level is easy, and update the selected colors
        if (settingsData.difficultyLevel === 'Easy') {
            setSelectedColors({richtigColor: settingsData.color1, falschColor: settingsData.color2});
        } else if (settingsData.difficultyLevel === 'Medium') {
            setSelectedColors({
                richtigColor: settingsData.color1, falschColor: settingsData.color2, color2: settingsData.color3,
            });
        } else if (settingsData.difficultyLevel === 'Hard') {
            setSelectedColors({
                richtigColor: settingsData.color1, falschColor: settingsData.color2, color2: settingsData.color3,
            });
        }

    };

    // Function to generate a random color based on color blindness setting or selected colors
    const generateRandomColor = () => {
        const randomNumber = Math.random();
        const newShape = shapes[Math.floor(Math.random() * shapes.length)];

        if (!settingsData) {
            // Handle the case where settingsData is null or undefined (dummy experiment)
            const probabilityRichtig = 0.6; // Adjust this value to control the probability of 'richtigColor'
            return randomNumber < probabilityRichtig ? selectedColors.richtigColor : selectedColors.falschColor;
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
                const selectedColorOptions = [selectedColors.richtigColor, selectedColors.falschColor, selectedColors.color3];
                return selectedColorOptions[Math.floor(Math.random() * selectedColorOptions.length)];
            } else if (settingsData.difficultyLevel === 'Hard') {
                const selectedColorOptions = [selectedColors.richtigColor, selectedColors.falschColor, selectedColors.color3];
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
        setTimeRemaining(experimentLength);
        setAllAttempts([]); // Clear all attempts
    };

    // Function to start a new experiment
    const startNewExperiment = () => {
        setIsWaiting(true);
        clearTargetText();
        setSpacebarEnabled(true);

        setBackgroundColor("transparent"); // Set a transparent color for transition

        requestAnimationFrame(() => {
            setBackgroundColor(() => {
                const newColor = generateRandomColor();
                setStartTime(performance.now().toFixed(2));
                setIsWaiting(false);
                return newColor;
            });
        });
    };

    /* is responsible for applying experiment settings when the settingsData changes,
       ensuring that the component responds to updates in the settingsData prop and applies
       the corresponding side effect.*/
    useEffect(() => {
        if (settingsData) {
            applyExperimentSettings(settingsData);
        }
    }, [settingsData]);





    // Effect to update main experimentData when the current experiment is completed
    useEffect(() => {
        if (experimentId && lastReactionTime > 0) {
            setExperimentData((prevData) => {
                const updatedData = { ...prevData, [experimentId]: currentExperimentDataRef.current };
                console.log("Experiment Data: ", updatedData);
                return updatedData;
            });

        }
    }, [experimentId, lastReactionTime]);




    const handleStartExperiment = () => {
        setExperimentStarted(true);
        setTimeRemaining(experimentLength);

        const newExperimentId = uuidv4();
        setExperimentId(newExperimentId);
        currentExperimentDataRef.current = []; // Reset data for the new experiment

        const id = setInterval(() => {
            setTimeRemaining((prevTime) => {
                if (prevTime > 0) {
                    return prevTime - 1;
                } else {
                    setExperimentStarted(false);
                    setSpacebarEnabled(false);
                    setBackgroundColor("white");
                    clearInterval(id); // Clear the interval when the time is up

                    // Save the data for the current experiment
                    setExperimentData((prevData) => {
                        const updatedData = {
                            ...prevData,
                            [newExperimentId]: currentExperimentDataRef.current,
                        };
                        console.log("Experiment Data: ", updatedData);
                        return updatedData;
                    });

                    return 0;
                }
            });
        }, 1000);

        setIntervalId(id); // Save the interval ID to the state
        startNewExperiment();
    };

    // Function to handle a click on the experiment bar
    const handleBarClick = useCallback(() => {
        if (!isWaiting && timeRemaining > 0) {
            const endTime = performance.now().toFixed(2);
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
                status = `No Reaction`;
            }

            setBackgroundColor("white");
            setUserResponse(status);
            setReactionTimes((prevReactionTimes) => [...prevReactionTimes, {time: reactionTime, status},]);
            currentExperimentDataRef.current.push({time: reactionTime, status});

            setTimeout(() => {
                setUserResponse("");
                startNewExperiment();


            }, 1000);
        }
    }, [isWaiting, timeRemaining]);

    const handleResultsPage = ( ) => {

        const resultData = {
            experimentSettings: {
                shape,
                experimentLength,
                isColorBlind,
                blinkDelay,
                difficultyLevel: experimentSettings.difficultyLevel,
            },
            patientInfo: {
                fullname: patientData?.fullname || null,
                birthDate: patientData?.birthDate || null,
                age: patientData?.age || null,
                strongHand: patientData?.strongHand || null,
                groupe: patientData?.groupe || null,
                hasDiseases: patientData?.hasDiseases || null,
                diseases: patientData?.diseases || null,
            },
            experiments: {},
        };

        Object.keys(experimentData).forEach((experimentId) => {
            const data = experimentData[experimentId];

            // Calculate average reaction time for "correct" and "incorrect" tries
            const correctTimes = data.filter((entry) => entry.status === 'correct');
            const incorrectTimes = data.filter((entry) => entry.status === 'incorrect');

            const averageReactionTimes = {
                correct: calculateAverageReactionTime(correctTimes),
                incorrect: calculateAverageReactionTime(incorrectTimes),
            };

            // Add the calculated averages to the experiment data
            resultData.experiments[experimentId] = {
                reactionTimes: data,
                averageReactionTimes,
            };
        });

        navigate("/demo-results", { state: { resultData } });
    }

    const handleSaveResults = () => {
        setShowSaveButton(false);


        // Combine experiment settings, patient info, and reaction times
        // Assuming experimentData is an object where each key is an experiment ID
        const resultData = {
            experimentSettings: {
                shape,
                experimentLength,
                isColorBlind,
                blinkDelay,
                difficultyLevel: experimentSettings.difficultyLevel,
            },
            patientInfo: {
                fullname: patientData?.fullname || null,
                birthDate: patientData?.birthDate || null,
                age: patientData?.age || null,
                strongHand: patientData?.strongHand || null,
                groupe: patientData?.groupe || null,
                hasDiseases: patientData?.hasDiseases || null,
                diseases: patientData?.diseases || null,
            },
            experiments: {},
        };

        Object.keys(experimentData).forEach((experimentId) => {
            const data = experimentData[experimentId];

            // Calculate average reaction time for "correct" and "incorrect" tries
            const correctTimes = data.filter((entry) => entry.status === 'correct');
            const incorrectTimes = data.filter((entry) => entry.status === 'incorrect');

            const averageReactionTimes = {
                correct: calculateAverageReactionTime(correctTimes),
                incorrect: calculateAverageReactionTime(incorrectTimes),
            };

            // Add the calculated averages to the experiment data
            resultData.experiments[experimentId] = {
                reactionTimes: data,
                averageReactionTimes,
            };
        });




        console.log('Payload:', resultData);

        // Navigate to the results page with the calculated resultData
        navigate('/demo-results', { state: { resultData } });

        // Reset experiment-related state variables
        resetExperiment();
    };

    // Effect to handle keydown events for spacebar
    const handleKeyDown = useCallback((event) => {
        if (spacebarEnabled && event.key === ' ') {
            event.preventDefault();
            setIsSpacebarPressed(true);
        }
    }, [spacebarEnabled]);

    useEffect(() => {
        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [handleKeyDown]);

    useEffect(() => {
        if (isSpacebarPressed) {
            handleBarClick();
            setIsSpacebarPressed(false); // Reset the state
        }
    }, [isSpacebarPressed, handleBarClick]);

    // Effect to check conditions and start a new experiment if needed
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (!isWaiting && (backgroundColor === (isColorBlind ? "yellow" : selectedColors.falschColor) ||  backgroundColor ===  selectedColors.color3)) {
                startNewExperiment();
            } else if (timeRemaining === 0 && !isWaiting && userResponse !== "correct" && userResponse !== "incorrect" && userResponse !== "No Reaction") {
                setBackgroundColor("white");
            }
        }, 500);

        return () => {
            clearTimeout(timeoutId);
        };
    }, [isWaiting, backgroundColor, lastReactionTime, timeRemaining, startNewExperiment, setShowSaveButton, userResponse]);


    // Function to start the experiment countdown
    const startExperimentCountdown = useCallback(() => {
        setExperimentCountdown(3);

        const countdownInterval = setInterval(() => {
            setExperimentCountdown((prevCountdown) => {
                if (prevCountdown > 1) {
                    return prevCountdown - 1;
                } else {
                    clearInterval(countdownInterval);
                    // Start the actual experiment when the countdown reaches 1
                    handleStartExperiment();
                    return 0;
                }
            });
        }, 1000);
    }, [handleStartExperiment]);

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


    // Effect to update session countdown
    useEffect(() => {
        let intervalId;

        // Start the countdown when the component is mounted
        if (countdownRunning) {
            intervalId = setInterval(() => {
                setSessionCountdown((prevCountdown) => {
                    if (prevCountdown > 0) {
                        return prevCountdown - 1;
                    } else {
                        setCountdownRunning(false);  // Stop the countdown when it reaches 0
                        return 0;
                    }
                });
            }, 1000);
        }

        return () => clearInterval(intervalId);
    }, [countdownRunning, sessionCountdown]);


    const calculateAverages = () => {
        const averages = {};

        Object.entries(experimentData).forEach(([experimentId, data]) => {
            const correctTimes = data.filter((entry) => entry.status === "correct");
            const incorrectTimes = data.filter((entry) => entry.status === "incorrect");

            const averageCorrectTime = calculateAverageReactionTime(correctTimes);
            const averageIncorrectTime = calculateAverageReactionTime(incorrectTimes);

            averages[experimentId] = {
                correct: averageCorrectTime,
                incorrect: averageIncorrectTime,
            };
        });

        return averages;
    };


    const handleToggleCountdown = () => {
        setCountdownRunning((prev) => !prev);
    };


    let sessionCountdownContent;
    if (sessionCountdown <= 0 && !countdownRunning) {
        sessionCountdownContent = 'Terminated';
    } else if (sessionCountdown === sessionLength) {
        sessionCountdownContent = 'Start session';
    } else if (sessionCountdown > 0 && countdownRunning) {
        sessionCountdownContent = formatTime(sessionCountdown);
    } else if (sessionCountdown < sessionLength && !countdownRunning) {
        sessionCountdownContent = `Resume ${formatTime(sessionCountdown)}`;
    }


    // Function to render the experiment countdown content
    const renderExperimentCountdown = () => {
        if (experimentCountdown > 0) {
            return `Experiment Starts in ${experimentCountdown}`;
        } else if (timeRemaining === 0) {
            return 'Terminated';
        }
        return null;
    };

    // Function to render the session countdown content
    const renderSessionCountdown = () => {
        if (sessionCountdown <= 0 && !countdownRunning) {
            return 'Terminated';
        } else if (sessionCountdown === sessionLength) {
            return 'Start session';
        } else if (sessionCountdown > 0 && countdownRunning) {
            return formatTime(sessionCountdown);
        } else if (sessionCountdown < sessionLength && !countdownRunning) {
            return `Resume ${formatTime(sessionCountdown)}`;
        }
        return null;
    };

    // Function to render the start experiment button
    const renderStartExperimentButton = () => (
        <button
            className="btn btn-primary"
            onClick={startExperimentCountdown}
            disabled={sessionCountdown <= 0 || experimentLength > sessionCountdown || !countdownRunning}
        >
            Start Experiment
        </button>
    );

    // Function to render the save button
    const renderSaveButton = () => (
        timeRemaining === 0 && (
            <button className="btn btn-success" onClick={handleSaveResults}>
                Save Results
            </button>
        )
    );

    // Function to render the experiment status box
    const renderExperimentStatusBox = () => (
        experimentStarted && (
            <div className="experiment-status-box">
                <p className="experiment-status">
                    Experiment in Progress - Time Remaining: {formatTime(timeRemaining)}
                </p>
            </div>
        )
    );


    // Render the component
    return (
            <div className="container-fluid">
                <Navbar/>


                    (<div className="container" style={{overflowY: 'auto', maxHeight: '100vh'}}>
                        <button onClick={handleToggleClick} className="btn btn-dark">
                            {tablesVisible ? 'Hide results Tables' : 'Show results Tables'}
                        </button>
                        {/* Instruction box button */}
                        { showInstructionBoxButton && (
                            <InstructionBox
                                showContentBox={showContentBox}
                                toggleContentBox={toggleContentBox}
                                experimentInstructionsBoxVisible={experimentInstructionsBoxVisible}
                                setExperimentInstructionsBoxVisible={setExperimentInstructionsBoxVisible}
                            />
                        )}
                        {/* Combined container with button and session countdown */}
                        <div>
                            <div className="experiment-status-box">
                                <button
                                    className={`btn session-status ${countdownRunning ? 'running' : 'stopped'}`}
                                    onClick={handleToggleCountdown}
                                    disabled={sessionCountdown === 0}
                                >
                                    <i className="fas fa-power-off shutdown-icon"></i>
                                    <span style={{
                                        height: '50px',
                                        borderRight: '1px solid white',
                                        marginRight: '8px',
                                        paddingLeft: '10px'
                                    }}></span>
                                    {renderSessionCountdown()}
                                </button>
                            </div>
                        </div>
                        {/* Experiment container */}
                        <div className="experiment-container">
                            {/* Shape container */}
                            <div className={`shape-container ${shape}`} style={{backgroundColor}} onClick={handleBarClick}>
                                <div ref={target}></div>
                            </div>
                            {/* Countdown container */}
                            <div className="countdown-container-123">
                                {renderExperimentCountdown()}
                            </div>
                            {/* Save button */}
                            <div className="button-container">
                                {renderSaveButton()}
                            </div>
                            {/* Experiment status box */}
                            {experimentStarted &&   (<div className="countdown-container">
                                {renderExperimentStatusBox()}
                            </div>)}
                            {/* Start experiment button */}
                            <div className="button-container">
                                {!experimentStarted && renderStartExperimentButton()}
                            </div>
                            {/* Results modal */}
                            <RenderResultsModal
                                tablesVisible={tablesVisible}
                                experimentData={experimentData}
                                calculateAverages={calculateAverages}
                                handleToggleClick={handleToggleClick}
                                handleResultsPage={handleResultsPage}
                            />
                            {/* Render the RedoExperimentModal */}
                            <RedoExperimentModal show={showRedoModal} onHide={() => setShowRedoModal(false)}
                                                 onRedo={handleRedoExperiment}/>

                        </div>
                    </div>
            </div>
    );
};
export default DemoExperiment;

