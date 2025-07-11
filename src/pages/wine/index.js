import React from "react";
import { Card, ListGroup } from "react-bootstrap";
import Badge from 'react-bootstrap/Badge';
import Row from 'react-bootstrap/Row';
import DefinitionModal from '../../components/DefinitionModal';

import icons from "../../components/Icons/icons.json";

import "./print.css";
import "./index.css";

class index extends React.Component {
    state = {
        specs: [],
        value: "all",
        showDefinitionModal: false,
        definitions: [],
        currentTerm: {
          Secondary_Text: "",
          Definition: "",
          Image: "",
          Name: ""
        },
        showScrollToTop: false,
    }
    componentDidMount() {
        fetch(`${process.env.PUBLIC_URL}/assets/${this.props.type}.json`)
        .then((res) => res.json())
          .then((data) => {
              data.forEach((spec) => {
                let wineName = spec['Wine Name'] + spec['Vintage'];
                console.log(wineName.replace(/[^a-z0-9]/gi, ''));
              })
              this.setState({ specs: data });
          })
          .catch((err) => console.log(err));
        fetch(`${process.env.PUBLIC_URL}/assets/definitions.json`)
        .then(res => res.json())
        .then(data => {
            this.setState({ definitions: data });
        })
        .catch(err => console.log(err));
        window.addEventListener('scroll', this.checkScrollTop);
    }

    componentWillUnmount() {
        window.removeEventListener('scroll', this.checkScrollTop);
    }
    scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    checkScrollTop = () => {
        if (!this.state.showScrollToTop && window.pageYOffset > 400) {
            this.setState({ showScrollToTop: true });
        } else if (this.state.showScrollToTop && window.pageYOffset <= 400) {
            this.setState({ showScrollToTop: false });
        }
    }
    componentDidUpdate(prevProps) {
        if (this.props.type !== prevProps.type) {
            fetch(`${process.env.PUBLIC_URL}/assets/${this.props.type}.json`)
              .then((res) => res.json())
              .then((data) => {
                  this.setState({ specs: data });
              })
              .catch((err) => console.log(err));
        }
    }
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
    }
    handleChange(event) {
        this.setState({value: event.target.value});
    }
    handleModalShow = (term) => {
      this.setState({ showDefinitionModal: true, currentTerm: term });
    }
    handleDefinitionShow = (term) => {
        const matched = this.state.definitions.find(
            d => d.Name?.toLowerCase() === (term?.Name || term)?.toLowerCase()
        );
        if (matched) {
            this.handleModalShow(matched);
        }
    }
    handleDefinitionClose = () => {
        this.setState({ showDefinitionModal: false });
    }
    checkIfAllFilter(value) {
        if (value === "all") {
            return Object.keys(this.state.specs);
        }
        else {
            return Object.keys(this.state.specs);
            // return [value];
        }
    }
  render() {
        return (
            <>
              <Row className="col-12 wine-print">
                {this.state.specs.map(( data1, index) => (
                      <div className="wine-wrapper col-md-12 col-lg-6 col-sm-12" key={index}>
                        <Card className='wine-card' bg={"Light"}>
                          <Card.Header>
                            <Card.Title>
                              {data1['Wine Name']} {' '} <Badge bg='secondary'>{data1['Vintage']}</Badge> {' '}
                              {data1['Region'] === "Piemonte, Italy" && (
                                <Badge className="wine-piemonte" onClick={() => this.handleDefinitionShow("Piemonte")} style={{ cursor: 'pointer' }}>Piemonte</Badge>
                              )}{' '}
                              {data1.DOCG && (
                                <Badge className="wine-docg" onClick={() => this.handleDefinitionShow("DOCG")} style={{ cursor: 'pointer' }}>DOCG</Badge>
                              )} {' '}
                              {data1.DOC && (
                                <Badge className="wine-doc" onClick={() => this.handleDefinitionShow("DOC")} style={{ cursor: 'pointer' }}>DOC</Badge>
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
                            </Card.Title>
                          </Card.Header>
                          <Card.Body className="wine-card-body">
                            <Row>
                            <div className="col-lg-3 col-md-3 col-sm-3">
                              <div className="wine-card-image-wrapper">
                                {data1['PDF'] ? (
                                  <a href={`${process.env.PUBLIC_URL}/pdfs/${data1['PDF']}`} target="_blank" rel="noopener noreferrer">
                                    <Card.Img
                                      onError={({ currentTarget }) => {
                                        currentTarget.onerror = null;
                                        currentTarget.src = `${process.env.PUBLIC_URL}/photos/NA.png`;
                                      }}
                                      variant="top"
                                      src={`${process.env.PUBLIC_URL}/photos/wine/${data1["Image"]}`}
                                      className="wine-card-image"
                                      style={{ cursor: "pointer" }}
                                    />
                                  </a>
                                ) : (
                                  <Card.Img
                                    onError={({ currentTarget }) => {
                                      currentTarget.onerror = null;
                                      currentTarget.src = `${process.env.PUBLIC_URL}/photos/NA.png`;
                                    }}
                                    variant="top"
                                    src={`${process.env.PUBLIC_URL}/photos/wine/${data1["Image"]}`}
                                    className="wine-card-image"
                                  />
                                )}
                              </div>
                            </div>
                            <div className="col-lg-9 col-md-9 col-sm-9">
                              <ListGroup variant="flush" >
                              {data1["Summary"] && (
                                <ListGroup.Item>
                                  <span>
                                    <span dangerouslySetInnerHTML={{ __html: this.format(data1["Summary"]) }} />
                                  </span>
                                </ListGroup.Item>
                              )}
                              <ListGroup.Item>
                                <strong>Stella pairing:</strong> {data1["Stella Recommended"]}
                              </ListGroup.Item>
                              <ListGroup.Item><strong>Winemaker paring:</strong> {data1["General Recommended Accompanies"]}</ListGroup.Item>
                                
                              </ListGroup>
                            </div>
                            </Row>
                            <Row className="tasting-notes-wrapper">
                            <div className="card-header row">
                              <strong className="col" style={{maxWidth: 'fit-content'}} >Tasting Notes</strong>
                              {this.icons(data1)}
                              </div>
                            <div className="row">
                              <div className="col-lg-6 col-md-12 col-sm-12">
                                <ListGroup variant="flush">
                                  <ListGroup.Item><strong>Flavor:</strong> {data1["Flavor"]}</ListGroup.Item>
                                  <ListGroup.Item><strong>Aroma:</strong> {data1["Aroma"]}</ListGroup.Item>
                                    {data1["Finish"] && (
                                      <ListGroup.Item><strong>Finish:</strong> {data1["Finish"]}</ListGroup.Item>
                                    )}
                                    {data1["Acidity"] && (
                                      <ListGroup.Item><strong>Acidity:</strong> {data1["Acidity"]}</ListGroup.Item>
                                    )}  
                                </ListGroup>
                              </div>
                              <div className="col-lg-6 col-md-6 col-sm-12">
                                <ListGroup variant="flush">
                                  <ListGroup.Item>
                                    <strong>Body: </strong>
                                    <span className="wine-pairing-text">
                                      {data1["Body Characteristics"]}
                                    </span>
                                    <div className="wine-specs__body" data-testid="wine-specs__body">
                                      <div>
                                        <span className="wine-specs__body--medium">Light</span>
                                        <span className="wine-specs__body--medium">Medium</span>
                                        <span className="wine-specs__body--medium">Full</span>
                                      </div>
                                      <div className="gradient-chart__background">
                                        <div className="gradient-chart__triangle-indicator"
                                          style={{
                                            left: data1["Body"]?.toLowerCase() === "full" ? "100%" :
                                                  data1["Body"]?.toLowerCase() === "medium to full" ? "77%" :
                                                  data1["Body"]?.toLowerCase() === "medium" ? "52%" :
                                                  data1["Body"]?.toLowerCase() === "light to medium" ? "27%" :
                                                  data1["Body"]?.toLowerCase() === "light" ? "2%" : "2%",
                                          }}
                                          aria-label={`Wine is ${data1["Body"]} body`}>
                                          <span>&#9660;</span>
                                        </div>
                                      </div>
                                    </div>
                                  </ListGroup.Item>
                                  {this.props.type !== "bianco" && (
                                    <ListGroup.Item>
                                      <strong>Tannins: </strong>
                                      <span className="wine-pairing-text">
                                        {data1["Tannin Characteristics"]}
                                      </span>
                                      <div className="wine-specs__body" data-testid="wine-specs__tannins">
                                        <div>
                                          <span className="wine-specs__body--medium">Low</span>
                                          <span className="wine-specs__body--medium">Medium</span>
                                          <span className="wine-specs__body--medium">High</span>
                                        </div>
                                        <div className="gradient-chart__background">
                                          <div className="gradient-chart__triangle-indicator"
                                            style={{
                                              left: data1["Tannin Level"]?.toLowerCase() === "high" ? "100%" :
                                                    data1["Tannin Level"]?.toLowerCase() === "medium" ? "50%" :
                                                    data1["Tannin Level"]?.toLowerCase() === "low" ? "0%" : "0%",
                                            }}
                                            aria-label={`Wine has ${data1["Tannin Level"]} tannins`}>
                                            <span>&#9660;</span>
                                          </div>
                                        </div>
                                      </div>
                                    </ListGroup.Item>
                                    
                                  )}
                                </ListGroup>
                              </div>
                            </div>
                            </Row>
                            <Row className="winemaking-wrapper">
                              <strong className="card-header">Winemaking</strong>
                              <div className="winemaking p-0">
                                <ListGroup variant="flush" >
                                  <ListGroup.Item><strong>Vinification:</strong> {data1["Vinification"]}</ListGroup.Item>
                                  <ListGroup.Item><strong>Maturation:</strong> {data1["Maturation"]}</ListGroup.Item>
                                  {data1["Aging"] && (
                                    <ListGroup.Item><strong>Aging:</strong> {data1["Aging"]}</ListGroup.Item>
                                  )}
                                  {data1["Blend"] && (
                                    <ListGroup.Item><strong>Blend:</strong> {data1["Blend"]}</ListGroup.Item>
                                  )}
                                  {data1["Region"] && (
                                    <ListGroup.Item><strong>Region:</strong> {data1["Region"]}</ListGroup.Item>
                                  )}
                                  {data1["Appelation"] && (
                                    <ListGroup.Item><strong>Appelation:</strong> {data1["Appelation"]}</ListGroup.Item>
                                  )}
                                  {data1["Vineyard"] && (
                                    <ListGroup.Item><strong>Vineyard:</strong> {data1["Vineyard"]}</ListGroup.Item>
                                  )}
                                </ListGroup>
                              </div>
                              <div className="wine-region-image p-0">
                                <img
                                  src={`${process.env.PUBLIC_URL}/photos/region/${data1["Region Image"]}`}
                                  alt={data1["Region"]}
                                  onError={(e) => { e.target.onerror = null; e.target.src = `${process.env.PUBLIC_URL}/photos/NA.png`; }}
                                />
                              </div>
                            </Row>
                          </Card.Body>
                        </Card>
                      </div>
                    ))}
                  {/* <p className="pages" style={{color: "white"}}>
                    Page {rowIndex + 1} of {Math.ceil(this.state.specs.length / 2)}
                  </p> */}
            </Row>

            <DefinitionModal
              show={this.state.showDefinitionModal}
              onHide={this.handleDefinitionClose}
              Name={this.state.currentTerm?.Name}
              Definition={this.state.currentTerm?.Definition}
              Secondary_Text={this.state.currentTerm?.Secondary_Text}
              Image={this.state.currentTerm?.Image}
            />
            {this.state.showScrollToTop && (
              <button
                onClick={this.scrollToTop}
                className="scroll-to-top-button"
                style={{
                }}
              >
                ↑ Top
              </button>
            )}
        </>
        )
    }
  

  format(text) {
    return text?.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
  }

  icons(data1) {
    return <span className="col icon-wrapper">
      {icons.map((icon, i) => {
        const lowerKeywords = icon.Keywords?.map(k => k.toLowerCase()) || [];
        const match = lowerKeywords.some(keyword => `${data1["Summary"] ?? ""} ${data1["Flavor"] ?? ""} ${data1["Aroma"] ?? ""} ${data1["Body Characteristics"] ?? ""} ${data1["Tannin Characteristics"] ?? ""}`.toLowerCase().includes(keyword)
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
                    this.handleModalShow({
                      Name: icon.Type,
                      Definition: <><strong>Definition: </strong>{icon.Definition.replace(/\*\*/g, '').trim()}</>,
                      Secondary_Text: <><strong>{data1["Wine Name"]}: </strong>{sentence.replace(/\*\*/g, '').trim()}</>,
                      Image: ""
                    });
                    return;
                  }
                }
                // fallback: show first keyword match or empty string
                const allText = `${data1["Summary"] ?? ""} ${data1["Flavor"] ?? ""} ${data1["Aroma"] ?? ""} ${data1["Body Characteristics"] ?? ""} ${data1["Tannin Characteristics"] ?? ""}`;
                const fallbackKeyword = lowerKeywords.find(k => allText.toLowerCase().includes(k)) || "";
                this.handleModalShow({
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
      })}
    </span>;
  }
}

export default index;