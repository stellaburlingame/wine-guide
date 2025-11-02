import React from "react";
import { Image, Modal } from "react-bootstrap";
import './index.css';

import NA from '../WineCard/NA.png';

function Index(props) {
    return (
        <>
            <Modal.Header closeButton>
                <Modal.Title>{props.Name}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {props.Image && (
                    <>
                    <Image
                        onError={({ currentTarget }) => {
                            currentTarget.onerror = null;
                            currentTarget.src = NA;
                        }}
                        src={`${props.Image}`}
                        alt={props.Name}
                        style={{ maxWidth: "100%", height:"50vh" }}
                    />
                    <hr />
                    </>
                )}
                        {props.Definition}
                { props.Secondary_Text && (
                    <>
                        <hr />
                        <p className="secondary-text">{props.Secondary_Text}</p>
                    </>
                )}
            </Modal.Body>
            {/* <Modal.Footer>
                <Button variant="secondary" onClick={props.onHide}>
                    Close
                </Button>
            </Modal.Footer> */}
        </>
    );
}

export default Index;