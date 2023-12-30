import React, { useState } from 'react';
import '../../style/Footer.css';
import Impressum from "./Impressum";
import PrivacyPolicy from "./PrivacyPolicy";

function Footer() {
    const [showImpressum, setShowImpressum] = useState(false);
    const [showPrivacyPolicy, setShowPrivacyPolicy] = useState(false);

    const handleImpressumClick = () => {
        console.log('Impressum clicked');
        setShowImpressum(true);
    };

    const handlePrivacyPolicyClick = () => {
        setShowPrivacyPolicy(true);
    };

    const handleCloseModal = () => {
        setShowImpressum(false);
        setShowPrivacyPolicy(false);
    };

    return (
        <footer className='footer-container'>
            <p className='text'>&copy; 2023 MindLab</p>

            {/* Impressum Modal */}
            <Impressum show={showImpressum} handleClose={handleCloseModal} />

            {/* Privacy Policy Modal */}
            <PrivacyPolicy show={showPrivacyPolicy} handleClose={handleCloseModal} />


            {/* Links to open modals */}
            <div className='footer-links'>
        <span className='link' onClick={handleImpressumClick} >
          Impressum
        </span>
                <span className='link' onClick={handlePrivacyPolicyClick}>
          Privacy Policy
        </span>
            </div>
        </footer>
    );
}

export default Footer;
