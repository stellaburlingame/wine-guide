import React from "react";
import { Card, ListGroup } from "react-bootstrap";
import Badge from 'react-bootstrap/Badge';
import Row from 'react-bootstrap/Row';

import "./index.css";

class index extends React.Component {
    state = {
        specs: [],
        value: "all"
    }
    componentDidMount() {
        fetch(`${process.env.PUBLIC_URL}/assets/${this.props.type}.json`)
        .then((res) => res.json())
          .then((data) => {
              this.setState({ specs: data });
          })
          .catch((err) => console.log(err));
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
                <div className="col-12 wine-print">
                  {this.state.specs.reduce((rows, data1, index) => {
                    if (index % 2 === 0) rows.push([]);
                    rows[rows.length - 1].push({ ...data1, key: index });
                    return rows;
                  }, []).map((row, rowIndex) => (
                    <React.Fragment key={rowIndex}>
                      <Row>
                        {row.map(({ key, ...data1 }) => (
                          <div className="col-md-12 col-lg-6 col-sm-12" key={key}>
                            <Card className="m-1" bg={"Light"}>
                              <Card.Header>
                                <Card.Title>
                                  {data1['Wine Name']} {' '} <Badge bg='secondary'>{data1['Vintage']}</Badge> {' '}
                                  {data1.DOCG && (
                                    <Badge className="wine-docg">DOCG</Badge>
                                  )} {' '}
                                  {data1.DOC && (
                                    <Badge className="wine-doc">DOC</Badge>
                                  )} {' '}
                                  {!isNaN(parseFloat(data1.Glass_Price)) && parseFloat(data1.Glass_Price) > 0 && (
                                    <Badge bg='success' className="wine-price"><strong>${parseInt(data1.Glass_Price)}</strong>/gls</Badge>
                                  )} {' '}
                                  {!isNaN(parseFloat(data1.Bottle_Price)) && parseFloat(data1.Bottle_Price) > 0 && (
                                    <Badge bg='success' className="wine-price"><strong>${parseInt(data1.Bottle_Price)}</strong>/btl</Badge>
                                  )}
                                </Card.Title>
                              </Card.Header>
                              <Card.Body>
                                <Row>
                                <div className="col-lg-3 col-md-3 col-sm-3">
                                  <div className="wine-card-image-wrapper">
                                    <Card.Img
                                      onError={({ currentTarget }) => {
                                        currentTarget.onerror = null;
                                        currentTarget.src = `${process.env.PUBLIC_URL}/photos/NA.png`;
                                      }}
                                      variant="top"
                                      src={`${process.env.PUBLIC_URL}/photos/wine/${data1["Image"]}`}
                                      className="wine-card-image"
                                    />
                                  </div>
                                </div>
                                <div className="col-lg-9 col-md-9 col-sm-9">

                                  <ListGroup variant="flush" >
                                  {data1["Summary"] && (
                                    <ListGroup.Item>
                                      <span dangerouslySetInnerHTML={{ __html: data1["Summary"]?.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>") }} />
                                    </ListGroup.Item>
                                  )}
                                  <ListGroup.Item><strong>Winemaker Recommended:</strong> {data1["General Recommended Accompanies"]}</ListGroup.Item>
                                  <ListGroup.Item>
                                  <strong>Stella Recommended:</strong> {data1["Stella Recommended"]}
                                  </ListGroup.Item>
                                    
                                  </ListGroup>
                                </div>
                                <div className="row">
                                  <div className="col-lg-6 col-md-12 col-sm-12">
                                    <strong>Tasting Notes:</strong>
                                    <ListGroup variant="flush">
                                      <ListGroup.Item><strong>Flavor:</strong> {data1["Flavor"]}</ListGroup.Item>
                                      <ListGroup.Item><strong>Aroma:</strong> {data1["Aroma"]}</ListGroup.Item>
                                      {/* <ListGroup.Item><strong>Style:</strong> {data1["Style"]}</ListGroup.Item> */}
                                      <ListGroup.Item><strong>Finish:</strong> <span dangerouslySetInnerHTML={{ __html: data1["Finish"]?.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>") }} /></ListGroup.Item>
                                      <ListGroup.Item><strong>Acidity:</strong> {data1["Acidity"]}</ListGroup.Item>
                                    </ListGroup>
                                  </div>
                                  <div className="col-lg-6 col-md-6 col-sm-12">
                                    <ListGroup variant="flush">
                                        <strong>Body:</strong>
                                      <ListGroup.Item>
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
                                        <p className="wine-pairing-text">
                                          {data1["Body Characteristics"]}
                                        </p>
                                      </ListGroup.Item>
                                      {this.props.type !== "bianco" && (
                                        <>
                                          <strong>Tannins:</strong>
                                          <ListGroup.Item>
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
                                          <p className="wine-pairing-text">
                                            {data1["Tannin Characteristics"]}
                                          </p>
                                        </ListGroup.Item>
                                        </>
                                        
                                      )}
                                    </ListGroup>
                                  </div>
                                </div>
                                  <div className="wine-card-left col-lg-6 col-md-6 col-sm-12">
                                    <strong>Winemaking:</strong>
                                    <ListGroup variant="flush" >
                                      <ListGroup.Item><strong>Vinification:</strong> {data1["Vinification"]}</ListGroup.Item>
                                      <ListGroup.Item><strong>Maturation:</strong> {data1["Maturation"]}</ListGroup.Item>
                                      {data1["Aging"] && (
                                        <ListGroup.Item><strong>Aging:</strong> {data1["Aging"]}</ListGroup.Item>
                                      )}
                                      {data1["Blend"] && (
                                        <ListGroup.Item><strong>Blend:</strong> {data1["Blend"]}</ListGroup.Item>
                                      )}
                                    </ListGroup>
                                  </div>
                                  <div className="col-lg-6 col-md-6 col-sm-12">
                                    {/* <ListGroup variant="flush">
                                      <ListGroup.Item> */}
                                        <div className="">
                                          <div className="wine-region-image col-sm-12 col-md-12 col-lg-9" style={{ paddingBottom: "1rem" }}>
                                            <img
                                              src={`${process.env.PUBLIC_URL}/photos/region/${data1["Region Image"]}`}
                                              alt={data1["Region"]}
                                              onError={(e) => { e.target.onerror = null; e.target.src = `${process.env.PUBLIC_URL}/photos/NA.png`; }}
                                              className="wine-region-image"
                                            />
                                          </div>
                                          <div style={{ width: "100%" }}>
                                            <p><strong>Region:</strong> {data1["Region"]}</p>
                                            {data1["Appelation"] && (
                                              <p><strong>Appelation:</strong> {data1["Appelation"]}</p>
                                            )}
                                            {data1["Vineyard"] && (
                                              <p><strong>Vineyard:</strong> {data1["Vineyard"]}</p>
                                            )}
                                          </div>
                                        </div>
                                      {/* </ListGroup.Item>
                                    </ListGroup> */}
                                  </div>
                                </Row>
                              </Card.Body>
                            </Card>
                          </div>
                        ))}
                      </Row>
                      {/* <p className="pages" style={{color: "white"}}>
                        Page {rowIndex + 1} of {Math.ceil(this.state.specs.length / 2)}
                      </p> */}
                    </React.Fragment>
                  ))}
                  
                </div>
            </>
        )
    }
}

export default index;