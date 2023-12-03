// QuitDemoButton.js
import React from 'react';
import {useNavigate} from 'react-router-dom';
import {exitDemoMode} from './LocalStorageUtils';
import OffButton from '../assets/offButton.png'

function QuitDemoButton() {
    const navigate = useNavigate();

    const handleQuitDemo = () => {
        exitDemoMode(); // Assuming this function handles the logic to exit demo mode
        navigate('/home'); // Navigate to the home page or another appropriate route
    };

    return (
        <button className="quit-demo-button btn-danger" onClick={handleQuitDemo}
                style={{display: 'flex', alignItems: 'center', paddingRight: '15px'}}>
            <img src={OffButton} alt="Quit Demo" style={{width: '30px', height: '30px', marginRight: '8px'}}/>
            <div style={{height: '30px', borderRight: '1px solid white', marginRight: '8px'}}></div>

            Quit Demo
        </button>
    );
}

export default QuitDemoButton;
