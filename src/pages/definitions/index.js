

import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';

class DefinitionsPage extends React.Component {
    constructor(props) {
        super(props);
            this.state = {
            definitions: []
            };
    }

    componentDidMount() {
        fetch(`${process.env.PUBLIC_URL}/assets/definitions.json`)
        .then(res => res.json())
        .then(data => {
            this.setState({ definitions: data });
        })
        .catch(err => console.log(err));
    }

    render() {
        return (
        <Container className="my-4">
            <h2 className="mb-4">Wine Definitions</h2>
            <Row>
            {this.state.definitions.map((def, index) => (
                <Col key={index} sm={12} md={6} lg={4} className="mb-4">
                <Card>
                    <Card.Header>
                        <Card.Title>{def.Name}</Card.Title>
                    </Card.Header>
                    <Card.Body className='p-3'>
                        <Card.Text dangerouslySetInnerHTML={{ __html: def.Definition }} />
                    </Card.Body>
                </Card>
                </Col>
            ))}
            </Row>
        </Container>
        );
    }
}

export default DefinitionsPage;