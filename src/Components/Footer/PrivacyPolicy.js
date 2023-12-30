import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import '../../style/PrivacyPolicy.css';  // Path to your new CSS file

const PrivacyPolicy = ({ show, handleClose }) => {
    return (
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton className="modal-header">
                <Modal.Title>Privacy Policy</Modal.Title>
            </Modal.Header>
            <Modal.Body className="modal-body">
                <h3>Introduction</h3>
                <p>Welcome to MindLab, the platform for measuring and analyzing reaction times. We are committed to protecting and respecting the privacy of our users.
                    This privacy policy explains what personal data we collect from you, how we use it, protect it, and your rights concerning it.</p>

                <h3>Data We Collect</h3>
                <ul>
                    <li><strong>Personal Identification Information:</strong> Name, Birthday.</li>
                    <li><strong>Measurement Data:</strong> Your reaction times and related metrics collected during the use of our platform.</li>
                    <li><strong>Usage Data:</strong> Information on how you use the services, including access times, pages visited, and features used.</li>
                    <li><strong>Technical Data:</strong> Device information, IP addresses, types and versions of browsers, operating systems.</li>
                </ul>

                <h3>How We Use Your Data</h3>
                <p>Your data is used to:</p>
                <ul>
                    <li>Provide you with personalized reaction time measurements and analyses.</li>
                    <li>Improve, maintain, and diagnose problems with our platform.</li>
                    <li>Communicate with you if you require support or there are updates or changes.</li>
                    <li>Fulfill legal requirements.</li>
                </ul>

                <h3>Data Protection</h3>
                <p>The security of your data is important to us. We take appropriate technical and organizational measures to protect your data from unauthorized access, loss, or destruction. However, please note that no method of transmission over the Internet or method of electronic storage is 100% secure.</p>

                <h3>Your Rights</h3>
                <p>You have the right:</p>
                <ul>
                    <li>To know what personal data we have stored about you.</li>
                    <li>To request that incorrect data be corrected.</li>
                    <li>To request that your data be deleted.</li>
                    <li>To withdraw your consent to data processing at any time.</li>
                </ul>

                <h3>Cookies</h3>
                <p>MindLab uses cookies to enhance your experience and make the platform more efficient. You can set your browser to reject all cookies or to indicate when a cookie is being sent. However, some parts of the platform may not function properly without cookies.</p>

                <h3>Changes to This Privacy Policy</h3>
                <p>We may update this privacy policy from time to time. We will notify you of any changes by posting the new privacy policy on this page.</p>

                <h3>Contact Us</h3>
                <p>If you have any questions or concerns about our privacy practices, please contact us at support@mindlab.de.</p>
            </Modal.Body>
            <Modal.Footer>
                <Button variant='secondary' onClick={handleClose}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default PrivacyPolicy;
