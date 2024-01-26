import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../style/PasswordForRes.css';
import { Button, Form, Alert } from 'react-bootstrap';
import Navbar from '../Navbar/Navbar';

const ResetPassword = () => {
    const [token, setToken] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showEmptyPasswordAlert, setShowEmptyPasswordAlert] = useState(false);
    const [showPasswordMismatchAlert, setShowPasswordMismatchAlert] = useState(false);
    const [showErrorAlert, setShowErrorAlert] = useState(false);
    const [showSuccessAlert, setShowSuccessAlert] = useState(false);
    const [passwordResetSuccessful, setPasswordResetSuccessful] = useState(false);

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const tokenFromUrl = urlParams.get('token');
        setToken(tokenFromUrl);
        console.log('token from url', token);
    }, [token]);

    const handleResetPassword = async (e) => {
        e.preventDefault();

        if (!password.trim()) {
            setShowEmptyPasswordAlert(true);
            setShowPasswordMismatchAlert(false);
            setShowErrorAlert(false);
            setShowSuccessAlert(false);
            return;
        }

        if (password !== confirmPassword) {
            setShowPasswordMismatchAlert(true);
            setShowEmptyPasswordAlert(false);
            setShowErrorAlert(false);
            setShowSuccessAlert(false);
            return;
        }

        try {
            // Make an API request to update the password using the token and newPassword
            const response = await axios.put(
                'http://localhost:8081/api/doctors/reset-password',
                { token, password },
                {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                }
            );

            if (response.status === 200) {
                // Password reset successful
                setShowSuccessAlert(true);
                setShowErrorAlert(false);
                setPasswordResetSuccessful(true);
            } else {
                // Handle errors
                setShowErrorAlert(true);
                setShowSuccessAlert(false);
            }
        } catch (error) {
            setShowErrorAlert(true);
            setShowSuccessAlert(false);
            console.error('Error resetting password:', error);
        }
    };

    return (
        <div className="pass-back">
            <Navbar />
            <div className="container-pass">
                {showEmptyPasswordAlert && (
                    <Alert variant="danger" onClose={() => setShowEmptyPasswordAlert(false)} dismissible>
                        Please enter a new password.
                    </Alert>
                )}
                {showPasswordMismatchAlert && (
                    <Alert variant="danger" onClose={() => setShowPasswordMismatchAlert(false)} dismissible>
                        Passwords do not match.
                    </Alert>
                )}
                {showErrorAlert && (
                    <Alert variant="danger" onClose={() => setShowErrorAlert(false)} dismissible>
                        Error resetting password. Please try again.
                    </Alert>
                )}

                {passwordResetSuccessful ? (
                    <div>
                        <h2 style={{textAlign: "center"}}>Password successfully reset !</h2>
                        <p style={{color: "white", textAlign: "center", fontSize: "14pt", marginBottom: "30px"}}>Your password has been successfully reset.</p>
                    </div>
                ) : (
                    <div>
                    <h2 style={{textAlign: "center"}}>Reset Password</h2>

                    <Form onSubmit={handleResetPassword}>
                        <Form.Group controlId="formNewPassword">
                            <Form.Label>New Password:</Form.Label>
                            <Form.Control
                                type="password"
                                value={password}
                                name="password"
                                placeholder="Enter your new password"
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group controlId="formConfirmPassword">
                            <Form.Label>Confirm Password:</Form.Label>
                            <Form.Control
                                type="password"
                                value={confirmPassword}
                                name="confirmPassword"
                                placeholder="Confirm your new password"
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                        </Form.Group>
                        <Button variant="primary" type="submit">
                            Reset Password
                        </Button>
                    </Form>
                        </div>
                            )}
            </div>
        </div>
    );
};

export default ResetPassword;
