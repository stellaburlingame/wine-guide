
import React from "react";
import { Card } from "react-bootstrap";
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Accordion from 'react-bootstrap/Accordion';
import ListGroup from 'react-bootstrap/ListGroup';
import Badge from 'react-bootstrap/Badge';
import Button from "react-bootstrap/Button";

import BlankModal from '../../components/BlankModal';
import DefinitionModal from '../../components/DefinitionModal';

import regions from "../../components/Regions/regions.json";

import { BiSearch } from "react-icons/bi";
import { BiTrash } from "react-icons/bi";

import { resetFilters } from './filters';

// import { Search } from '../../components/WineFilters';

import WineCard from '../../components/WineCard';

import "./print.css";
import "./index.css";
import { WineTabs } from "./Components/WineTabs";
import { BoldnessFilter, PriceFilters } from "./Components/WineFilters";

// Utility to get available filter options after applying current filters
function getAvailableFilters(filtered) {
  // Get unique values from filtered
  const countries = Array.from(new Set(filtered.map(w => regions[w.Region]?.Country || w.Country).filter(Boolean))).sort();
  const regionList = Array.from(new Set(filtered.map(w => w.Region).filter(Boolean))).sort();
  const varietals = Array.from(new Set(filtered.map(w => w.Varietal).filter(Boolean))).sort();
  const icons = Array.from(new Set(filtered.flatMap(w => w['Top Icons'] || []))).sort();
  return { countries, regions: regionList, varietals, icons };
}

// --- region filter logic setup ---
const countries = Array.from(
  new Set(Object.values(regions).map((region) => region.Country))
);

const regionToCountry = {};
Object.values(regions).forEach((region) => {
  regionToCountry[region.Region] = region.Country;
});
const bodyScale = {
    "light": 0,
    "light to medium": 0.25,
    "medium": 0.5,
    "medium to full": 0.75,
    "full": 1
};
const searchFields = [
    'Summary',
    'Flavor',
    'Aroma',
    'Finish',
    'Acidity',
    'Body',
    'Body Characteristics',
    'Tannins',
    'Tannin Characteristics',
    'Stella Recommended',
    'Vinification',
    'Maturation',
    'Region',
    'Vineyard',
    'Wine Name',
    'Vintage',
    'Sweetness'
];

class index extends React.Component {
  constructor(props) {
      super(props);
      this.state = {
        ...resetFilters(),
        specs: [],
        showDefinitionModal: false,
        definitions: [],
        currentTerm: {
          Secondary_Text: "",
          Definition: "",
          Image: "",
          Name: ""
        },
        priceRange: {
          bottle: {
              min: 0,
              max: 500
          },
          glass: {
              min: 0,
              max: 500
          }
        },
        producerOffsetClasses: {},
        recommendationsOpen: false,
        suggestions: [],
        suggestionsLimit: 7
      }
      this.handleChange = this.handleChange.bind(this);
  }
  clearAllFilters = () => {
    this.setState({filters: resetFilters(this.state.specs).filters});
    this.setState({wines: this.state.specs})
  }
  handleFilterChange = (e, filterResetChange) => {
    let reset = false
    reset = filterResetChange
    this.setState((prevState) => ({
      filters: {
        ...prevState.filters,
        ...e,
        filtersReset: reset
      }
    }));
  }
    // Add logic to set selectedType and filter by Wine Type based on hash on mount
    componentDidMount() {
        // Read wine type from URL hash and set as initial selectedType
        const match = window.location.href.match(/\/#\/wine#([\w-]+)/);
        const typeFromHash = match ? match[1] : "";
        this.setState({ selectedType: typeFromHash });
        this.handleFilterChange({ selectedType: typeFromHash }, typeFromHash === "");
        Promise.all(
          ["italiano", "rosso", "bianco", "sparkling"].map((type) =>
          // ["sparkling", "bianco", "rosso", "italiano"].map((type) =>
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
            let glassPrices = combinedData.filter(w => w.Glass_Price !== 0 && w.Glass_Price !== undefined).map((w) => w.Glass_Price)
            let bottlePrices = combinedData.filter(w => w.Bottle_Price !== 0 && w.Bottle_Price !== undefined).map((w) => w.Bottle_Price)
            this.setState({
                priceRange: {
                  bottle: {
                      min: Math.min(...bottlePrices),
                      max: Math.max(...bottlePrices)
                  },
                  glass: {
                      min: Math.min(...glassPrices),
                      max: Math.max(...glassPrices)
                  }
              },
            })
            this.setState({ producerOffsetClasses });
            // (Optional) Update suggestions after specs are loaded
            this.updateSuggestions(this.state.searchQuery);
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
    // --- SUGGESTIONS/SEARCH AUTOCOMPLETE HELPERS ---
    buildSearchCorpus = () => {
      const fields = [
        'Summary','Flavor','Aroma','Finish','Acidity','Body','Body Characteristics',
        'Tannins','Tannin Characteristics','Stella Recommended','Vinification','Maturation',
        'Region','Vineyard','Wine Name','Vintage','Sweetness','Varietal'
      ];
      const corpus = [];
      (this.state.specs || []).forEach(w => {
        fields.forEach(f => {
          const v = w[f];
          if (v) {
            // split on commas/semicolons to get tighter terms
            const parts = v.toString().split(/[,;]/).map(s => s.trim()).filter(Boolean);
            corpus.push(...parts);
          }
        });
        if (Array.isArray(w['Top Icons'])) corpus.push(...w['Top Icons']);
      });
      return corpus;
    }

    countMatchesForTerm = (term) => {
      const tl = (term || '').toLowerCase();
      if (!tl) return 0;
      const searchableFields = [
        'Summary','Flavor','Aroma','Finish','Acidity','Body','Body Characteristics',
        'Tannins','Tannin Characteristics','Stella Recommended','Vinification','Maturation',
        'Region','Vineyard','Wine Name','Vintage','Sweetness','Varietal'
      ];
      let count = 0;
      for (const w of this.state.specs) {
        const hit = searchableFields.some(field => w[field]?.toString().toLowerCase().includes(tl));
        if (hit) count++;
      }
      return count;
    }

    updateSuggestions = (q) => {
      const query = (q || '').toLowerCase().trim();
      if (!query) {
        this.setState({ suggestions: [] });
        return;
      }
      const seen = new Set();
      const corpus = this.buildSearchCorpus();
      const matches = [];
      for (const term of corpus) {
        const t = term.toString().trim();
        if (!t) continue;
        const tl = t.toLowerCase();
        if (tl.includes(query) && !seen.has(tl)) {
          seen.add(tl);
          matches.push(t);
          if (matches.length >= 50) break; // cap scan growth
        }
      }
      // Sort by most hits, then prefix, then shorter terms
      matches.sort((a,b) => {
        const ca = this.countMatchesForTerm(a);
        const cb = this.countMatchesForTerm(b);
        if (cb !== ca) return cb - ca; // most hits first
        const al = a.toLowerCase(), bl = b.toLowerCase();
        const aStarts = al.startsWith(query) ? 0 : 1;
        const bStarts = bl.startsWith(query) ? 0 : 1;
        if (aStarts !== bStarts) return aStarts - bStarts; // then prefix match
        return a.length - b.length; // then shorter terms
      });
      this.setState({ suggestions: matches, suggestionsLimit: 7 });
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
    handleChange(event) {
        this.setState({ selectedRegion: event.target.value });
    }
    handleModalShow = (body, fullScreen) => {
      this.setState({ showModal: true, fullScreen: fullScreen, modalContent: body });
      // this.setState({ showDefinitionModal: true, currentTerm: term });
    }
    handleDefinitionShow = (term) => {
        const matched = this.state.definitions.find(
            d => d.Name?.toLowerCase() === (term?.Name || term)?.toLowerCase()
        );
        if (matched) {
            this.handleModalShow(<DefinitionModal {...matched} />);
        }
    }
    handleDefinitionClose = () => {
      this.setState({ showModal: false });
    }
    applyFilters(filters) {
      const searchQuery = this.state.searchQuery
        const filteredSpecs = this.state.specs.filter((wine) => {
            // Use regions mapping to get country for wine.Region
            const wineCountry = regions[wine.Region]?.Country || wine.Country;
            const matchCountry = filters.selectedCountry ? wineCountry === filters.selectedCountry : true;
            const matchRegion = filters.selectedRegion ? wine.Region === filters.selectedRegion : true;
            return matchCountry && matchRegion;
        });
        let filtered = filteredSpecs.filter(w => {
            // Country/region logic
            const wineCountry = regions[w.Region]?.Country || w.Country;
            const matchCountry = filters.selectedCountry ? wineCountry === filters.selectedCountry : true;
            const matchRegion = filters.selectedRegion ? w.Region === filters.selectedRegion : true;
            const varietalMatch = filters.varietalValue === "all" || w.Varietal === filters.varietalValue;
            const iconMatch = !filters.selectedIcon || filters.selectedIcon.length === 0 ||
            (w['Top Icons'] && filters.selectedIcon.every(icon => w['Top Icons'].includes(icon)));
            let typeMatch = true;
            if (filters.selectedType === "all" || filters.selectedType === "") {
                typeMatch = true;
            }
            else {
                const cats = (w.Categories || []).map(c => c.toLowerCase());
                const sel = filters.selectedType.toLowerCase();
                typeMatch = cats.includes(sel);
            }
            const searchMatch = !searchQuery ||
            searchFields.some(field =>
                w[field]?.toString().toLowerCase().includes(searchQuery)
            );
            const priceMatch = filters.priceType === "glass"
            // ? parseFloat(w.Glass_Price) > 0 && (!w.Bottle_Price || parseFloat(w.Bottle_Price) === 0)
            ? parseFloat(w.Glass_Price) > 0
            : filters.priceType === "bottle"
                ? parseFloat(w.Bottle_Price) > 0
                : true;
            let priceRange = false;
            if (filters.priceType === "" || (filters.priceRange.bottle?.min === 0 && filters.priceRange.bottle?.max === 0 && filters.priceRange.glass?.min === 0 && filters.priceRange.glass?.max === 0)) {
              priceRange = true
            }
            if (filters.priceType === "bottle" && filters.priceRange.bottle?.min <= w.Bottle_Price && filters.priceRange.bottle?.max >= w.Bottle_Price ) {
              priceRange = true
            }
            if (filters.priceType === "glass" && filters.priceRange.glass?.min <= w.Glass_Price && filters.priceRange.glass?.max >= w.Glass_Price) {
              priceRange = true
            }
            console.log(filters.priceRange, filters.priceType, w.Wine_Name, priceRange)
            console.log(filters.priceRange.glass?.min, w.Glass_Price, filters.priceRange.glass?.max)
            const wineBodyValue = bodyScale[w.Body?.toLowerCase()] ?? 0;
            const boldnessMatch = !filters.showBoldnessFilter || wineBodyValue === filters.boldness;
            return matchCountry && matchRegion && varietalMatch && iconMatch && typeMatch && searchMatch && priceMatch && boldnessMatch && priceRange;
        });
        if (filters.veganOnly) {
            filtered = filtered.filter(wine => wine.Vegan === true);
        }
        if (filters.sustainableOnly) {
            filtered = filtered.filter(wine => wine.Sustainability && wine.Sustainability.length > 0);
        }
        // Sort only when viewing the glass category
        if (filters.selectedType === 'glass') {
            filtered.sort((a, b) => {
                const posA = Number(a["Glass Position"]) || 0;
                const posB = Number(b["Glass Position"]) || 0;
                if (posA !== posB) return posA - posB;
                // optional stable tie-breaker:
                return (a["Wine Name"] || "").localeCompare(b["Wine Name"] || "");
            });
        }
        return filtered;
    }
  render() {
    let filteredData = this.applyFilters(this.state.filters)
      return (
        <>
          <Row className="p-3  form-wrapper">
            {/* Type Filter Tabs */}
            <Form.Group className="p-0 col-12">
              <WineTabs {...{activeKey: this.state.filters.selectedType, updateFilters: this.handleFilterChange }} />
            </Form.Group>
            <Card body className="form-wrapper">
              <Row>
                  <div style={{textAlign: "right"}} className="wine-count">
                    <strong>{filteredData.length}</strong> wines available out of <strong>{this.state.specs.length}</strong>
                  </div>

              </Row>
              <Row>
              {/* Search */}
              <Form.Group style={{ position: "relative", display: 'flex' }} className="mt-3 col-sm-10">
                  <Form.Control
                    type="text"
                    id="searchFilter"
                    placeholder="Search by any keyword..."
                    value={this.state.searchQuery || ""}
                    onChange={(e) => {
                      const val = e.target.value;
                      this.setState({ searchQuery: val.toLowerCase() }, () => this.updateSuggestions(val));
                    }}
                    // onFocus={(e) => this.updateSuggestions(e.target.value)}
                    // onEnter
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        this.setState({suggestions: []});
                      }
                    }} 
                    onSubmit={() => this.setState({suggestions: []})}
                  />

                    <Button onClick={() => this.setState({suggestions: []})} variant="outline-success">
                      <BiSearch />
                    </Button>
                    <Button onClick={() => this.setState({ searchQuery: ""})} variant="outline-danger">
                      <BiTrash />
                    </Button>
                  
                  <ListGroup
                    hidden={!this.state.searchQuery || this.state.suggestions.length === 0}
                    variant="flush"
                    style={{
                      position: "absolute",
                      zIndex: 1000,
                      top: "100%",
                      left: 0,
                      right: 0,
                      width: "100%"
                    }}
                  >
                    {this.state.suggestions.slice(0, this.state.suggestionsLimit).map((s, idx) => (
                      <ListGroup.Item
                        action
                        key={idx}
                        onClick={() => this.setState({ searchQuery: s.toLowerCase(), suggestions: [] })}
                      >
                        <div className="d-flex justify-content-between align-items-center">
                          <span>{s}</span>
                          <Badge bg="primary" pill>{this.countMatchesForTerm(s)}</Badge>
                        </div>
                      </ListGroup.Item>
                    ))}
                    {this.state.suggestions.length > this.state.suggestionsLimit && (
                      <ListGroup.Item
                        action
                        variant="light"
                        onClick={() => this.setState({ suggestionsLimit: this.state.suggestionsLimit + 10 })}
                      >
                        Show more…
                      </ListGroup.Item>
                    )}
                    {this.state.suggestionsLimit > 7 && (
                      <ListGroup.Item
                        action
                        variant="light"
                        onClick={() => this.setState({ suggestionsLimit: 7 })}
                      >
                        Show less
                      </ListGroup.Item>
                    )}
                  </ListGroup>
                  
              </Form.Group>

              {/* Clear Filters Button Group */}
              <Form.Group className="col-sm-2 mt-3">
                <Button
                  type="button"
                  variant="outline-danger"
                  className="form-control"
                  onClick={() => this.clearAllFilters()}
                  disabled={this.state.filters.filtersReset}
                >
                  Clear Filters
                </Button>
              </Form.Group>
              </Row>
              <br />
              <Accordion className="mb-4">
                <Accordion.Item eventKey="0">
                  <Accordion.Header>Show More Filters</Accordion.Header>
                  <Accordion.Body>
                    <Row>
                      <PriceFilters {...{
                          priceType: this.state.filters.priceType,
                          handleFilterChange: this.handleFilterChange,
                          priceRange: this.state.priceRange,
                          minBottlePrice: this.state.filters?.minBottlePrice,
                          maxBottlePrice: this.state.filters?.maxBottlePrice,
                        }} />
                        <hr />
                      {/* Price Type Filter Radio Group */}
                      <Form.Group className="col-md-6 col-sm-12 fw-bold mb-3">
                        {/* Vegan and Sustainability Switches */}
                        <div>
                          <br />
                        <Form.Label>Filter by Practices</Form.Label>
                          <Form.Check
                            type="switch"
                            id="vegan-switch"
                            label="Only Vegan Practices"
                            checked={this.state.filters.veganOnly}
                            onChange={(e) =>
                              this.handleFilterChange({veganOnly: e.target.checked })
                            }
                          />
                          <Form.Check
                            type="switch"
                            id="sustainability-switch"
                            label="Only Sustainability Practices"
                            checked={this.state.filters.sustainableOnly}
                            onChange={(e) =>
                              this.handleFilterChange({ sustainableOnly: e.target.checked })
                            }
                          />
                        </div>
                      {/* Varietal Filter Block: Show placeholder when "All Types" is selected */}
                      </Form.Group>

                      <hr />
                      {/* <Form.Group className="col-md-6 col-sm-12 fw-bold mb-3"> */}
                        {/* <Form.Label>Filter by Varietal</Form.Label>
                        {this.state.selectedType !== "" ? (
                          <div>
                            <Form.Check
                              inline
                              type="radio"
                              label="All"
                              name="varietal"
                              value="all"
                              checked={this.state.varietalValue === "all"}
                              onChange={(e) => this.setState({ varietalValue: e.target.value })}
                            />
                          </div>
                        ) : (
                          <div className="text-muted">Select Wine Type to choose a varietal</div>
                        )} */}
                      {/* </Form.Group> */}
                      {/* ---- Country Filter: Show only countries available in top picks if topPicks is active ---- */}
                      <Form.Group className="col-md-6 col-sm-12 fw-bold mb-3">
                        <Form.Label>Filter by Country</Form.Label>
                        <div>
                          <Form.Check
                            type="radio"
                            label="All"
                            name="country"
                            value=""
                            checked={this.state.filters.selectedCountry === ""}
                            onChange={(e) => this.handleFilterChange({ selectedCountry: e.target.value, selectedRegion: "" })}
                          />
                          {countries
                            .concat(
                              this.state.filters.selectedCountry &&
                                !(
                                  this.state.specs
                                    .map(w => regions[w.Region]?.Country || w.Country)
                                    .filter(Boolean)
                                    .includes(this.state.filters.selectedCountry)
                                )
                                ? [this.state.filters.selectedCountry]
                                : []
                            )
                            .filter((v, i, arr) => arr.indexOf(v) === i)
                            .map((country) => (
                              <Form.Check
                                key={country}
                                type="radio"
                                label={country}
                                name="country"
                                value={country}
                                checked={this.state.filters.selectedCountry === country}
                                onChange={(e) => this.handleFilterChange({ selectedCountry: e.target.value, selectedRegion: "" })}
                              />
                            ))}
                        </div>
                      </Form.Group>
                      <div className="col-md-6 col-sm-12">
                        <Form.Group>
                          <Form.Label>Filter by Region</Form.Label>
                          {this.state.filters.selectedCountry && this.state.filters.selectedCountry !== "all" ? (
                            <></>
                          ) : (
                            <div className="text-muted mb-5" style={{ height: '38px', paddingTop: '6px' }}>
                              Select a country to choose a region
                            </div>
                          )}
                          <div hidden={!this.state.filters.selectedCountry && this.state.filters.selectedCountry !== "all"}>
                            <Form.Check
                              inline
                              type="radio"
                              label="All"
                              name="region"
                              value=""
                              checked={this.state.filters.selectedRegion === ""}
                              onChange={(e) => this.handleFilterChange({ selectedRegion: e.target.value })}
                            />
                            {(Object.keys(regions).filter(region =>
                                  this.state.filters.selectedCountry === "all" ||
                                  this.state.filters.selectedCountry === "" ||
                                  regions[region]?.Country === this.state.filters.selectedCountry
                                )
                            ).map(region => (
                              <Form.Check
                                key={region}
                                type="radio"
                                inline
                                name="region"
                                value={region}
                                label={region}
                                checked={this.state.filters.selectedRegion === region}
                                onChange={(e) => this.handleFilterChange({ selectedRegion: e.target.value })}
                              />
                            ))}
                          </div>
                        </Form.Group>
                      </div>
                      <hr />
                      <Form.Group className="col-md-6 col-sm-12 fw-bold mb-3">
                        <Form.Label>Filter by Description</Form.Label>
                        <div>
                          {Array.from(
                            new Set(
                              (this.state.specs.flatMap(wine => wine['Top Icons'] || [])
                                ).concat(
                                  this.state.filters.selectedIcon.filter(
                                    icon => !(this.state.specs.flatMap(w => w['Top Icons'] || []).includes(icon))
                                  )
                                )
                            )
                          ).map((icon, idx) => (
                            <Form.Check
                              key={idx}
                              type="checkbox"
                              label={icon}
                              value={icon}
                              checked={this.state.filters.selectedIcon.includes(icon)}
                              inline={true}
                              onChange={(e) => {
                                const { checked, value } = e.target;
                                this.setState(prevState => {
                                  const icons = new Set(prevState.filters.selectedIcon);
                                  checked ? icons.add(value) : icons.delete(value);
                                  return { filters: {...prevState.filters, filtersReset: false, selectedIcon: [...icons] }};
                                });
                              }}
                              disabled={!getAvailableFilters(filteredData).icons.includes(icon) && !this.state.filters.selectedIcon.includes(icon)}
                            />
                          ))}
                        </div>
                      </Form.Group>
                      <BoldnessFilter
                        {...{
                          updateFilters: this.handleFilterChange, 
                          showBoldnessFilter: this.state.filters.showBoldnessFilter, 
                          boldness: this.state.filters.boldness
                        }} 
                      />
                    </Row>
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>
            </Card>
            </Row>
              <Row className="col-12 wine-print">
                {(() => {
                  return (
                    <>
                      {filteredData.map((data1, index) => (
                        <div className="wine-wrapper col-md-12 col-lg-6 col-sm-12" key={index}>
                          <WineCard
                            wine={data1}
                            index={index}
                            format={this.format}
                            state={this.state}
                            producerOffsetClass={this.state.producerOffsetClasses}
                            handleDefinitionShow={this.handleDefinitionShow}
                            handleModalShow={this.handleModalShow}
                            handleWineModalShow={this.handleWineModalShow}
                            handleModalClose={this.handleDefinitionClose}
                            />
                          </div>
                      ))}
                    </>
                  );
                })()}
                  {/* <p className="pages" style={{color: "white"}}>
                    Page {rowIndex + 1} of {Math.ceil(this.state.specs.length / 2)}
                  </p> */}
            </Row>
            <BlankModal 
              show={this.state.showModal}
              onHide={this.handleDefinitionClose}
              body={this.state.modalContent}
              fullScreen={this.state.fullScreen}
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


  
}

export default index;