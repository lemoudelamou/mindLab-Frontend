import React, {useState, useEffect, useRef, lazy, useCallback} from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../../style/ReactionTimeExperiment.css';
import {useNavigate} from 'react-router-dom';
import {formatTime, calculateAverageReactionTime} from '../../../utils/ExperimentUtils';
import Navbar from "../../Navbar/Navbar";
import {getSettingsById, saveExperimentResults, createSesssion} from "../../../Api/Api";
import '@fortawesome/fontawesome-free/css/all.css';
import Spinner from "../../../utils/Spinner";
import {v4 as uuidv4} from "uuid"; // Import the uuid library
import InstructionBox from "./RenderInstructionsBox";
import RenderResultsModal from "./RenderResultsModal";

// Lazy load the RedoExperimentModal component
const RedoExperimentModal = lazy(() => import('./RedoExperimentModal'));

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
    const [experimentCountdown, setExperimentCountdown] = useState(3);
    const [intervalId, setIntervalId] = useState(null); // New state variable to store the interval ID
    const [countUpRunning, setCountUpRunning] = useState(false);
    const navigate = useNavigate();
    const settingsId = localStorage.getItem("settingsId") || null;
    const patientId = localStorage.getItem("patientId") || null;
    const sessionLength = localStorage.getItem("sessionLength") || null;
    const showInstructionBoxButton = localStorage.getItem("showInstructionsBox") === 'true';
    const [experimentSettings, setExperimentSettings] = useState({
        shape: "circle", experimentLength: 60, isColorBlind: '', blinkDelay: 1, difficultyLevel: 'Easy',
    }); // State variables for experiment settings and patient information
    const [patientInfo, setPatientInfo] = useState({
        fullname: '', birthDate: new Date(), age: '', strongHand: 'Right', hasDiseases: false, diseases: '',
    });
    // New state variable for session countdown
    const [sessionCountUp, setSessionCountUp] = useState(0);
    const [allAttempts, setAllAttempts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [settingsData, setSettingsData] = useState(null);
    const [experimentData, setExperimentData] = useState({});
    const [experimentId, setExperimentId] = useState(""); // State variable to store the experiment ID
    const currentExperimentDataRef = useRef([]);
    const [tablesVisible, setTablesVisible] = useState(false);
    const [showContentBox, setShowContentBox] = useState(false);
    const [experimentInstructionsBoxVisible, setExperimentInstructionsBoxVisible] = useState(false);
    const [isSpacebarPressed, setIsSpacebarPressed] = useState(false);
    const [sessionTerminated, setSessionTerminated] = useState();
    const [startSession, setStartSession] = useState('');
    const [endSession, setEndSession] = useState('');


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



    const fetchSettingsData = useCallback(async () => {
        try {
            const data = await getSettingsById(settingsId);
            setSettingsData(data);
            applyExperimentSettings(data);
            console.log("fetched settings data:", data);
        } catch (error) {
            setError(error);
        } finally {
            setLoading(false);
        }
    }, [settingsId]);

    useEffect(() => {
        console.log("About to fetch settings data");
        fetchSettingsData();
    }, [fetchSettingsData]);


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
                richtigColor: settingsData.color1, falschColor: settingsData.color2, color3: settingsData.color3,
            });
        } else if (settingsData.difficultyLevel === 'Hard') {
            setSelectedColors({
                richtigColor: settingsData.color1, falschColor: settingsData.color2, color3: settingsData.color3,
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
            } else if (backgroundColor === selectedColors.color3) {
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

    const handleResultsPage = async () => {
        for (const [experimentId, data] of Object.entries(experimentData)) {
            // Calculate average reaction time for "correct" and "incorrect" tries
            const correctTimes = data.filter((entry) => entry.status.includes("correct"));
            const incorrectTimes = data.filter((entry) => entry.status.includes("incorrect"));
            const averageCorrectTime = calculateAverageReactionTime(correctTimes);
            const averageIncorrectTime = calculateAverageReactionTime(incorrectTimes);

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
                    ...patientInfo, birthDate: patientInfo.birthDate, age: patientInfo.age,
                },
                reactionTimes: experimentData,
                averageReactionTimes: {
                    correct: averageCorrectTime,
                    incorrect: averageIncorrectTime,
                },
            };

            console.log('Payload:', resultData);

            //saveToFile(resultData);

            // Check if experimentId is available
            if (settingsId) {
                try {
                    console.log('Saving settings data...');

                    // Save settings data to the server using the currentExperimentId
                    await saveExperimentResults(patientId, settingsId, experimentId,{
                        startSession,
                        endSession,
                        reactionTimes: experimentData,
                        averageReactionTimes: {
                            correct: averageCorrectTime, incorrect: averageIncorrectTime,
                        },
                    });



                    console.log("Experiment Data id: ", resultData)
                } catch (error) {
                    // Handle error as needed
                    console.log('Error:', error);
                }
            } else {
                // Log the result data to the console
            }
        }
        navigate("/results");
    }

    const handleSaveResults = async () => {
        setShowSaveButton(false);

        // Iterate through each experiment data
        for (const [experimentId, data] of Object.entries(experimentData)) {
            // Calculate average reaction time for "correct" and "incorrect" tries
            const correctTimes = data.filter((entry) => entry.status.includes("correct"));
            const incorrectTimes = data.filter((entry) => entry.status.includes("incorrect"));
            const averageCorrectTime = calculateAverageReactionTime(correctTimes);
            const averageIncorrectTime = calculateAverageReactionTime(incorrectTimes);

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
                    ...patientInfo, birthDate: patientInfo.birthDate, age: patientInfo.age,
                },
                reactionTimes: experimentData,
                averageReactionTimes: {
                    correct: averageCorrectTime,
                    incorrect: averageIncorrectTime,
                },
            };

            console.log('Payload:', resultData);

            //saveToFile(resultData);

            // Check if experimentId is available
            if (settingsId) {
                try {
                    console.log('Saving settings data...');

                    // Save settings data to the server using the currentExperimentId
                    await saveExperimentResults(patientId, settingsId, experimentId,{
                        startSession,
                        endSession,
                        reactionTimes: experimentData,
                        averageReactionTimes: {
                            correct: averageCorrectTime, incorrect: averageIncorrectTime,
                        },
                    });



                    console.log("Experiment Data id: ", resultData)
                } catch (error) {
                    // Handle error as needed
                    console.log('Error:', error);
                }
            } else {
                // Log the result data to the console
            }
        }
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


    // Effect to update session countUp
    useEffect(() => {
        let intervalId;

        // Start the countUp when the component is mounted
        if (countUpRunning) {
            intervalId = setInterval(() => {
                setSessionCountUp((prevCountUp) => {
                    if (prevCountUp >= 0) {
                        return prevCountUp + 1;
                    }
                });
            }, 1000);
        }

        return () => clearInterval(intervalId);
    }, [countUpRunning, sessionCountUp]);


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

   const handleTerminateSession = () => {
       setCountUpRunning(false);
       setSessionTerminated(true);
       setSessionCountUp(0);
       const date = new Date();
       setEndSession( padTo2Digits(date.getHours())
           + ':' + padTo2Digits(date.getMinutes())
           + ":" + padTo2Digits(date.getSeconds()) ) ;
       console.log("end session Time", endSession);
       // eslint-disable-next-line no-restricted-globals
        confirm("Session is terminated. Please don't forget to save the experiments data");

   }

    function padTo2Digits(num) {
        return String(num).padStart(2, '0');
    }

    const handleToggleCountUp = () => {
        if(sessionCountUp === 0){
            const date = new Date();
            setStartSession(  padTo2Digits(date.getHours())
                + ':' + padTo2Digits(date.getMinutes())
                + ":" + padTo2Digits(date.getSeconds()) );
            console.log("start session Time", startSession);
        }
        setCountUpRunning((prev) => !prev);
    };


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
    const renderSessionCountUp = () => {
        if (sessionCountUp === 0) {
            return 'Start session';
        } else if (sessionCountUp > 0 && countUpRunning) {
            return formatTime(sessionCountUp);
        } else if ( sessionCountUp > 0 && !countUpRunning) {
            return `Resume ${formatTime(sessionCountUp)}`;
        } else if (sessionTerminated && sessionCountUp > 0 && countUpRunning ) {
            return 'terminated';
        }
        return null;
    };

    // Function to render the start experiment button
    const renderStartExperimentButton = () => (
        <button
            className="btn btn-primary"
            onClick={startExperimentCountdown}
            disabled={sessionCountUp <= 0 || !countUpRunning}
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
                {loading ?
                    (
                        <Spinner/>
                    ) :

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
                                    className={`btn session-status ${countUpRunning ? 'running' : 'stopped'}`}
                                    onClick={handleToggleCountUp}
                                    disabled={false}
                                >
                                    <i className="fas fa-power-off shutdown-icon"></i>
                                    <span style={{
                                        height: '50px',
                                        borderRight: '1px solid white',
                                        marginRight: '8px',
                                        paddingLeft: '10px'
                                    }}></span>
                                    {renderSessionCountUp()}
                                </button>
                                { countUpRunning && (
                                <button className="btn session-stop" onClick={handleTerminateSession}>
                                    Terminate
                                </button>
                                )}
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
                    </div>)}
            </div>
    );
};
export default ReactionTimeExperiment;



