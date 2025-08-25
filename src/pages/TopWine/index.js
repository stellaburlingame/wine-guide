
import React from "react";
import { Card, ListGroup } from "react-bootstrap";
import Badge from 'react-bootstrap/Badge';
import Row from 'react-bootstrap/Row';
import DefinitionModal from '../../components/DefinitionModal';

import icons from "../../components/Icons/icons.json";
import regions from "../../components/Regions/regions.json";
import { ReactComponent as RotatedLogo } from './rotated.svg';


import "./print.css";
import "./index.css";
const sustainabilityIcon = icons.filter(icon => icon.Type === "Sustainable")[0]
const veganIcon = icons.filter(icon => icon.Type === "Vegan")[0]

// Utility to get available filter options after applying current filters


const regionToCountry = {};
Object.values(regions).forEach((region) => {
  regionToCountry[region.Region] = region.Country;
});


class index extends React.Component {
    darkenHex(hex, factor = 0.5) {
    if (!hex || !/^#([0-9A-F]{3}){1,2}$/i.test(hex)) return hex;

    let c = hex.substring(1);
    if (c.length === 3) {
      c = c.split('').map(ch => ch + ch).join('');
    }
    const num = parseInt(c, 16);
    let r = (num >> 16) & 255;
    let g = (num >> 8) & 255;
    let b = num & 255;

    r = Math.max(0, Math.min(255, Math.floor(r * factor)));
    g = Math.max(0, Math.min(255, Math.floor(g * factor)));
    b = Math.max(0, Math.min(255, Math.floor(b * factor)));

    return `#${((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1)}`;
  }
    state = {
        specs: [],
        selectedCountry: "",
        selectedRegion: "",
        varietalValue: "all",
        searchQuery: "",
        showDefinitionModal: false,
        definitions: [],
        currentTerm: {
          Secondary_Text: "",
          Definition: "",
          Image: "",
          Name: ""
        },
        showScrollToTop: false,
        selectedIcon: [],
        selectedType: "",
        selectedPriceType: "",
        showBoldnessFilter: false,
        boldness: 0,
        minBottlePrice: null,
        maxBottlePrice: null,
        producerOffsetClasses: {},
        // Add new filter for Top Picks
        topPicks: true,
    }
    // Add logic to set selectedType and filter by Wine Type based on hash on mount
    componentDidMount() {
        // Read wine type from URL hash and set as initial selectedType
        const match = window.location.href.match(/\/#\/wine#([\w-]+)/);
        const typeFromHash = match ? match[1] : "";
        this.setState({ selectedType: typeFromHash });

        // --- Begin hash filter logic for #top ---
        // Only apply this logic if hash is exactly "#top"
        const hash = window.location.hash.toLowerCase();
        console.log("Current hash:", hash);
        if (hash === '#/wine-top-picks') {
          // Only apply Top Bottle and Top Glass, all else default
          this.setState({
            selectedCountry: '',
            selectedRegion: '',
            selectedPriceType: '',
            selectedIcon: [],
            showBoldnessFilter: false,
            veganOnly: false,
            sustainableOnly: false,
            selectedType: '',
            varietalValue: 'all',
            minBottlePrice: null,
            maxBottlePrice: null,
            topPicks: true,
            searchQuery: ''
          });
        }
        // --- End hash filter logic for #top ---

        Promise.all(
          ["italiano", "rosso", "bianco", "sparkling"].map((type) =>
            fetch(`${process.env.PUBLIC_URL}/assets/${type}.json`).then((res) =>
              res.json()
            )
          )
        )
          .then((results) => {
            // Flatten all JSON arrays and set once
            const combinedData = results.flat();
            this.setState({ specs: combinedData });
            // Assign a random background offset class for each wine
            const offsetClasses = ['random-offset-1', 'random-offset-2', 'random-offset-3', 'random-offset-4', 'random-offset-5'];
            const producerOffsetClasses = {};
            combinedData.forEach((wine, idx) => {
              const rand = offsetClasses[Math.floor(Math.random() * offsetClasses.length)];
              producerOffsetClasses[idx] = rand;
            });
            this.setState({ producerOffsetClasses });
            // const bottlePrices = combinedData
            //   .map(w => parseFloat(w.Bottle_Price))
            //   .filter(price => !isNaN(price) && price > 0);
            // console.log("All Bottle Prices:", bottlePrices);
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
    componentDidUpdate(prevProps, prevState) {
      // Optional: react to prop changes in the future
      console.log("Component updated with new props:", this.props);
      // Handle prop.type === 'top' to activate Top Picks filter and set wineType to 'top'
      if (this.props.type === 'top' && prevProps.type !== 'top') {
        this.setState((prevState) => ({
          ...prevState,
          topPicks: true,
        }));
      }
      if (this.props.type !== 'top' && prevProps.type === 'top') {
        this.setState((prevState) => ({
          ...prevState,
          topPicks: false,
        }));
      }
      if (JSON.stringify(this.state.specs) !== JSON.stringify(prevState.specs)) {
        return;
      }

      Promise.all(
        ["italiano", "rosso", "bianco", "sparkling"].map((type) =>
          fetch(`${process.env.PUBLIC_URL}/assets/${type}.json`).then((res) => res.json())
        )
      )
        .then((allData) => {
          const combinedData = allData.flat();
          if (JSON.stringify(prevState.specs) !== JSON.stringify(combinedData)) {
            this.setState({ specs: combinedData });
          }
        })
        .catch((err) => console.log(err));
    }
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
    }
    handleChange(event) {
        this.setState({ selectedRegion: event.target.value });
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
  render() {
        return (
            <>
              <Row className="col-12 wine-print">
                {(() => {
                  // Show Top Wine Picks only
                  const filteredData = this.state.specs.filter(w => w["Top Bottle"] || w["Top Glass"]);
                  return filteredData.map((data1, index) => (
                    <div className="wine-wrapper col-md-12 col-lg-6 col-sm-12" key={index}>
                        <Card className='wine-card' bg={"Light"}>
                          <Card.Header>
                            <Card.Text>
                              {data1["Top Bottle"] && (
                                <Badge className="wine-top-selling">⭐️ Top Selling Bottle</Badge>
                              )} {' '}
                              {data1["Top Glass"] && (
                                <Badge className="wine-top-selling">⭐️ Top Selling Glass</Badge>
                              )} {' '}
                              <span className=".card-title" style={{ fontWeight: 'bold'}}>
                                {data1['Wine Name']}
                              </span>
                              {' '} <Badge bg='secondary'>{data1['Vintage']}</Badge> {' '}
                              {/* {data1['Region'] === "Piemonte" && (
                                <Badge className="wine-piemonte" onClick={() => this.handleDefinitionShow("Piemonte")} style={{ cursor: 'pointer' }}>Piemonte</Badge>
                              )}{' '} */}
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
                            </Card.Text>
                          </Card.Header>
                          <Card.Body className="wine-card-body">
                            <Row>
                              <ListGroup.Item className="icon-wrapper">
                                {data1['Region'] === "Piemonte" && (
                                  <Badge className="wine-piemonte" onClick={() => this.handleDefinitionShow("Piemonte")} style={{ cursor: 'pointer' }}>✨ Piemonte</Badge>
                                )}{' '}
                                {this.icons(data1)}
                              </ListGroup.Item>
                            </Row>
                            <Row>
                            <div
                              className={`col-lg-3 col-md-3 col-sm-3 producer-background ${this.state.producerOffsetClasses[index]}`}
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
                                    right: -5,
                                    width: 'auto',
                                    height: '25%',
                                    // CSS variables consumed inside the SVG (see rotated.svg edits)
                                    '--wine-base': data1.Hex || '#6B0F1A',
                                    '--bubbles-stroke': data1.Hex || '#6B0F1A',
                                  }}
                                />
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
                            <ListGroup variant="flush" className="col-lg-9 col-md-9 col-sm-9 wine-list-group">
                              {/* {this.icons(data1)} */}
                              {data1["Summary"] && (
                                <ListGroup.Item>
                                  <span>
                                    <span dangerouslySetInnerHTML={{ __html: this.format(data1["Summary"]) }} />
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
                              {/* {this.icons(data1)} */}
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
                                        <div className="gradient-chart__background">
                                          <div className="gradient-chart__triangle-indicator"
                                            style={{
                                              left: data1["Tannin Level"]?.toLowerCase() === "high" ? "100%" :
                                                    data1["Tannin Level"]?.toLowerCase() === "medium to high" ? "75%" :
                                                    data1["Tannin Level"]?.toLowerCase() === "medium" ? "50%" :
                                                    data1["Tannin Level"]?.toLowerCase() === "medium to low" ? "25%" :
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
                              <div className="wine-region-image p-0" onClick={() => this.handleModalShow(
                                {
                                  Name: regions[data1?.Region]?.["Region location"],
                                  Definition: <>{regions[data1?.Region]?.["Region Summary"]}</>,
                                  Image: `${process.env.PUBLIC_URL}/photos/region/${regions[data1?.Region]?.["Region Image"]}`
                                }
                              )} style={{ cursor: 'pointer' }}>
                                <img
                                  src={`${process.env.PUBLIC_URL}/photos/region/${regions[data1?.Region]?.["Region Image"]}`}
                                  alt={regions[data1?.Region]?.["Region location"]}
                                  onError={(e) => { e.target.onerror = null; e.target.src = `${process.env.PUBLIC_URL}/photos/NA.png`; }}
                                />
                              </div>
                            </Row>
                          </Card.Body>
                        </Card>
                      </div>
                  ));
                })()}
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
    // Compute the array of icon elements to render
    const iconArray = icons.map((icon, i) => {
        const lowerKeywords = icon.Keywords?.map(k => k.toLowerCase()) || [];
        
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
                const allText = `${data1["Summary"] ?? ""} ${data1["Flavor"] ?? ""} ${data1["Aroma"] ?? ""} ${data1["Body Characteristics"] ?? ""} ${data1["Tannin Characteristics"] ?? ""} ${data1["Tannin Characteristics"] ?? ""}`;
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
                  this.handleModalShow({
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
                  this.handleModalShow({
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
}

export default index;