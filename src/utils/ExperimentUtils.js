// experimentUtils.js
import { saveAs } from 'file-saver';



export const calculateAge = (birthdate) => {
    const today = new Date();
    const birthDate = new Date(birthdate);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }

    return age;
};


// Function to format time as "mm:ss"
export const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    const formattedSeconds = remainingSeconds < 10 ? `0${remainingSeconds}` : remainingSeconds;
    return `${formattedMinutes}:${formattedSeconds}`;
};


// Function to save data to a file
export const saveToFile = (data) => {
    const blob = new Blob([JSON.stringify(data)], { type: 'application/json;charset=utf-8' });
    saveAs(blob, 'experiment_results.json');
};


// Function to calculate the average reaction time from an array of reaction times
export const calculateAverageReactionTime = (times) => {
    if (times.length === 0) {
        return 0;
    }

    const totalReactionTime = times.reduce((sum, entry) => sum + entry.time, 0);
    const averageTime = totalReactionTime / times.length;

    return averageTime;
};


