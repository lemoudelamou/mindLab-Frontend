// src/SecondReactionExp.js
import React, { useState, useEffect, useRef } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import '../style/ReactionTimeExperiment.css';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import InfoBox from "./InfoBox";
import { saveExperimentResults } from '../Api/Api'; // Import the savePatientData function
import { saveAs } from 'file-saver';
import axios from 'axios';


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
  const [selectedColors, setSelectedColors] = useState({ richtigColor: 'red', falschColor: 'green' });
  const shapes = ['circle', 'square', 'rectangle'];


  const navigate = useNavigate();
  const location = useLocation();
  const { state } = location;
  const patientData = state?.patientData || null;
  const settingsData = state?.settingsData || null;
  const settingsId = state?.settingsId || null;


  // State variables for experiment settings and patient information
  const [experimentSettings, setExperimentSettings] = useState({
    shape: "circle",
    experimentLength: 60,
    isColorBlind: '',
    blinkDelay: 1,
    difficultyLevel: 'Easy',
  });

  const [patientInfo, setPatientInfo] = useState({
    fullname: '',
    birthDate: new Date(),
    age: '',
    strongHand: 'Right',
    hasDiseases: false,
    diseases: '',
  });

  // Function to clear the text content of the target element
  const clearTargetText = () => {
    if (target.current) {
      target.current.textContent = "";
    }
  };

  // Function to apply experiment settings from the modal
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
      }  else if (settingsData.difficultyLevel === 'Hard') {
        const selectedColorOptions = [selectedColors.richtigColor, selectedColors.falschColor, selectedColors.color2];
        setShape(newShape);
        return selectedColorOptions[Math.floor(Math.random() * selectedColorOptions.length)];
      }

    }
  };

  // Function to reset experiment-related state variables
  const resetExperiment = () => {
    setReactionTimes([]);
    setLastReactionTime(0);
    setShowSaveButton(false);

    // Set time remaining to experiment length and start a new experiment
    setTimeRemaining(experimentLength);
  };

  // Function to start a new experiment
  const startNewExperiment = () => {
    console.log("Blink Delay:", blinkDelay);

    setIsWaiting(true);
    clearTargetText();
    setSpacebarEnabled(true);

    const fadeDuration = 10;

    // Add a subtle transition effect to the background color
    setBackgroundColor((prevColor) => {
      const newColor = generateRandomColor();
      target.current.style.transition = `background-color ${fadeDuration / 500}s ease-in-out`;



      // Use requestAnimationFrame to trigger the transition
      requestAnimationFrame(() => {
        setBackgroundColor(newColor);
        setIsWaiting(false);
        setStartTime(performance.now());
      });

      // Clear the transition property after the transition ends
      setTimeout(() => {
        target.current.style.transition = 'none';
      }, fadeDuration);

      return newColor;
    });


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

    const intervalId = setInterval(() => {
      setTimeRemaining((prevTime) => {
        if (prevTime > 0) {
          return prevTime - 1;
        } else {
          setExperimentStarted(false);
          setSpacebarEnabled(false);
          setBackgroundColor("white");
          clearInterval(intervalId);
          return 0;
        }
      });
    }, 1000);

    startNewExperiment();
  };

  useEffect(() => {
    if (patientData) {
      setPatientInfo({
        fullname: patientData.fullname || '',
        birthDate: patientData.birthDate || '',
        age: patientData.age || '',
        strongHand: patientData.strongHand || 'Right',
        hasDiseases: patientData.hasDiseases || '',
        diseases: patientData.diseases || '',
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

  useEffect(() => {
    if (settingsData) {
      applyExperimentSettings();
    }
  }, [settingsData]);

  const calculateAge = (birthdate) => {
    const today = new Date();
    const birthDate = new Date(birthdate);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    return age;
  };

  // Function to handle saving results
  const handleSaveResults = async () => {
    setShowSaveButton(false);

    // Calculate average reaction time for "positive" and "negative" tries
    const positiveTimes = reactionTimes.filter((entry) => entry.status.includes("positive"));
    const negativeTimes = reactionTimes.filter((entry) => entry.status.includes("negative"));

    const averagePositiveTime = calculateAverageReactionTime(positiveTimes);
    const averageNegativeTime = calculateAverageReactionTime(negativeTimes);

    const age = calculateAge(patientInfo.birthDate);




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
      },
      reactionTimes,
      averageReactionTimes: {
        positive: averagePositiveTime,
        negative: averageNegativeTime,
      },
    };

    const payload = {
      reactionTimes,
      averageReactionTimes: {
        positive: averagePositiveTime,
        negative: averageNegativeTime,
      },
    };


    console.log('Payload:', resultData.averageReactionTimes);
    console.log('settingsId:', settingsId);


    // Check if patient data is available
    if (settingsId) {
      try {
        console.log('Saving settings data...');

        // Save settings data to the server
        await saveExperimentResults(settingsId, payload);

      } catch (error) {
        console.error('Error saving settings data:', error);
        // Handle error as needed
      }
    }



    // Log the result data to the console
    console.log('Result Data:', resultData);

    // Save the resultData to a file
    saveToFile(resultData);

    // Pass resultData to the Results page using react-router-dom
    navigate('/results', { state: { resultData } });

    // Reset experiment-related state variables
    resetExperiment();
  };

  // Function to calculate the average reaction time from an array of reaction times
  const calculateAverageReactionTime = (times) => {
    if (times.length === 0) {
      return 0;
    }

    const totalReactionTime = times.reduce((sum, entry) => sum + entry.time, 0);
    const averageTime = totalReactionTime / times.length;

    return averageTime;
  };

  // Function to save data to a file
  const saveToFile = (data) => {
    const blob = new Blob([JSON.stringify(data)], { type: 'application/json;charset=utf-8' });
    saveAs(blob, 'experiment_results.json');
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
        status = `positive`;
      } else if (backgroundColor === (isColorBlind ? "yellow" : selectedColors.falschColor)) {
        status = `negative`;
      } else if (backgroundColor === selectedColors.color2) {
        // Add condition for the third color in the medium difficulty level
        status = `negative`;
      } else {
        status = `No Reaction`;
      }

      setBackgroundColor("white");

      setUserResponse(status);

      setReactionTimes((prevReactionTimes) => [
        ...prevReactionTimes,
        { time: reactionTime, status },
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

  // Render the component
  return (
      <div className="container-fluid">
        <div className="container">
          {/* Experiment container */}
          <div className="experiment-container">
            {/* Shape container */}
            <div className={`shape-container ${shape}`} style={{ backgroundColor }} onClick={handleBarClick}>
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
                    <p className="experiment-status">
                      Experiment in Progress - Time Remaining: {formatTime(timeRemaining)}
                    </p>
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

            {/* Display patient info and experiment settings */}
            <InfoBox patientInfo={patientData?.fullname ? patientInfo : {}} experimentSettings={experimentSettings} />
          </div>
        </div>
      </div>
  );
};

// Function to format time as "mm:ss"
const formatTime = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
  const formattedSeconds = remainingSeconds < 10 ? `0${remainingSeconds}` : remainingSeconds;
  return `${formattedMinutes}:${formattedSeconds}`;
};

export default ReactionTimeExperiment;
