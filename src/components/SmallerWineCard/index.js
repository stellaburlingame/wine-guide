import React from "react";
// import './index.css';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import Row from 'react-bootstrap/Row';
import Badge from 'react-bootstrap/Badge';
import ProgressBar from 'react-bootstrap/ProgressBar';

import icons from "../../components/Icons/icons.json";

const sustainabilityIcon = icons.filter(icon => icon.Type === "Sustainable")[0]
const veganIcon = icons.filter(icon => icon.Type === "Vegan")[0]

function formatText(text) {
    return text?.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
}
function getIcons(wine) {
    // Compute the array of icon elements to render
    const iconArray = icons.map((icon, i) => {
        const lowerKeywords = icon.Keywords?.map(k => k.toLowerCase()) || [];
        
        // const match = lowerKeywords.some(keyword => `${wine["Summary"] ?? ""} ${wine["Flavor"] ?? ""} ${wine["Aroma"] ?? ""} ${wine["Body Characteristics"] ?? ""} ${wine["Tannin Characteristics"] ?? ""}`.toLowerCase().includes(keyword)
        const match = lowerKeywords.some(keyword => `${wine["Top Icons"] ??  ""}`.toLowerCase().includes(keyword)
        );
        return match ? (
        <React.Fragment key={i}>
            <span
            className="badge"
            style={{ marginRight: "0.5em", backgroundColor: icon.Color, color: icon.TextColor }}
            >
            {icon.Icon} {icon.Type}
            </span>
            {/* <span key={i} title={icon.Type} style={{ marginRight: "0.5em" }}>{icon.Icon}</span>                                         */}
        </React.Fragment>
        ) : null;
    });
    // Only render ListGroup.Item if there are icons to display
    return iconArray.filter(Boolean).length > 0 && (
    <>
        {wine['Sustainability'] && (
        <span
            className="badge"
            style={{ marginRight: "0.5em", backgroundColor: sustainabilityIcon.Color, color: sustainabilityIcon.TextColor}}
            >
            
            {sustainabilityIcon.Icon} {sustainabilityIcon.Type}
            </span>
        )}
        {wine['Vegan'] && (
        <span
            className="badge"
            
            style={{ marginRight: "0.5em", backgroundColor: veganIcon.Color, color: veganIcon.TextColor}}
            >
            
            {veganIcon.Icon} {veganIcon.Type}
            </span>
        )}
        {iconArray}
    </>
    );
}


function Index(props) {
    const { wine, index, handleDefinitionShow, handleModalShow, state } = props;
    return (
    <Card style={{height: '97%'}} className='wine-card' bg={"Light"}>
    <Card.Header>
        <Card.Text>
        {wine["Top Bottle"] && (
            <Badge className="wine-top-selling">⭐️ Top Selling Bottle</Badge>
        )} {' '}
        {wine["Top Glass"] && (
            <Badge className="wine-top-selling">⭐️ Top Selling Glass</Badge>
        )} {' '}
        <span className=".card-title" style={{ fontWeight: 'bold' }}>
            {wine['Wine Name']}
        </span>
        {' '} <Badge bg='secondary'>{wine['Vintage']}</Badge> {' '}
        {wine.DOCG && (
            <Badge className="wine-docg" onClick={() => handleDefinitionShow("DOCG")} style={{ cursor: 'pointer' }}>DOCG</Badge>
        )} {' '}
        {wine.DOC && (
            <Badge className="wine-doc" onClick={() => handleDefinitionShow("DOC")} style={{ cursor: 'pointer' }}>DOC</Badge>
        )} {' '}
        {!isNaN(parseFloat(wine.Glass_Price)) && parseFloat(wine.Glass_Price) > 0 && (
            <Badge bg='success' className="wine-price">${parseInt(wine.Glass_Price)}/gls</Badge>
        )} {' '}
        {!isNaN(parseFloat(wine.Half_Bottle_Price)) && parseFloat(wine.Half_Bottle_Price) > 0 && (
            <Badge bg='success' className="wine-price">${parseInt(wine.Half_Bottle_Price)}/half btl</Badge>
        )} {' '}
        {!isNaN(parseFloat(wine.Bottle_Price)) && parseFloat(wine.Bottle_Price) > 0 && (
            <Badge bg='success' className="wine-price">${parseInt(wine.Bottle_Price)}/btl</Badge>
        )}
        </Card.Text>
    </Card.Header>
    <Card.Body className="wine-card-body">
        <Row>
        <ListGroup.Item className="icon-wrapper">
            {wine['Region'] === "Piemonte" && (
            <Badge className="wine-piemonte">✨ Piemonte</Badge>
            )}{' '}
            {getIcons(wine, handleModalShow)}
        </ListGroup.Item>
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
                <span>
                <span dangerouslySetInnerHTML={{ __html: formatText(wine["Summary"]) }} />
                </span>
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

            {/* {wine["Sweetness"] && (
        <ListGroup.Item><strong>Sweetness:</strong> {wine["Sweetness"]}</ListGroup.Item>
        )}   */}
            <ListGroup.Item>
                <strong>Body: </strong>
                <span>
                {wine["Body Characteristics"]}
                </span>
                <div className="wine-specs__body" data-testid="wine-specs__body">
                <div>
                    <span className="wine-specs__body--medium">Light</span>
                    <span className="wine-specs__body--medium">Medium</span>
                    <span className="wine-specs__body--medium">Full</span>
                </div>
                <ProgressBar className="bg-wine-body" style={{ '--color-bg': wine['Hex'] }} now={wine["Body"]?.toLowerCase() === "full" ? 100 :
                    wine["Body"]?.toLowerCase() === "medium to full" ? 75 :
                    wine["Body"]?.toLowerCase() === "medium" ? 50 :
                        wine["Body"]?.toLowerCase() === "light to medium" ? 25 :
                        wine["Body"]?.toLowerCase() === "light" ? 10 : 0} />
                </div>
            </ListGroup.Item>
            {wine['Tannin Level'] !== "" && (
                <ListGroup.Item>
                <strong>Tannins: </strong>
                <span>
                    {wine["Tannin Characteristics"]}
                </span>

                <div className="wine-specs__body" data-testid="wine-specs__tannins">
                    <div>
                    <span className="wine-specs__body--medium">Low</span>
                    <span className="wine-specs__body--medium">Medium</span>
                    <span className="wine-specs__body--medium">High</span>
                    </div>

                    <ProgressBar className="bg-wine-body" style={{ '--color-bg': wine['Hex'] }} now={wine["Tannin Level"]?.toLowerCase() === "high" ? 100 :
                    wine["Tannin Level"]?.toLowerCase() === "medium to high" ? 75 :
                        wine["Tannin Level"]?.toLowerCase() === "medium" ? 50 :
                        wine["Tannin Level"]?.toLowerCase() === "medium to low" ? 25 :
                            wine["Tannin Level"]?.toLowerCase() === "low" ? 0 : 0} />
                </div>
                </ListGroup.Item>
            )}
            </ListGroup>
        </Row>
    </Card.Body>
    </Card>
    );
}

export default Index;