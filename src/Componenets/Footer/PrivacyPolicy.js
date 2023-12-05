import React from 'react';
import { Modal, Button } from 'react-bootstrap';

const PrivacyPolicy = ({ show, handleClose }) => {
    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Privacy Policy</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>Privacy Policy content goes here.</p>
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
