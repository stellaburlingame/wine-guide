import React from "react";
import { Button, Image, Modal } from "react-bootstrap";
import './index.css';

function Index(props) {
    return (
        <Modal 
            show={props.show} 
            onHide={props.onHide} 
            dialogClassName="responsive-modal"
            // fullscreen={true}
        >
            <Modal.Header closeButton>
                <Modal.Title>{props.Name}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {props.Image && (
                    <Image
                        onError={({ currentTarget }) => {
                            currentTarget.onerror = null;
                            currentTarget.src = `${process.env.PUBLIC_URL}/photos/NA.png`;
                        }}
                        src={`${process.env.PUBLIC_URL}/photos/${props.Image}`}
                        alt={props.Name}
                        style={{ maxWidth: "100%" }}
                    />
                )}
                        {props.Definition}
                { props.Secondary_Text && (
                    <>
                        <hr />
                        <p className="secondary-text">{props.Secondary_Text}</p>
                    </>
                )}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={props.onHide}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default Index;