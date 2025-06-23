import React, { useState } from "react";
import { Button, Image, ListGroup, Modal } from "react-bootstrap";
import './index.css';

function Index(props) {
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    return (
        <>
            <Button className='link' variant="link" onClick={handleShow}>
            {props.props.Name}
            </Button>

            <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>{props.props.Name}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <ListGroup variant="flush" >
                <ListGroup.Item>
                    <Image fluid onError={({ currentTarget }) => {
                        currentTarget.onerror = null;
                        currentTarget.src="https://dvasquez4155.github.io/TFM/photos/NA.png";
                        }} variant="top" src={"https://dvasquez4155.github.io/TFM/photos/" + props.path + ".png"} />
                </ListGroup.Item>
                    {Object.keys(props.props).filter(title => title !== "Name").map((desc, descKey) => {
                        return(
                            <ListGroup.Item key={descKey}>
                                <strong>{desc}: </strong>
                                {props.props[desc]}
                            </ListGroup.Item>
                        )
                    })}
                </ListGroup>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                Close
                </Button>
            </Modal.Footer>
            </Modal>
        </>
    );
}
export default Index;