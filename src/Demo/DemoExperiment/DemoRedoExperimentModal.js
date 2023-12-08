// RedoExperimentModal.js
import React from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";


const DemoRedoExperimentModal = ({show, onHide, onRedo}) => {


    return (
        <Modal show={show} onHide={onHide} centered>
            <Modal.Header closeButton>
                <Modal.Title>Redo Experiment?</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                The previous attempt was invalid. Do you want to redo the experiment?
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide}>
                    Cancel
                </Button>
                <Button variant="primary" onClick={onRedo}>
                    Redo
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default DemoRedoExperimentModal;
