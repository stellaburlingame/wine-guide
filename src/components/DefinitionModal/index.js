import React from "react";
import { Button, Image, Modal } from "react-bootstrap";
import './index.css';

function Index(props) {
    console.log("DefinitionModal props:", props);

    const formattedDefinition = props.Definition?.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");

    return (
        <Modal show={props.show} onHide={props.onHide}>
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
                <div dangerouslySetInnerHTML={{ __html: formattedDefinition }} />
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