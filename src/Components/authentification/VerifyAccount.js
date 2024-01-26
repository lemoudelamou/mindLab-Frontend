import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../style/PasswordForRes.css';
import Navbar from '../Navbar/Navbar';

const VerifyAccount = () => {
    const [verificationCode, setVerificationCode] = useState('');
    const [password, setPassword] = useState('');
    const [showErrorAlert, setShowErrorAlert] = useState(false);
    const [showSuccessAlert, setShowSuccessAlert] = useState(false);
    const [verificationSuccessful, setVerificationSuccessful] = useState(false);

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const verificationCodeFromUrl = urlParams.get('verificationCode');
        setVerificationCode(verificationCodeFromUrl);
        console.log('token from url', verificationCode);
        handleVerify(verificationCode)
    }, [verificationCode]);



        const handleVerify = async (verificationCode) => {


        try {
            // Make an API request to update the password using the token and newPassword
            const response = await axios.put(
                'http://localhost:8081/api/doctors/verify-registration',
                { verificationCode },
                {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                }
            );

            if (response.status === 200) {
                setVerificationSuccessful(true);
                setVerificationCode(null)
            } else {
                setVerificationSuccessful(false);

            }
        } catch (error) {
            console.error('Error resetting password:', error);
        }
    };




    return (
        <div className="pass-back">
            <Navbar />
            <div className="container-pass">

                { verificationSuccessful ? (

                    <div>
                        <h2 style={{textAlign: "center"}}>You are verified</h2>
                        <p style={{color: "white", textAlign: "center", fontSize: "14pt", marginBottom: "30px"}}>Your can sign in.</p>
                    </div>
                ) : ( <div>
                        <h2 style={{textAlign: "center"}}>Verification failed</h2>
                        <p style={{color: "white", textAlign: "center", fontSize: "14pt", marginBottom: "30px"}}> Click on the link in box again to verify your code </p>
                    </div>

                )}

            </div>
        </div>
    );
};

export default VerifyAccount;
