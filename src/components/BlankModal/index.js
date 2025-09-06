import React from "react";
import { Modal } from "react-bootstrap";
import './index.css';

function Index(props) {
    return (
        <Modal 
            show={props.show} 
            onHide={props.onHide} 
            fullscreen={props.fullScreen}
            dialogClassName="responsive-modal"
        >
            {props.body}
            {/* <Modal.Header closeButton>
                <Modal.Title>{props.Name}</Modal.Title>
            </Modal.Header>
            
            <Modal.Body>
                No content available.
            </Modal.Body>
            <Modal.Footer>
                    <Button variant="secondary" onClick={props.onHide}>
                        Close
                    </Button>
            </Modal.Footer> */}
        </Modal>
    );
}

export default Index;