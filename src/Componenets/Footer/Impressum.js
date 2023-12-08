import React from 'react';
import { Modal, Button } from 'react-bootstrap';

const Impressum = ({ show, handleClose }) => {
    return (
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>Impressum</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>Impressum content goes here.</p>
            </Modal.Body>
            <Modal.Footer>
                <Button variant='secondary' onClick={handleClose}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default Impressum;
