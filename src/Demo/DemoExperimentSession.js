// ExperimentSession.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DemoExperiment from './DemoExperiment';

const DemoExperimentSession = () => {
    const [sessionNumber, setSessionNumber] = useState(1);
    const [sessionDuration, setSessionDuration] = useState(300); // Default duration in seconds
    const [timeRemaining, setTimeRemaining] = useState(sessionDuration);
    const [isSessionActive, setIsSessionActive] = useState(false);
    const navigate = useNavigate();

    const handleSessionComplete = () => {
        // Logic to handle the end of a session
        setSessionNumber((prevSessionNumber) => prevSessionNumber + 1);
        // Redirect to the patient info page
        navigate('/settings');
    };

    useEffect(() => {
        let intervalId;

        if (isSessionActive) {
            intervalId = setInterval(() => {
                setTimeRemaining((prevTime) => {
                    if (prevTime > 0) {
                        return prevTime - 1;
                    } else {
                        setIsSessionActive(false);
                        clearInterval(intervalId);
                        handleSessionComplete();
                        return 0;
                    }
                });
            }, 1000);
        }

        return () => {
            clearInterval(intervalId);
        };
    }, [isSessionActive]);

    const handleStartSession = () => {
        setIsSessionActive(true);
    };

    return (
        <div>
            <h2>Experiment Session {sessionNumber}</h2>
            <p>Session Duration: {sessionDuration} seconds</p>
            {isSessionActive ? (
                <div>
                    <p>Time Remaining: {timeRemaining} seconds</p>
                    {/* You can pass sessionDuration and timeRemaining to the DemoExperiment */}
                    <DemoExperiment
                        sessionDuration={sessionDuration}
                        timeRemaining={timeRemaining}
                    />
                </div>
            ) : (
                <button onClick={handleStartSession}>Start Session</button>
            )}
        </div>
    );
};

export default DemoExperimentSession;
