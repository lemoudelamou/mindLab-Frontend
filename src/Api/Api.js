// api.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8081/api';

export const savePatientData = async (patientData) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/patients`, patientData);
        console.log('Patient data saved:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error saving patient data:', error);
        throw error;
    }
};

export const saveSettingsData = async (patientId, settingsData) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/settings/save/${patientId}`, settingsData);
        console.log('Settings data saved:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error saving settings data:', error);
        throw error;
    }
};

export const saveExperimentResults = async (settingsId, payload) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/data/${settingsId}/results`, payload);
        console.log('Server response:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error saving experiment results:', error);
        throw error;
    }
};


export const getExperimentsData = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/data/all`);
        console.log('Server response:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error getting experiment data:', error);
        throw error;
    }
};


export const getAllPatients = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/patients`);
        console.log('Server response:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error getting experiment data:', error);
        throw error;
    }
};


export const getExperimentsDataById = async (experimentDataId) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/data/experiment-details/${experimentDataId}`);
        console.log('Server response:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error getting experiment data:', error);
        throw error;
    }
};


export const getSettingsById = async (settingsId) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/settings/patient/${settingsId}`);
        console.log('Server response:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error getting settings data:', error);
        throw error;
    }
};


export const updatePatientById = async (id, updatedPatientData) => {
    try {
        // Make the PUT request to update the patient
        const response = await axios.put(`${API_BASE_URL}/patients/${id}`, updatedPatientData);

        // Return the updated patient data from the response
        return response.data;
    } catch (error) {
        // Handle errors (e.g., show an error message)
        console.error('Error updating patient:', error);
        throw error; // Re-throw the error to handle it elsewhere if needed
    }
};