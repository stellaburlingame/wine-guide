import React from "react";
// import './index.css';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import Row from 'react-bootstrap/Row';
import Badge from 'react-bootstrap/Badge';
import ProgressBar from 'react-bootstrap/ProgressBar';
import { ReactComponent as RotatedLogo } from '../../pages/wine/rotated.svg';
import regions from "../../components/Regions/regions.json";

import icons from "../../components/Icons/icons.json";

const sustainabilityIcon = icons.filter(icon => icon.Type === "Sustainable")[0]
const veganIcon = icons.filter(icon => icon.Type === "Vegan")[0]

function formatText(text) {
    return text?.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
}
function getIcons(data1, handleModalShow) {
    // Compute the array of icon elements to render
    const iconArray = icons.map((icon, i) => {
        const lowerKeywords = icon.Keywords?.map(k => k.toLowerCase()) || [];
        
        // const match = lowerKeywords.some(keyword => `${data1["Summary"] ?? ""} ${data1["Flavor"] ?? ""} ${data1["Aroma"] ?? ""} ${data1["Body Characteristics"] ?? ""} ${data1["Tannin Characteristics"] ?? ""}`.toLowerCase().includes(keyword)
        const match = lowerKeywords.some(keyword => `${data1["Top Icons"] ??  ""}`.toLowerCase().includes(keyword)
        );
        return match ? (
        <React.Fragment key={i}>
            <span
            className="badge"
            onClick={() => {
                const fields = ["Summary", "Flavor", "Aroma", "Body Characteristics", "Tannin Characteristics"];
                for (const field of fields) {
                const text = data1[field];
                if (!text) continue;
                const sentence = text.split(/(?<=[.?!])\s+/).find(sent => lowerKeywords.some(keyword => sent.toLowerCase().includes(keyword))
                );
                if (sentence) {
                    handleModalShow({
                    Name: icon.Type,
                    Definition: <><strong>Definition: </strong>{icon.Definition.replace(/\*\*/g, '').trim()}</>,
                    Secondary_Text: <><strong>{data1["Wine Name"]}: </strong>{sentence.replace(/\*\*/g, '').trim()}</>,
                    Image: ""
                    });
                    return;
                }
                }
                // fallback: show first keyword match or empty string
                const allText = `${data1["Summary"] ?? ""} ${data1["Flavor"] ?? ""} ${data1["Aroma"] ?? ""} ${data1["Body Characteristics"] ?? ""} ${data1["Tannin Characteristics"] ?? ""} ${data1["Tannin Characteristics"] ?? ""}`;
                const fallbackKeyword = lowerKeywords.find(k => allText.toLowerCase().includes(k)) || "";
                handleModalShow({
                Name: icon.Type,
                Definition: icon.Definition,
                Secondary_Text: fallbackKeyword,
                Image: ""
                });
            } }
            style={{ marginRight: "0.5em", backgroundColor: icon.Color, color: icon.TextColor, cursor: "pointer" }}
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
        {data1['Sustainability'] && (
        <span
            className="badge"
            onClick={() => {
                handleModalShow({
                    Name: sustainabilityIcon.Type,
                    Definition: <><strong>Definition: </strong>{sustainabilityIcon.Definition.replace(/\*\*/g, '').trim()}</>,
                    Secondary_Text: <><strong>{data1["Wine Name"]}: </strong>{data1["Sustainability"].replace(/\*\*/g, '').trim()}</>,
                    Image: ""
                });
            }}
            
            style={{ marginRight: "0.5em", backgroundColor: sustainabilityIcon.Color, color: sustainabilityIcon.TextColor, cursor: "pointer" }}
            >
            
            {sustainabilityIcon.Icon} {sustainabilityIcon.Type}
            </span>
        )}
        {data1['Vegan'] && (
        <span
            className="badge"
            onClick={() => {
                handleModalShow({
                    Name: veganIcon.Type,
                    Definition: <><strong>Definition: </strong>{veganIcon.Definition.replace(/\*\*/g, '').trim()}</>,
                    Image: ""
                });
            }}
            
            style={{ marginRight: "0.5em", backgroundColor: veganIcon.Color, color: veganIcon.TextColor, cursor: "pointer" }}
            >
            
            {veganIcon.Icon} {veganIcon.Type}
            </span>
        )}
        {iconArray}
    </>
    );
}


function Index(props) {
    const { data1, index, handleDefinitionShow, handleModalShow, state } = props;
    return (
    <Card className='wine-card' bg={"Light"}>
    <Card.Header>
        <Card.Text>
        {data1["Top Bottle"] && (
            <Badge className="wine-top-selling">⭐️ Top Selling Bottle</Badge>
        )} {' '}
        {data1["Top Glass"] && (
            <Badge className="wine-top-selling">⭐️ Top Selling Glass</Badge>
        )} {' '}
        <span className=".card-title" style={{ fontWeight: 'bold' }}>
            {data1['Wine Name']}
        </span>
        {' '} <Badge bg='secondary'>{data1['Vintage']}</Badge> {' '}
        {data1.DOCG && (
            <Badge className="wine-docg" onClick={() => handleDefinitionShow("DOCG")} style={{ cursor: 'pointer' }}>DOCG</Badge>
        )} {' '}
        {data1.DOC && (
            <Badge className="wine-doc" onClick={() => handleDefinitionShow("DOC")} style={{ cursor: 'pointer' }}>DOC</Badge>
        )} {' '}
        {!isNaN(parseFloat(data1.Glass_Price)) && parseFloat(data1.Glass_Price) > 0 && (
            <Badge bg='success' className="wine-price">${parseInt(data1.Glass_Price)}/gls</Badge>
        )} {' '}
        {!isNaN(parseFloat(data1.Half_Bottle_Price)) && parseFloat(data1.Half_Bottle_Price) > 0 && (
            <Badge bg='success' className="wine-price">${parseInt(data1.Half_Bottle_Price)}/half btl</Badge>
        )} {' '}
        {!isNaN(parseFloat(data1.Bottle_Price)) && parseFloat(data1.Bottle_Price) > 0 && (
            <Badge bg='success' className="wine-price">${parseInt(data1.Bottle_Price)}/btl</Badge>
        )}
        </Card.Text>
    </Card.Header>
    <Card.Body className="wine-card-body">
        <Row>
        <ListGroup.Item className="icon-wrapper">
            {data1['Region'] === "Piemonte" && (
            <Badge className="wine-piemonte" onClick={() => handleDefinitionShow("Piemonte")} style={{ cursor: 'pointer' }}>✨ Piemonte</Badge>
            )}{' '}
            {getIcons(data1, handleModalShow)}
        </ListGroup.Item>
        </Row>
        <Row>
        <div
            className={`col-lg-3 col-md-3 col-sm-3 producer-background ${state.producerOffsetClasses[index]}`}
            style={{
            '--producer-bg': `url(${process.env.PUBLIC_URL}/photos/producer/padded/${encodeURIComponent(data1["Producer"])}.png)`
            }}
        >

            <div className="wine-card-image-wrapper">
            <RotatedLogo
                className={data1["Top Icons"]?.includes("Bubbly/Sparkling") ? "" : "bubbles-inactive"}
                style={{
                zIndex: 1,
                position: 'absolute',
                top: 10,
                right: -15,
                width: 'auto',
                height: '5rem',
                // CSS variables consumed inside the SVG (see rotated.svg edits)
                '--wine-base': data1.Hex || '#6B0F1A',
                '--bubbles-stroke': data1.Hex || '#6B0F1A',
                }} />
            {data1['PDF'] ? (
                <a href={`${process.env.PUBLIC_URL}/pdfs/${data1['PDF']}`} target="_blank" rel="noopener noreferrer">
                <Card.Img
                    onError={({ currentTarget }) => {
                    currentTarget.onerror = null;
                    currentTarget.src = `${process.env.PUBLIC_URL}/photos/NA.png`;
                    } }
                    variant="top"
                    src={`${process.env.PUBLIC_URL}/photos/wine/${data1["Image"]}`}
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
                src={`${process.env.PUBLIC_URL}/photos/wine/${data1["Image"]}`}
                className="wine-card-image" />
            )}
            </div>
        </div>
        <ListGroup variant="flush" className="col-lg-9 col-md-9 col-sm-9 wine-list-group">
            {/* {icons(data1)} */}
            {data1["Summary"] && (
            <ListGroup.Item>
                <span>
                <span dangerouslySetInnerHTML={{ __html: formatText(data1["Summary"]) }} />
                </span>
                <br />
                <strong>Uniqueness:</strong> {data1["Unique Summary"]}
            </ListGroup.Item>
            )}
            <ListGroup.Item>
            <strong>Stella pairing:</strong> {data1["Stella Recommended"].split(', ').map((pairing, i) => (
                <Badge bg="light" text="dark" key={i} className="wine-pairing-text">
                {pairing}
                </Badge>
            ))}
            </ListGroup.Item>
            <ListGroup.Item><strong>Winemaker paring:</strong> {data1["General Recommended Accompanies"]}</ListGroup.Item>

        </ListGroup>
        </Row>
        <Row className="tasting-notes-wrapper">
        <div className="card-header">
            <strong>Tasting Notes</strong>
            {/* {icons(data1)} */}
        </div>
        <div className="row">
            <ListGroup variant="flush" className="col-lg-6 col-md-12 col-sm-12 wine-list-group">
            <ListGroup.Item><strong>Flavor:</strong> {data1["Flavor"]}</ListGroup.Item>
            <ListGroup.Item><strong>Aroma:</strong> {data1["Aroma"]}</ListGroup.Item>
            {data1["Finish"] && (
                <ListGroup.Item><strong>Finish:</strong> {data1["Finish"]}</ListGroup.Item>
            )}
            {data1["Acidity"] && (
                <ListGroup.Item><strong>Acidity:</strong> {data1["Acidity"]}</ListGroup.Item>
            )}
            {/* {data1["Sweetness"] && (
        <ListGroup.Item><strong>Sweetness:</strong> {data1["Sweetness"]}</ListGroup.Item>
        )}   */}
            </ListGroup>
            <ListGroup className="col-lg-6 col-md-6 col-sm-12 wine-list-group" variant="flush">
            <ListGroup.Item>
                <strong>Body: </strong>
                <span>
                {data1["Body Characteristics"]}
                </span>
                <div className="wine-specs__body" data-testid="wine-specs__body">
                <div>
                    <span className="wine-specs__body--medium">Light</span>
                    <span className="wine-specs__body--medium">Medium</span>
                    <span className="wine-specs__body--medium">Full</span>
                </div>
                <ProgressBar className="bg-wine-body" style={{ '--color-bg': data1['Hex'] }} now={data1["Body"]?.toLowerCase() === "full" ? 100 :
                    data1["Body"]?.toLowerCase() === "medium to full" ? 75 :
                    data1["Body"]?.toLowerCase() === "medium" ? 50 :
                        data1["Body"]?.toLowerCase() === "light to medium" ? 25 :
                        data1["Body"]?.toLowerCase() === "light" ? 0 : 0} />
                </div>
            </ListGroup.Item>
            {data1['Tannin Level'] !== "" && (
                <ListGroup.Item>
                <strong>Tannins: </strong>
                <span>
                    {data1["Tannin Characteristics"]}
                </span>

                <div className="wine-specs__body" data-testid="wine-specs__tannins">
                    <div>
                    <span className="wine-specs__body--medium">Low</span>
                    <span className="wine-specs__body--medium">Medium</span>
                    <span className="wine-specs__body--medium">High</span>
                    </div>

                    <ProgressBar className="bg-wine-body" style={{ '--color-bg': data1['Hex'] }} now={data1["Tannin Level"]?.toLowerCase() === "high" ? 100 :
                    data1["Tannin Level"]?.toLowerCase() === "medium to high" ? 75 :
                        data1["Tannin Level"]?.toLowerCase() === "medium" ? 50 :
                        data1["Tannin Level"]?.toLowerCase() === "medium to low" ? 25 :
                            data1["Tannin Level"]?.toLowerCase() === "low" ? 0 : 0} />
                </div>
                </ListGroup.Item>
            )}
            </ListGroup>
        </div>
        </Row>
        <Row className="winemaking-wrapper">
        <strong className="card-header">Winemaking</strong>
        <div className="winemaking p-0">
            <ListGroup variant="flush">
            <ListGroup.Item><strong>Vinification:</strong> {data1["Vinification"]}</ListGroup.Item>
            <ListGroup.Item><strong>Maturation:</strong> {data1["Maturation"]}</ListGroup.Item>
            {data1["Aging"] && (
                <ListGroup.Item><strong>Aging:</strong> {data1["Aging"]}</ListGroup.Item>
            )}
            {data1["Blend"] && (
                <ListGroup.Item><strong>Blend:</strong> {data1["Blend"]}</ListGroup.Item>
            )}
            {data1["Region"] && (
                <ListGroup.Item><strong>Region:</strong> {regions[data1?.Region]?.["Region location"]}</ListGroup.Item>
            )}
            {data1["Appelation"] && (
                <ListGroup.Item><strong>Appelation:</strong> {data1["Appelation"]}</ListGroup.Item>
            )}
            {data1["Vineyard"] && (
                <ListGroup.Item><strong>Vineyard:</strong> {data1["Vineyard"]}</ListGroup.Item>
            )}
            </ListGroup>
        </div>
        <div className="wine-region-image p-0" onClick={() => handleModalShow(
            {
            Name: regions[data1?.Region]?.["Region location"],
            Definition: <>{regions[data1?.Region]?.["Region Summary"]}</>,
            Image: `${process.env.PUBLIC_URL}/photos/region/${regions[data1?.Region]?.["Region Image"]}`
            }
        )} style={{ cursor: 'pointer' }}>
            <img
            src={`${process.env.PUBLIC_URL}/photos/region/${regions[data1?.Region]?.["Region Image"]}`}
            alt={regions[data1?.Region]?.["Region location"]}
            onError={(e) => { e.target.onerror = null; e.target.src = `${process.env.PUBLIC_URL}/photos/NA.png`; } } />
        </div>
        </Row>
    </Card.Body>
    </Card>
    );
}

export default Index;