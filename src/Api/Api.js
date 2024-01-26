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

export const saveEventData = async (eventData) => {
    try {


        const response = await axios.post(`${API_BASE_URL}/events`, eventData);
        console.log('Event data saved:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error saving event data:', error);
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
        const response = await axios.get(`${API_BASE_URL}/patients/all`);
        console.log('Server response:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error getting patient data:', error);
        throw error;
    }
};

export const getAllEvents = async (userId) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/events/by-doctor/${userId}`);
        console.log('Server response:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error getting event data:', error);
        throw error;
    }
};


export const getAllEventsById = async (id) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/events/by-id/${id}`);
        console.log('Server response:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error getting event data:', error);
        throw error;
    }
};


export const getAllPatientByDoctorId = async (userId) => {

    try {
        const response = await axios.get(`${API_BASE_URL}/patients/by-doctor/${userId}`);
        console.log('Server response:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error getting patient data:', error);
        throw error;
    }

}


export const getExperimentsDataById = async (patientId) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/data/patient/${patientId}`);
        console.log('Server response:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error getting experiment data:', error);
        throw error;
    }
};

export const getExperimentsDataByGroupDoctorId = async (group, userId) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/data/by-patient-group-user-id/${group}/${userId}`);
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
        console.error('Error updating event:', error);
        throw error; // Re-throw the error to handle it elsewhere if needed
    }
};

export const updateDoctorInfoById = async (id, updatedDoctorData) => {
    try {
        const response = await axios.put(`${API_BASE_URL}/doctors/update/${id}`, updatedDoctorData);

        console.log("updated user details", response.data);

        return response.data;
    } catch (error) {
        // Handle errors (e.g., show an error message)
        console.error('Error updating event:', error);
        throw error; // Re-throw the error to handle it elsewhere if needed
    }
};



export const updateEventById = async (id, updatedEventData) => {
    try {
        // Make the PUT request to update the patient
        const response = await axios.put(`${API_BASE_URL}/events/update/${id}`, updatedEventData);

        // Return the updated patient data from the response
        return response.data;
    } catch (error) {
        // Handle errors (e.g., show an error message)
        console.error('Error updating event:', error);
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
        const response = await axios.delete(`${API_BASE_URL}/patients/delete/${patientId}`);
        console.log('Delete success:', response.data);

        return true;
    } catch (error) {
        console.error('Error deleting patient:', error);
        return false;
    }
};


export const deleteEventById = async (id) => {

    try {
        const response = await axios.delete(`${API_BASE_URL}/events/delete/${id}`);
        console.log('Delete success:', response.data);

        return true;
    } catch (error) {
        console.error('Error deleting event:', error);
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

export const sendEmail = async (emailData) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/send-email`, emailData);
        console.log('Email sent:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
};


export const signup = async (data) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/auth/signup`, data);

        console.log(response.data);
        return response.data;
    } catch (error) {
        console.error('Error during signup:', error.response?.data || error.message);
        throw error;
    }
};


export const signin = async (data) => {


    try {
        const response = await axios.post(`${API_BASE_URL}/auth/signin`, data);

        console.log(response.data);
        return response.data;
    } catch (error) {
        console.error('Error during signin:', error.response?.data || error.message);
        throw error;
    }
};


export const logout = async () => {
    try {
        const response = await axios.post(`${API_BASE_URL}/auth/logout`);

        console.log(response.data);
        return response.data;
    } catch (error) {
        console.error('Error during logout:', error.response?.data || error.message);
        throw error;
    }
};



export const forgotPasswordRequest = async (email) => {
    try {
        const formData = new URLSearchParams();
        formData.append('email', email);

        const response = await axios.post('http://localhost:8081/api/forgot-password', formData.toString(), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        });

        if (response.status === 200) {
            return response.data; // Assuming the server returns the reset link in the response data
        } else {
            // Handle error response
            console.error('Error:', response.statusText);
            throw new Error('Failed to send password reset request');
        }
    } catch (error) {
        console.error('Error:', error.message);
        throw new Error('Failed to send password reset request');
    }
};

export const resetPasswordRequest = async (token, password) => {
    try {
        const response = await axios.put('http://localhost:8081/api/reset-password', {
            token: token,
            password: password,
        });

        // Assuming the server returns a success message or status
        return response.data;
    } catch (error) {
        console.error('Error:', error.message);
        throw new Error('Failed to reset password');
    }
};
