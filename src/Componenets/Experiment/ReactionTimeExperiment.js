import React, {useState, useEffect, useRef} from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../style/ReactionTimeExperiment.css';
import {useNavigate} from 'react-router-dom';
import RedoExperimentModal from './RedoExperimentModal'
import {formatTime, calculateAverageReactionTime} from '../../utils/ExperimentUtils';
import Navbar from "../Navbar/Navbar";
import {getSettingsById, saveExperimentResults} from "../../Api/Api";
import '@fortawesome/fontawesome-free/css/all.css';
import ExperimentInstructionsBox from "./ExperimentInstructionBox";
import Spinner from "../../utils/Spinner";
import {v4 as uuidv4} from "uuid"; // Import the uuid library
import Modal from 'react-modal';


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
    const [countdownRunning, setCountdownRunning] = useState(false);
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
    const [sessionCountdown, setSessionCountdown] = useState(sessionLength ?? 180);
    const [allAttempts, setAllAttempts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [settingsData, setSettingsData] = useState(null);
    const [experimentData, setExperimentData] = useState({});
    const [experimentId, setExperimentId] = useState(""); // State variable to store the experiment ID
    const currentExperimentDataRef = useRef([]);
    const [tablesVisible, setTablesVisible] = useState(false);
    const [showContentBox, setShowContentBox] = useState(false);


    // Function to clear the text content of the target element
    const clearTargetText = () => {
        if (target.current) {
            target.current.textContent = "";
        }
    };

    const toggleContentBox = () => {
        setShowContentBox(!showContentBox);
    };

    const handleToggleClick = () => {
        console.log('Button clicked!');
        setTablesVisible(!tablesVisible);
    };


    useEffect(() => {
        const fetchSettingsData = async () => {
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
        };

        console.log("About to fetch settings data");
        fetchSettingsData().then(r => settingsId);
    }, [settingsId]);


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
        setTimeRemaining(experimentLength);
        setAllAttempts([]); // Clear all attempts
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
                setStartTime(performance.now().toFixed(2));
                setIsWaiting(false);
                return newColor;
            });
        }, fadeDuration);
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
        if (experimentId && currentExperimentDataRef.current.length > 0) {
            setExperimentData((prevData) => {
                const updatedData = {
                    ...prevData,
                    [experimentId]: currentExperimentDataRef.current,
                };
                console.log("Experiment Data: ", updatedData);
                return updatedData;
            });
        }
    }, [experimentId]);

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
    const handleBarClick = () => {
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
    };


    const handleResultsPage = () => {
        navigate("/results")
        ;
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
    }, [spacebarEnabled, startTime, backgroundColor, timeRemaining, handleBarClick]);

    // Effect to check conditions and start a new experiment if needed
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (!isWaiting && backgroundColor === (isColorBlind ? "yellow" : selectedColors.falschColor)) {
                startNewExperiment();
            } else if (timeRemaining === 0 && !isWaiting) {
                setBackgroundColor("white");
            }
        }, 1000);

        return () => {
            clearTimeout(timeoutId);
        };
    }, [isWaiting, backgroundColor, lastReactionTime, timeRemaining, startNewExperiment, setShowSaveButton]);


    // Function to start the experiment countdown
    const startExperimentCountdown = () => {
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
    };

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
    }, [countdownRunning]);


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

    // Function to render the instruction box button
    const renderInstructionBoxButton = () => (
        showInstructionBoxButton && (
            <div style={{paddingTop: '10px'}}>
                {/* Button to toggle the modal */}
                <div>
                    <button onClick={toggleContentBox} className="btn btn-dark" style={{justifySelf: 'center'}}>
                        {showContentBox ? 'Hide Instructions' : 'Show Instructions'}
                    </button>
                </div>

                <Modal
                    isOpen={showContentBox}
                    ariaHideApp={false}
                    onRequestClose={toggleContentBox}
                    contentLabel="Instructions"
                    style={{
                        content: {
                            top: '50%',
                            left: '50%',
                            right: 'auto',
                            bottom: 'auto',
                            marginRight: '-50%',
                            transform: 'translate(-50%, -50%)',
                        },
                    }}
                >
                    <ExperimentInstructionsBox/>
                </Modal>
            </div>
        )
    );

    // Function to render the results modal
    const renderResultsModal = () => (
        <Modal
            isOpen={tablesVisible}
            ariaHideApp={false}
            onRequestClose={handleToggleClick}
            contentLabel="Experiment Results"
            style={{
                content: {
                    top: '50%',
                    left: '50%',
                    right: 'auto',
                    bottom: 'auto',
                    marginRight: '-50%',
                    transform: 'translate(-50%, -50%)',
                    maxHeight: '80%', // Set the maximum height of the modal content
                    overflowY: 'auto', // Enable vertical scrolling
                    display: 'flex', // Use Flexbox
                    flexDirection: 'column', // Stack items vertically
                    alignItems: 'center', // Center items horizontally
                },
            }}>
            <div>
                <div className="results-section experiment-results">
                    <h2>Experiment Results</h2>
                    {renderExperimentData()}
                </div>

                <div className="results-section average-reaction-times">
                    <h2>Average Reaction Times</h2>
                    {renderAverages()}
                </div>
            </div>
            <button onClick={handleResultsPage} className="btn btn-dark"
                    style={{marginTop: '10px', flexDirection: 'column', alignItems: 'center'}}>
                To Results
            </button>
        </Modal>
    );


    const renderExperimentData = () => {
        return tablesVisible && Object.entries(experimentData).map(([experimentId, data], index) => (
            <div key={experimentId} className={tablesVisible ? 'visible' : 'hidden'} >
                <h3 style={{ textAlign: 'center' }}>{`Experiment ${index + 1}`}</h3>
                <table style={{ minWidth: '700px'}}>
                    <thead>
                    <tr>
                        <th>Time</th>
                        <th>Status</th>
                    </tr>
                    </thead>
                    <tbody>
                    {data.map((entry, entryIndex) => (
                        <tr key={entryIndex}>
                            <td>{entry.time}</td>
                            <td>{entry.status}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        ));
    };

    const renderAverages = () => {
        const averages = calculateAverages();

        return tablesVisible && Object.entries(averages).map(([experimentId, values], index) => (
            <div key={experimentId} className={tablesVisible ? 'visible' : 'hidden'}>
                <h3 style={{ textAlign: 'center' }}>{`Experiment ${index + 1}`}</h3>
                <table style={{ minWidth: '700px'}}>
                    <thead>
                    <tr>
                        <th>Statistic</th>
                        <th>Value</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <td>Average Correct Time</td>
                        <td>{values.correct} ms</td>
                    </tr>
                    <tr>
                        <td>Average Incorrect Time</td>
                        <td>{values.incorrect} ms</td>
                    </tr>
                    </tbody>
                </table>
            </div>
        ));
    };

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
                    {renderInstructionBoxButton()}


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
                        {renderResultsModal()}

                        {/* Render the RedoExperimentModal */}
                        <RedoExperimentModal show={showRedoModal} onHide={() => setShowRedoModal(false)}
                                             onRedo={handleRedoExperiment}/>

                    </div>
                </div>)}


        </div>
    );
};
export default ReactionTimeExperiment;


