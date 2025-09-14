import React from "react";
// import './index.css';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import Row from 'react-bootstrap/Row';
import Badge from 'react-bootstrap/Badge';
import ProgressBar from "../ProgressBar";
import { ReactComponent as RotatedLogo } from '../../pages/wine/rotated.svg';
import regions from "../../components/Regions/regions.json";

import SideBadge from "../SideBadge";
import DefinitionModal from "../DefinitionModal";
import WineModal from "../WineModal";

import { Icons, Vintage, PriceBadge, DOC, DOCG, TopBottle, TopGlass } from "../Badges";

import TextFormat from "../TextFormat";


function Index(props) {
    const { wine, index, handleDefinitionShow, handleModalShow, state, handleModalClose } = props;
    return (
    <Card className='wine-card' bg={"Light"}>
    <Card.Header>
        <Card.Text>
        {wine["Top Bottle"] && (
            <TopBottle />
        )} {' '}
        {wine["Top Glass"] && (
            <TopGlass />
        )} {' '}
        <span className=".card-title" style={{ fontWeight: 'bold', fontSize: '.95rem' }}>
            {wine['Wine Name']}
        </span>
        {' '} <Vintage>{wine['Vintage']}</Vintage> {' '}
        {wine.DOCG && (
            <DOCG onClick={() => handleDefinitionShow("DOCG")} />
        )} {' '}
        {wine.DOC && (
            <DOC onClick={() => handleDefinitionShow("DOC")} />
        )} {' '}
        <PriceBadge wine={wine} />
        </Card.Text>
    </Card.Header>
    <Card.Body className="wine-card-body">
        <Row>
        <ListGroup.Item className="icon-wrapper">
            {<Icons wine={wine} handleModalShow={handleModalShow} handleDefinitionShow={handleDefinitionShow}/>}
        </ListGroup.Item>
        </Row>
        <Row>
            <div
                className={`col-lg-3 col-md-3 col-sm-3 producer-background ${state.producerOffsetClasses ? state.producerOffsetClasses[index] : ''}`}
                style={{
                '--producer-bg': `url(${process.env.PUBLIC_URL}/photos/producer/padded/${encodeURIComponent(wine["Producer"])}.png)`
                }}
            >
            {wine['Similar Wines'] &&
            <SideBadge onClick={() => handleModalShow(<WineModal specs={props.state.specs} wine={wine} onHide={handleModalClose} />, true)} style={{ cursor: 'pointer' }}
            />
            }
        <div className="wine-card-image-wrapper">
            <RotatedLogo
                className={wine["Top Icons"]?.includes("Bubbly/Sparkling") ? "" : "bubbles-inactive"}
                style={{
                zIndex: 1,
                position: 'absolute',
                top: 10,
                right: -15,
                width: 'auto',
                height: '5rem',
                // CSS variables consumed inside the SVG (see rotated.svg edits)
                '--wine-base': wine.Hex || '#6B0F1A',
                '--bubbles-stroke': wine.Hex || '#6B0F1A',
                }} />
            {wine['PDF'] ? (
                <a href={`${process.env.PUBLIC_URL}/pdfs/${wine['PDF']}`} target="_blank" rel="noopener noreferrer">
                <Card.Img
                    onError={({ currentTarget }) => {
                    currentTarget.onerror = null;
                    currentTarget.src = `${process.env.PUBLIC_URL}/photos/NA.png`;
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
                    currentTarget.src = `${process.env.PUBLIC_URL}/photos/NA.png`;
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
            </ListGroup.Item>
            )}
            {wine["Unique Summary"] && (
            <ListGroup.Item>
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
            <ListGroup.Item><strong>Winemaker paring:</strong> {wine["General Recommended Accompanies"]}</ListGroup.Item>
        </ListGroup>
        </Row>
        <Row className="tasting-notes-wrapper">
        <div className="card-header">
            <strong>Tasting Notes</strong>
            {/* {icons(wine)} */}
        </div>
        <div className="row">
            <ListGroup variant="flush" className="col-lg-6 col-md-12 col-sm-12 wine-list-group">
            <ListGroup.Item><strong>Flavor:</strong> {wine["Flavor"]}</ListGroup.Item>
            <ListGroup.Item><strong>Aroma:</strong> {wine["Aroma"]}</ListGroup.Item>
            {wine["Finish"] && (
                <ListGroup.Item><strong>Finish:</strong> {wine["Finish"]}</ListGroup.Item>
            )}
            {wine["Acidity"] && (
                <ListGroup.Item><strong>Acidity:</strong> {wine["Acidity"]}</ListGroup.Item>
            )}
            {/* {wine["Sweetness"] && (
        <ListGroup.Item><strong>Sweetness:</strong> {wine["Sweetness"]}</ListGroup.Item>
        )}   */}
            </ListGroup>
            <ListGroup className="col-lg-6 col-md-6 col-sm-12 wine-list-group" variant="flush">
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
        </div>
        </Row>
        <Row className="winemaking-wrapper">
        <strong className="card-header">Winemaking</strong>
        <div className="winemaking p-0">
            <ListGroup variant="flush">
            <ListGroup.Item><strong>Vinification:</strong> {wine["Vinification"]}</ListGroup.Item>
            <ListGroup.Item><strong>Maturation:</strong> {wine["Maturation"]}</ListGroup.Item>
            {wine["Aging"] && (
                <ListGroup.Item><strong>Aging:</strong> {wine["Aging"]}</ListGroup.Item>
            )}
            {wine["Blend"] && (
                <ListGroup.Item><strong>Blend:</strong> {wine["Blend"]}</ListGroup.Item>
            )}
            {wine["Region"] && (
                <ListGroup.Item><strong>Region:</strong> {regions[wine?.Region]?.["Region location"]}</ListGroup.Item>
            )}
            {wine["Appelation"] && (
                <ListGroup.Item><strong>Appelation:</strong> {wine["Appelation"]}</ListGroup.Item>
            )}
            {wine["Vineyard"] && (
                <ListGroup.Item><strong>Vineyard:</strong> {wine["Vineyard"]}</ListGroup.Item>
            )}
            </ListGroup>
        </div>
        <div className="wine-region-image p-0" onClick={() => handleModalShow(
            <DefinitionModal
            {...{'Name': regions[wine?.Region]?.["Region location"],
            'Definition': <>{regions[wine?.Region]?.["Region Summary"]}</>,
            'Image': `${process.env.PUBLIC_URL}/photos/region/${regions[wine?.Region]?.["Region Image"]}`}}
            />
        )} style={{ cursor: 'pointer' }}>
            <img
            src={`${process.env.PUBLIC_URL}/photos/region/${regions[wine?.Region]?.["Region Image"]}`}
            alt={regions[wine?.Region]?.["Region location"]}
            onError={(e) => { e.target.onerror = null; e.target.src = `${process.env.PUBLIC_URL}/photos/NA.png`; } } />
        </div>
        </Row>
    </Card.Body>
    </Card>
    );
}

export default Index;