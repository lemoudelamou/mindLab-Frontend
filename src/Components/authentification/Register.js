import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Form, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import 'rsuite/dist/rsuite.min.css';
import '../../style/Register.css';
import Navbar from '../Navbar/Navbar';
import {signup} from "../../Api/Api";
import { FaEye, FaEyeSlash } from 'react-icons/fa';

function Register() {
    const [doctorData, setDoctorData] = useState({
        firstname: '',
        lastname: '',
        username: '',
        email: '',
        password: '',
        role: [],
    });

    const [errors, setErrors] = useState({
        firstname: '',
        lastname: '',
        username: '',
        email: '',
        password: '',
        matchingPassword: '',
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showMatchingPassword, setShowMatchingPassword] = useState(false);

    const navigate = useNavigate();

    const handleInputChange = (event) => {
        const { name, value } = event.target;

        setDoctorData({
            ...doctorData,
            [name]: value,
        });
    };

    const togglePasswordVisibility = (field) => {
        if (field === 'password') {
            setShowPassword(!showPassword);
        } else if (field === 'matchingPassword') {
            setShowMatchingPassword(!showMatchingPassword);
        }
    };

    const validatePasswordComplexity = (password) => {
        // Password should have a minimum length of 8 characters
        // and include at least one number, one capital letter, and one lowercase letter
        const regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
        return regex.test(password);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        // Validate form fields
        const newErrors = {};
        if (!doctorData.firstname) {
            newErrors.firstname = 'Firstname is required';
        }
        if (!doctorData.lastname) {
            newErrors.lastname = 'Lastname is required';
        }
        if (!doctorData.username) {
            newErrors.username = 'Username is required';
        }
        if (!doctorData.email) {
            newErrors.email = 'Email is required';
        }
        if (!doctorData.password) {
            newErrors.password = 'Password is required';
        } else if (!validatePasswordComplexity(doctorData.password)) {
            newErrors.password =
                'Password should have a minimum length of 8 characters with at least one number, one capital letter, and one lowercase letter.';
        }
        if (!doctorData.matchingPassword) {
            newErrors.matchingPassword = 'Confirm Password is required';
        } else if (doctorData.matchingPassword !== doctorData.password) {
            newErrors.matchingPassword = 'Passwords do not match';
        }

        if (Object.keys(newErrors).length > 0) {
            // If there are errors, set the state and prevent submission
            setErrors(newErrors);
            return;
        }

        try {


            const signupData = await signup({
                ...doctorData,
            });


            console.log("signup data", signupData);


            navigate('/login');
        } catch (error) {
            console.error('Error regitring user:', error);
            // Handle error as needed
        }

    };

    return (
        <div className="reg-back">
            <Navbar />
            <div className="container-register">
                <Form onSubmit={handleSubmit}>
                    <h3 className="title-register">Register</h3>
                    <Form.Group controlId="formName">
                        <Form.Label>Firstname:</Form.Label>
                        <Form.Control
                            type="text"
                            name="firstname"
                            value={doctorData.firstname}
                            onChange={handleInputChange}
                            placeholder="Enter firstname"
                        />
                        {errors.firstname && <Alert variant="danger">{errors.firstname}</Alert>}
                    </Form.Group>

                    <Form.Group controlId="formName">
                        <Form.Label>Lastname:</Form.Label>
                        <Form.Control
                            type="text"
                            name="lastname"
                            value={doctorData.lastname}
                            onChange={handleInputChange}
                            placeholder="Enter lastname"
                        />
                        {errors.lastname && <Alert variant="danger">{errors.lastname}</Alert>}
                    </Form.Group>

                    <Form.Group controlId="formName">
                        <Form.Label>Username:</Form.Label>
                        <Form.Control
                            type="text"
                            name="username"
                            value={doctorData.username}
                            onChange={handleInputChange}
                            placeholder="Enter username"
                        />
                        {errors.username && <Alert variant="danger">{errors.username}</Alert>}
                    </Form.Group>

                    <Form.Group controlId="formEmail">
                        <Form.Label>Email:</Form.Label>
                        <Form.Control
                            type="text"
                            name="email"
                            value={doctorData.email}
                            onChange={handleInputChange}
                            placeholder="Enter email"
                        />
                        {errors.email && <Alert variant="danger">{errors.email}</Alert>}
                    </Form.Group>

                    <Form.Group controlId="formPassword">
                        <Form.Label>Password:</Form.Label>
                        <div className="password-input">
                            <Form.Control
                                type={showPassword ? 'text' : 'password'}
                                name="password"
                                value={doctorData.password}
                                onChange={handleInputChange}
                                placeholder="Enter password"
                            />
                            <div
                                className="password-icon"
                                onClick={() => togglePasswordVisibility('password')}
                            >
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </div>
                        </div>
                        {errors.password && <Alert variant="danger">{errors.password}</Alert>}
                    </Form.Group>

                    <Form.Group controlId="formConfirmPassword">
                        <Form.Label>Confirm password:</Form.Label>
                        <div className="password-input">
                            <Form.Control
                                type={showMatchingPassword ? 'text' : 'password'}
                                name="matchingPassword"
                                value={doctorData.matchingPassword}
                                onChange={handleInputChange}
                                placeholder="Enter password confirmation"
                            />
                            <div
                                className="password-icon"
                                onClick={() => togglePasswordVisibility('matchingPassword')}
                            >
                                {showMatchingPassword ? <FaEyeSlash /> : <FaEye />}
                            </div>
                        </div>
                        {errors.matchingPassword && (
                            <Alert variant="danger">{errors.matchingPassword}</Alert>
                        )}
                    </Form.Group>

                    <div className="btn-register">
                        <Button variant="primary" type="submit">
                            Register
                        </Button>
                    </div>
                </Form>
            </div>
        </div>
    );
}

export default Register;
