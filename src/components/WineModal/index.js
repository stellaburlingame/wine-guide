import React from "react";
import { Modal } from "react-bootstrap";
import './index.css';
import { Button } from "react-bootstrap";
import { Row, Col } from "react-bootstrap";

import SmallerWineCard from "../SmallerWineCard";

function Index(props) {
    console.log(props)
    const similarNames = Array.isArray(props.wine['Similar Wines'])
      ? props.wine['Similar Wines']
      : (props.wine['Similar Wines'] ? [props.wine['Similar Wines']] : []);

    // Preserve the order provided in the JSON by mapping names -> wine objects
    const similarWines = similarNames
      .map((name) => props.specs.find((w) => w['Wine Name'] === name))
      .filter(Boolean)
      .slice(0, 10);
    return (
        <>
            <Modal.Header closeButton>
                <Modal.Title>Similar Wines to {props.wine['Wine Name']}...</Modal.Title>
            </Modal.Header>
            
            <Modal.Body className="wine-modal-body">
                <Row className="horizontal-scrollable">
                {similarWines.length > 0 ? (
                  similarWines.map((wine, idx) => (
                    <Col key={idx} className="similar-wine-card col-12 col-md-12 mb-3">
                      <SmallerWineCard wine={wine} index={idx} state={{ specs: props.specs }} />
                    </Col>
                  ))
                ) : (
                  <Col className="col-12 text-center text-muted py-3">
                    No similar wines listed yet.
                  </Col>
                )}
                </Row>
            </Modal.Body>
            <Modal.Footer>
                    <Button variant="secondary" onClick={props.onHide}>
                        Close
                    </Button>
            </Modal.Footer>
        </>
    );
}

export default Index;