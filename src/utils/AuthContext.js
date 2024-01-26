// AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import {logout, signin} from "../Api/Api";
import {useNavigate} from "react-router-dom";
import axios from "axios";
import Cookie from "cookie-universal"


const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState();
    const [username, setUsername] = useState('');
    const[userId, setUserId] = useState(null);
    const[user, setUser] = useState(null);
    const[jwt, setJwt] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const cookies = new Cookie();


    const login = async (doctorData) => {
        try {
            const signinData = await signin({
                ...doctorData,
            });

            setIsLoggedIn(true);
            setUser(signinData.data);
            console.log("signin data", signinData.data);

            // Set the access token as an HTTP-only cookie
            cookies.set('access_token', signinData.accessToken, {
                path: '/',
            });

            navigate('/home');
        } catch (error) {
            console.error('Error signing in user:', error);

            // Check if the error object has a response property
            if (error.response) {
                const errorMessage = error.response.data.message;
                setError(errorMessage);
                console.error('API Error Message:', errorMessage);
            } else {
                setError('Unexpected Error. Please try again.');
                console.error('Unexpected Error:', error.message);
            }
        }
    };

    const logOut = async () => {
        try {

            const signout = await logout();

            console.log("logout", signout);
            cookies.remove('access_token');

            setIsLoggedIn(false);


            navigate('/login');
        } catch (error) {
            console.error('Error logging user out:', error);
        }

    };


    useEffect(()=>{
        console.log('App Started');

        const accessToken = cookies.get('access_token')

        console.log('Access Token:', accessToken);


        if(accessToken) {
            const verifyToken = async () => {
                try{
                    const response = await axios.get('http://localhost:8081/api/auth/verifyjwt', {

                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${accessToken}`,
                        }
                    });
                    console.log("verify",response);
                    if(response.status === 200){
                        setJwt(accessToken);
                        setIsLoggedIn(true);
                        setUser(response.data);
                        setUsername(response.data.username);
                        setUserId(response.data.id);
                        setJwt(accessToken);
                    } else setIsLoggedIn(false);
                }catch(err){
                    console.log(err);
                }
            }
            verifyToken();
        }
    },[isLoggedIn])

    return (
        <AuthContext.Provider value={{ isLoggedIn, login, logOut, username, setUsername, userId, setUserId, user, setUser, jwt, setJwt, error }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};
