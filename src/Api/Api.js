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
        const response = await axios.post(`${API_BASE_URL}/patients/${patientId}/settings`, settingsData);
        console.log('Settings data saved:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error saving settings data:', error);
        throw error;
    }
};

export const saveExperimentResults = async (settingsId, payload) => {
    try {
        const response = await axios.post(`http://localhost:8081/api/data/${settingsId}/results`, payload);
        console.log('Server response:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error saving experiment results:', error);
        throw error;
    }
};



export const getExperimentsData = async () => {
    try {
        const response = await axios.get('http://localhost:8081/api/data/');
        console.log('Server response:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error getting experiment data:', error);
        throw error;
    }
};


export const getAllPatients = async () => {
    try {
        const response = await axios.get('http://localhost:8081/api/patients');
        console.log('Server response:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error getting experiment data:', error);
        throw error;
    }
};