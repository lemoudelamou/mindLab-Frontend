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

export const saveExperimentResults = async (patientId, settingsId, experimentId, payload) => {
    try {

        const response = await axios.post(`${API_BASE_URL}/data/patient/${patientId}/${settingsId}/results/${experimentId}`, payload);
        console.log('Server response:', response.data);
        console.log('experiment data id:', response.data.id);
        localStorage.setItem("experimentDataId", response.data.id);

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


export const getExperimentsDataById = async (patientId) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/data/data/patient/${patientId}`);
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


export const fetchDataForGroup = async (groupe) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/data/group/${groupe}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error; // Rethrow the error to handle it at the calling site
    }
};


export const fetchDataByGender = async (gender) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/data/gender/${gender}`);

        return response.data;
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error; // Rethrow the error to handle it at the calling site
    }
};


export const deletePatientById = async (patientId) => {

    try {
        // Send a DELETE request to the specified endpoint
        const response = await axios.delete(`${API_BASE_URL}/patients/delete/${patientId}`);

        // Handle the response (optional)
        console.log('Delete success:', response.data);

        // Return any data you want, or simply return true to indicate success
        return true;
    } catch (error) {
        // Handle errors
        console.error('Error deleting patient:', error);

        // Return false or handle the error as needed
        return false;
    }
};


export const deleteExperimentDataById = async (experimentId) => {
    try {
        // Send a DELETE request to the specified endpoint
        const response = await axios.delete(`${API_BASE_URL}/data/delete-reaction-times/${experimentId}`);


        // Handle the response (optional)
        console.log('Delete success:', response.data);

        // Return any data you want, or simply return true to indicate success
        return true;
    } catch (error) {
        // Handle errors
        console.error('Error deleting experiment data:', error);

        // Return false or handle the error as needed
        return false;
    }

};


export const getPatientByFullnameAndId = async (fullname, patientId) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/data/by-patient-fullname/${fullname}/by-patient-id/${patientId}`);
        console.log('Server response:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error getting settings data:', error);
        throw error;
    }
};


