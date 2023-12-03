export const toggleDemoMode = () => {
    // Retrieve current value from local storage
    const currentMode = JSON.parse(localStorage.getItem('isDemoMode'));

    // Toggle the value
    const newMode = !currentMode;

    // Store the updated value in local storage
    localStorage.setItem('isDemoMode', JSON.stringify(newMode));

    return newMode; // Optionally return the updated value
};

export const exitDemoMode = () => {
    // Set isDemoMode to false
    const newMode = false;

    // Store the updated value in local storage
    localStorage.setItem('isDemoMode', JSON.stringify(newMode));

    return newMode; // Optionally return the updated value
};

