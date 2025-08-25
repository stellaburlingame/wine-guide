import React from "react";
import { Card } from "react-bootstrap";
import Row from 'react-bootstrap/Row';
import DefinitionModal from '../../components/DefinitionModal';
import Table from 'react-bootstrap/Table';

import regions from "../../components/Regions/regions.json";

// import "./print.css";
// import "./index.css";


class index extends React.Component {
    state = {
        specs: [],
        showDefinitionModal: false,
        definitions: [],
        currentTerm: {
        Secondary_Text: "",
        Definition: "",
        Image: "",
        Name: ""
        },
        showScrollToTop: false,
        producerOffsetClasses: {},
    }
    // Add logic to set selectedType and filter by Wine Type based on hash on mount
    componentDidMount() {
        const hash = window.location.hash.toLowerCase();
        console.log("Current hash:", hash);


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
        console.log(this.state.specs)
        return (
            <>
                <Row className="col-12">
                {
                    ['Italiano', 'Rosso', 'Bianco', 'Sparkling', 'Rose'].map((type, index) => (
                        <>

                            <div className="col-md-12 col-lg-6 col-sm-12" key={index}>
                            <h3>{type}</h3>
                            {Object.entries(
                                this.state.specs
                                .filter(wine => (wine['Wine Type'] || '').toLowerCase() === type.toLowerCase())
                                .reduce((acc, wine) => {
                                    const style = wine.Style || 'Unstyled';
                                    if (!acc[style]) acc[style] = [];
                                    acc[style].push(wine);
                                    return acc;
                                }, {})
                            ).map(([style, wines]) => (
                                <Card className='' bg={"Light"}>
                                    <Card.Header>
                                        {style}
                                    </Card.Header>
                                    <Card.Body>

                                        <Table>
                                            <tbody>
                                                {wines.map((wine, wineIdx) => (
                                                    <tr key={wineIdx}>
                                                        <td>
                                                            {/* {wine['Region'] === "Piemonte" && (
                                                            <Badge className="wine-piemonte" onClick={() => this.handleDefinitionShow("Piemonte")} style={{ cursor: 'pointer' }}>✨ Piemonte</Badge>
                                                            )}{' '} */}
                                                            {wine['Wine Name']}{', '}
                                                            {regions[wine?.Region]?.["Region location"]} {' '}
                                                            {wine.Vintage}
                                                        </td>
                                                        <td style={{ textAlign: 'right' }}>
                                                            {!isNaN(parseFloat(wine.Glass_Price)) && parseFloat(wine.Glass_Price) > 0 && (
                                                                parseInt(wine.Glass_Price) + '/gls'
                                                            )} {' '}
                                                            {!isNaN(parseFloat(wine.Half_Bottle_Price)) && parseFloat(wine.Half_Bottle_Price) > 0 && (
                                                                parseInt(wine.Half_Bottle_Price) + '/half btl'
                                                            )} {' '}
                                                            {!isNaN(parseFloat(wine.Bottle_Price)) && parseFloat(wine.Bottle_Price) > 0 && (
                                                                '' + parseInt(wine.Bottle_Price) + '/btl'
                                                            )}
                                                        </td>
                                                    </tr>
                                                    ))}
                                                </tbody>
                                            </Table>
                                    </Card.Body>
                                </Card>
                            ))}
                            </div>

                        </>
                    ))
                }
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

}

export default index;