import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Form, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { DatePicker } from 'rsuite';
import { savePatientData } from '../Api/Api'; // Import the savePatientData function
import 'rsuite/dist/rsuite.min.css';
import '../style/PatientInfoPage.css';

function PatientInfoPage() {
  const [patientData, setPatientData] = useState({
    fullname: '',
    age: '',
    birthDate: new Date(),
    strongHand: 'Right',
    hasDiseases: false,
    diseases: '',
  });

  const navigate = useNavigate();




  const handleInputChange = (event) => {
    const { name, value, type, checked } = event.target;
    const newValue = type === 'checkbox' ? checked : value;

    setPatientData({
      ...patientData,
      [name]: newValue,
    });
  };

  const handleDateChange = (value) => {

    setPatientData({
      ...patientData,
      birthDate: value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {

      const age = calculateAge(patientData.birthDate);


      const savedPatientData = await savePatientData({
        ...patientData,
        age: age,
      });

      // Redirect to settings page with patient ID
      navigate('/settings', { state: { patientId: savedPatientData.id, patientData: savedPatientData } });
      console.log('Form submitted with data:', savedPatientData.id);
    } catch (error) {
      console.error('Error saving patient data:', error);
      // Handle error as needed
    }
  };

  return (
    <div className="container-patient">
      <Form onSubmit={handleSubmit}>
        <h3 className='title-patient'>Patient Information Form</h3>
        <Form.Group controlId="formName">
          <Form.Label>Fullame:</Form.Label>
          <Form.Control
            type="text"
            name="fullname"
            value={patientData.fullname}
            onChange={handleInputChange}
            placeholder="Enter your name"
          />
        </Form.Group>
        <Form.Group controlId="formBirthDate">
          <Form.Label>Birth Date:</Form.Label>
          <DatePicker
            onChange={handleDateChange}
            value={patientData.birthDate}
            format="dd-MM-yyyy"
            placeholder="Select your birth date"
            defaultValue={null} // Set defaultValue to null
          />
        </Form.Group>
        <Form.Group controlId="formStrongHand">
          <Form.Label>Strong Hand:</Form.Label>
          <div>
            <Form.Check
              type="radio"
              label="Right"
              name="strongHand"
              value="Right"
              checked={patientData.strongHand === 'Right'}
              onChange={handleInputChange}
            />
            <Form.Check
              type="radio"
              label="Left"
              name="strongHand"
              value="Left"
              checked={patientData.strongHand === 'Left'}
              onChange={handleInputChange}
            />
          </div>
        </Form.Group>
        <Form.Group controlId="formHasDiseases" className="form-check">
          <Form.Check
            type="checkbox"
            label="Has Diseases"
            name="hasDiseases"
            checked={patientData.hasDiseases}
            onChange={handleInputChange}
          />
        </Form.Group>
        {patientData.hasDiseases && (
          <Form.Group controlId="formDiseases">
            <Form.Label>Diseases:</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="diseases"
              value={patientData.diseases}
              onChange={handleInputChange}
              placeholder="Enter any diseases you have"
            />
          </Form.Group>
        )}
        <div className='btn-patient'>
          <Button variant="primary" type="submit">
            Submit
          </Button>
        </div>
      </Form>
    </div>
  );
}

export default PatientInfoPage;


function calculateAge(birthDate) {
  const currentDate = new Date();
  const dob = new Date(birthDate);

  let age = currentDate.getFullYear() - dob.getFullYear();

  // Adjust age if birthday hasn't occurred yet this year
  if (currentDate.getMonth() < dob.getMonth() ||
      (currentDate.getMonth() === dob.getMonth() && currentDate.getDate() < dob.getDate())) {
    age--;
  }

  return age;
}