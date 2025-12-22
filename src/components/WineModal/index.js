import React from "react";
import { Card, ListGroup, Modal } from "react-bootstrap";
import './index.css';
import { Button } from "react-bootstrap";
import { Row } from "react-bootstrap";
// import { Table } from "react-bootstrap";
// import Badge from 'react-bootstrap/Badge';


import { Col } from "react-bootstrap";

import SmallerWineCard from "../SmallerWineCard";

function Index(props) {
  const currentVarietal = props.varietals[props.wine['Varietal']];

    // Build similar wine list from varietal-level suggestions
    const varietalSimilarNames = currentVarietal?.similar
      ? Object.keys(currentVarietal.similar)
      : [];

    // Include the current wine's own varietal first
    const allVarietals = [props.wine['Varietal'], ...varietalSimilarNames];

    // De-duplicate while preserving order
    const uniqueVarietals = Array.from(new Set(allVarietals));

    const MAX_TOTAL_SIMILAR = 10;
    const MAX_PER_VARIETAL = 4;

    // Collect multiple wines per varietal (up to MAX_PER_VARIETAL), excluding the current wine itself
    const similarWines = uniqueVarietals
      .flatMap((varietalName) =>
        props.specs
          .filter(
            (w) =>
              w['Varietal'] === varietalName &&
              w['Wine Name'] !== props.wine['Wine Name']
          )
          .slice(0, MAX_PER_VARIETAL)
      )
      .slice(0, MAX_TOTAL_SIMILAR);
    return (
        <>
            <Modal.Header closeButton>
                <Modal.Title>
                  Similar Wines to {props.wine['Wine Name']}...
                </Modal.Title>
            </Modal.Header>
            
            <Modal.Body className="wine-modal-body">
              <Col className="pt-2 pb-0 p-3 similar-wine-card col-12 col-md-12">
              <Card>
                <Card.Body className="pb-0">
                  <p>{currentVarietal.description}</p>
                  <hr />
                  <b>Similar wines include:</b>
                  <ListGroup variant="flush">
                    {Object.keys(currentVarietal.similar).map((key, index) => (
                      <ListGroup.Item key={index}><strong>{key}:</strong> {currentVarietal.similar[key]}</ListGroup.Item>
                    ))}
                    {currentVarietal.not_like ? (
                      <ListGroup.Item>
                      <p><strong>Not like:</strong> {currentVarietal.not_like}</p>
                      </ListGroup.Item>
                    ) : null}
                  </ListGroup>
                </Card.Body>
              </Card>
                
              </Col>
                <Row>
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