import React, {useEffect, useState} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Form, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import 'rsuite/dist/rsuite.min.css';
import '../../style/Login.css';
import Navbar from '../Navbar/Navbar';
import { Link } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import {useAuth} from "../../utils/AuthContext";
import axios from "axios";


function Login() {
    const [doctorData, setDoctorData] = useState({
        username: '',
        password: '',
    });

    const [errors, setErrors] = useState({
        username: '',
        password: '',
    });



    const { login, error } = useAuth();


    const [showPassword, setShowPassword] = useState(false);

    const navigate = useNavigate();

    const handleInputChange = (event) => {
        const { name, value } = event.target;

        setDoctorData({
            ...doctorData,
            [name]: value,
        });
    };


    const handleTogglePassword = () => {
        setShowPassword(!showPassword);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        // Validate form fields
        const newErrors = {};
        if (!doctorData.username.trim()) {
            newErrors.username = 'Fullname is required';
        }
        if (!doctorData.password.trim()) {
            newErrors.password = 'Password is required';
        }

        if (Object.keys(newErrors).length > 0) {
            // If there are errors, set the state and prevent submission
            setErrors(newErrors);
            return;
        }


       login({...doctorData});
    };

    return (
        <div className="lg-back">
            <Navbar />
            <div className="container-login">
                <Form onSubmit={handleSubmit}>
                    <h3 className="title-login">Login</h3>

                    <Form.Group controlId="formName">
                        {!error ? null : <Alert variant="danger">{error}</Alert>}

                        <Form.Label>Username:</Form.Label>
                        <Form.Control
                            type="text"
                            name="username"
                            value={doctorData.username}
                            onChange={handleInputChange}
                            placeholder="Enter full name"
                        />
                        {errors.username && <Alert variant="danger">{errors.username}</Alert>}
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
                            <div className="password-icon" onClick={handleTogglePassword}>
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </div>
                        </div>
                        {errors.password && <Alert variant="danger">{errors.password}</Alert>}
                    </Form.Group>

                    <div className="btn-login">
                        <Button variant="primary" type="submit">
                            Login
                        </Button>
                    </div>
                    <p>
                        Password forgotten? <Link to="/forgot-password">Click here</Link>
                    </p>
                </Form>
            </div>
        </div>
    );
}

export default Login;
