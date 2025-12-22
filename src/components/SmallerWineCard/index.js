import React from "react";
import './index.css';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import Row from 'react-bootstrap/Row';
import Badge from 'react-bootstrap/Badge';
import ProgressBar from "../ProgressBar";

import { Icons, Vintage, PriceBadge, DOC, DOCG, TopBottle, TopGlass } from "../Badges";

import TextFormat from "../TextFormat";
import NA from '../WineCard/NA.png';


function Index(props) {
    const { wine, index, state } = props;
    return (
    <Card style={{height: '97%'}} className='small-wine-card' bg={"Light"}>
    <Card.Header>
        <Card.Text>
        {wine["Top Bottle"] && (
            <TopBottle />
        )} {' '}
        {wine["Top Glass"] && (
            <TopGlass />
        )} {' '}
        <span className="card-title" style={{ fontWeight: 'bold' }}>
            {wine['Wine Name']}
        </span>
        {' '} <Vintage>{wine['Vintage']}</Vintage> {' '}
        {wine.DOCG && (
            <DOCG />
        )} {' '}
        {wine.DOC && (
            <DOC />
        )}
        <PriceBadge wine={wine} />
        </Card.Text>
    </Card.Header>
    <Card.Body className="wine-card-body">
        <Row>
        <ListGroup.Item className="icon-wrapper">
            <Icons wine={wine} />
        </ListGroup.Item>
        </Row>
        <Row className="wine-card-body">
        <div
            className={`col-lg-3 col-md-3 col-sm-3 producer-background ${state.producerOffsetClasses ? state.producerOffsetClasses[index] : ''}`}
            style={{
            '--producer-bg': `url(${process.env.PUBLIC_URL}/photos/producer/padded/${encodeURIComponent(wine["Producer"])}.png)`
            }}
        >

        <div className="wine-card-image-wrapper">
            {wine['PDF'] ? (
                <a href={`${process.env.PUBLIC_URL}/pdfs/${wine['PDF']}`} target="_blank" rel="noopener noreferrer">
                <Card.Img
                    onError={({ currentTarget }) => {
                    currentTarget.onerror = null;
                    currentTarget.src = NA;
                    } }
                    variant="top"
                    src={`${process.env.PUBLIC_URL}/photos/wine/${wine["Image"]}`}
                    className="wine-card-image"
                    style={{ cursor: "pointer" }} />
                </a>
            ) : (
                <Card.Img
                onError={({ currentTarget }) => {
                    currentTarget.onerror = null;
                    currentTarget.src = NA;
                } }
                variant="top"
                src={`${process.env.PUBLIC_URL}/photos/wine/${wine["Image"]}`}
                className="wine-card-image" />
            )}
            </div>
        </div>
        <ListGroup variant="flush" className="col-lg-9 col-md-9 col-sm-9 wine-list-group">
            {/* {icons(wine)} */}
            {wine["Summary"] && (
            <ListGroup.Item>
                {TextFormat(wine["Summary"])}
                <br />
                <strong>Uniqueness:</strong> {wine["Unique Summary"]}
            </ListGroup.Item>
            )}
            <ListGroup.Item>
            <strong>Stella pairing:</strong> {wine["Stella Recommended"].split(', ').map((pairing, i) => (
                <Badge bg="light" text="dark" key={i} className="wine-pairing-text">
                {pairing}
                </Badge>
            ))}
            </ListGroup.Item>

            <ListGroup.Item><strong>Flavor:</strong> {wine["Flavor"]}</ListGroup.Item>
            <ListGroup.Item><strong>Aroma:</strong> {wine["Aroma"]}</ListGroup.Item>
            <ListGroup.Item>
                <strong>Body: </strong>{wine["Body Characteristics"]}
                <ProgressBar type="body" value={wine["Body"]} color={wine['Hex']} />
            </ListGroup.Item>
            {wine['Tannin Level'] !== "" && (
                <ListGroup.Item>
                    <strong>Tannins: </strong>{wine["Tannin Characteristics"]}
                    <ProgressBar type="tannin" value={wine["Tannin Level"]} color={wine['Hex']} />
                </ListGroup.Item>
            )}
            </ListGroup>
        </Row>
    </Card.Body>
    </Card>
    );
}

export default Index;