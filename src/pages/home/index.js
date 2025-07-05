import React from "react";
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import { CardGroup } from "react-bootstrap";
import { Link } from "react-router-dom";


function Index(props) {
    return (
        <>
        
        <CardGroup>
                <Card className="m-3">
                    <Card.Header>
                        <Card.Title>Wine Specification</Card.Title>
                    </Card.Header>
                    <Card.Body>
                        <Card.Text>
                        A list of all wines and their specifications
                        </Card.Text>
                    </Card.Body>
                    <Card.Footer>
                        <Link variant="outline-*" className="navbar-brand logo" to="italiano"><Button variant="primary">Rosso Italiano</Button></Link>
                        <Link variant="outline-*" className="navbar-brand logo" to="rosso"><Button variant="primary">Rosso</Button></Link>
                        <Link variant="outline-*" className="navbar-brand logo" to="bianco"><Button variant="primary">Bianco</Button></Link>
                    </Card.Footer>
                </Card>
            </CardGroup>

        <CardGroup>
            <Card className="m-3">
                <Card.Header>
                    <Card.Title>Wine Definitions</Card.Title>
                </Card.Header>
                <Card.Body>
                    <Card.Text>
                        Dictionary of wine terms and definitions
                    </Card.Text>
                </Card.Body>
                <Card.Footer>
                    <Link variant="outline-*" className="navbar-brand logo" to="definitions"><Button variant="primary">View</Button></Link>
                    
                </Card.Footer>
            </Card>
        </CardGroup>
        </>
    );
}

export default Index;