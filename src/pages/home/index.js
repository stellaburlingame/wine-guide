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
                    <Card.Title>Food Menu Items</Card.Title>
                </Card.Header>
                <Card.Body>
                    <Card.Text>
                    Find the list of ingredients of each menu item
                    </Card.Text>
                </Card.Body>
                <Card.Footer>
                    <Card.Text>
                    **In Progress**
                    </Card.Text>
                    <Link variant="outline-*" className="navbar-brand logo" to="/food"><Button variant="primary">View</Button></Link>
                    
                </Card.Footer>
            </Card>
            {/* <Card className="m-3">
                <Card.Header>
                    <Card.Title>Cocktail Menu Items</Card.Title>
                </Card.Header>
                <Card.Body>
                    <Card.Text>
                    Find the list of ingredients and serving sizes for our cocktail items
                    </Card.Text>
                </Card.Body>
                <Card.Footer>
                    <Link variant="outline-*" className="navbar-brand logo" to="/cocktail"><Button variant="primary">View</Button></Link>
                </Card.Footer>
            </Card> */}
        </CardGroup>
        
        <CardGroup>
                <Card  className="m-3">
                    <Card.Header>
                        <Card.Title>Fish Specifications</Card.Title>
                    </Card.Header>
                    <Card.Body>
                        <Card.Text>
                        A list of all species we have offered recently.
                        </Card.Text>
                    </Card.Body>
                    <Card.Footer>
                        <Link variant="outline-*" className="navbar-brand logo" to="/specs"><Button variant="primary">View</Button></Link>
                    </Card.Footer>
                </Card>
                <Card  className="m-3">
                    <Card.Header>
                        <Card.Title>Wine Menu Items</Card.Title>
                    </Card.Header>
                    <Card.Body>
                        <Card.Text>
                        Figure out details of our wine listings
                        </Card.Text>
                    </Card.Body>
                    <Card.Footer>
                        <Link variant="outline-*" className="navbar-brand logo" to="/wine"><Button variant="primary">View</Button></Link>
                    </Card.Footer>
                </Card>
            </CardGroup>
        </>
    );
}

export default Index;