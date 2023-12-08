import secureLocalStorage from 'react-secure-storage';

export const toggleDemoMode = () => {
    // Retrieve current value from secure local storage
    const currentMode = JSON.parse(secureLocalStorage.getItem('isDemoMode'));

    // Toggle the value
    const newMode = !currentMode;

    // Store the updated value in secure local storage
    secureLocalStorage.setItem('isDemoMode', JSON.stringify(newMode));

    return newMode; // Optionally return the updated value
};

export const exitDemoMode = () => {
    // Set isDemoMode to false
    const newMode = false;

    // Store the updated value in secure local storage
    secureLocalStorage.setItem('isDemoMode', JSON.stringify(newMode));

    return newMode; // Optionally return the updated value
};
