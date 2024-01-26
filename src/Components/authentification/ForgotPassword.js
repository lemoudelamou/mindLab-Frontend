import React, { useState } from 'react';
import axios from 'axios';
import '../../style/PasswordForRes.css';
import { Button, Form, Alert } from 'react-bootstrap';
import Navbar from '../Navbar/Navbar';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [showAlert, setShowAlert] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [emailSentSuccessfully, setEmailSentSuccessfully] = useState(false);

    const handleForgotPassword = async (e) => {
        e.preventDefault();

        if (!email.trim()) {
            setShowAlert(true);
            setErrorMessage('Please enter your email address');
            setSuccessMessage('');
            return;
        }

        try {
            const formData = new URLSearchParams();
            formData.append('email', email);

            const response = await axios.post(
                'http://localhost:8081/api/doctors/forgot-password',
                formData.toString(),
                {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                }
            );

            if (response.status === 200) {
                setEmailSentSuccessfully(true);
                setShowAlert(true);
                setSuccessMessage('Reset email sent successfully!');
                setErrorMessage('');
            } else {
                setShowAlert(true);
                setErrorMessage('Failed to send password reset request');
                setSuccessMessage('');
            }
        } catch (error) {
            setShowAlert(true);
            setErrorMessage('Failed to send password reset request');
            setSuccessMessage('');
            console.error('Error:', error.message);
        }
    };

    return (
        <div className="pass-back">
            <Navbar />
            <div className="container-pass">
                {emailSentSuccessfully ? (
                    <div style={{ margin: 'auto' }}>
                    <h2 style={{color: "white", textAlign: "center"}}>Email successfully sent !</h2>
                        <p style={{color: "white", textAlign: "center", fontSize: "14pt", marginBottom: "30px"}}>  Please check you inbox</p>
                    </div>

                ) : (
                    <>
                        <h2>Password forgotten?</h2>
                        {showAlert && (
                            <Alert
                                variant={errorMessage ? 'danger' : 'success'}
                                onClose={() => {
                                    setShowAlert(false);
                                    setSuccessMessage('');
                                    setErrorMessage('');
                                }}
                                dismissible
                            >
                                {errorMessage || successMessage}
                            </Alert>
                        )}
                        <Form onSubmit={handleForgotPassword}>
                            <Form.Group controlId="formNewPassword">
                                <Form.Label>Email:</Form.Label>
                                <Form.Control
                                    placeholder="Enter your email address"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </Form.Group>
                            <Button variant="primary" type="submit">
                                Send Reset Email
                            </Button>
                        </Form>
                    </>
                )}
            </div>
        </div>
    );
};

export default ForgotPassword;
