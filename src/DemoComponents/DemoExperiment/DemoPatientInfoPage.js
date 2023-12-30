import React, {useState} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Form, Button} from 'react-bootstrap';
import {useNavigate} from 'react-router-dom';
import {DatePicker} from 'rsuite';
import {savePatientData} from '../../Api/Api'; // Import the savePatientData function
import 'rsuite/dist/rsuite.min.css';
import '../../style/PatientInfoPage.css';
import {calculateAge} from '../../utils/ExperimentUtils'
import Navbar from "../../Components/Navbar/Navbar";


function DemoPatientInfoPage() {

    const [patientData, setPatientData] = useState({
        fullname: '',
        age: '',
        birthDate: new Date(),
        gender: '',
        strongHand: 'Right',
        groupe: '',
        hasDiseases: false,
        diseases: '',
        expDate: '',
    });

    const navigate = useNavigate();


    const handleInputChange = (event) => {
        const {name, value, type, checked} = event.target;
        const newValue = type === 'checkbox' ? checked : value;

        setPatientData({
            ...patientData,
            [name]: newValue,
        });
    };

    const handleDateChange = (value) => {

        const age = calculateAge(value);
        const experimentDate = Date.now();
        const expDateObject = new Date(experimentDate);
        const expDate = expDateObject.toISOString().split('T')[0];


        setPatientData({
            ...patientData,
            birthDate: value,
            age: age,
            expDate ,
        });
    };

    const handleSubmit = (event) => {
        event.preventDefault();


        console.log('Patient data are passed', patientData);

        // Redirect to settings page with patient data
        navigate('/demo-settings', {state: {patientData}});

    };

    return (
        <div className="pp-back">
            <Navbar/>
            <div className="container-patient">
                <Form onSubmit={handleSubmit}>
                    <h3 className='title-patient'>Patient Information Form</h3>
                    <Form.Group controlId="formGroup">
                        <Form.Label style={{color: '#FFFFFF'}}>Group:</Form.Label>
                        <Form.Control
                            type="text"
                            name="groupe"
                            value={patientData.groupe}
                            onChange={handleInputChange}
                            placeholder="Enter group Name"
                        />
                    </Form.Group>
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
                    <Form.Group controlId="formGender">
                        <Form.Label>Gender:</Form.Label>
                        <div>
                            <Form.Check
                                type="radio"
                                label="Male"
                                name="gender"
                                value="Male"
                                checked={patientData.gender === 'Male'}
                                onChange={handleInputChange}
                            />
                            <Form.Check
                                type="radio"
                                label="Female"
                                name="gender"
                                value="Female"
                                checked={patientData.gender === 'Female'}
                                onChange={handleInputChange}
                            />
                            <Form.Check
                                type="radio"
                                label="Other"
                                name="gender"
                                value="Other"
                                checked={patientData.gender === 'Other'}
                                onChange={handleInputChange}
                            />
                        </div>
                    </Form.Group>
                    <Form.Group controlId="formBirthDate">
                        <Form.Label>Birth Date:</Form.Label>
                        <input
                            type='date'
                            max={new Date().toISOString().split('T')[0]}
                            className='form-control ml-2'
                            value={patientData.birthDate}
                            onChange={(e) => handleDateChange(e.target.value)}
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
        </div>
    );
}

export default DemoPatientInfoPage;


