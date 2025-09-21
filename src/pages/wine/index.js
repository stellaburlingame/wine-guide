
import React from "react";
import RangeExample from '../../components/RangeExample';
import { Card } from "react-bootstrap";
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import Accordion from 'react-bootstrap/Accordion';
import ListGroup from 'react-bootstrap/ListGroup';
import Badge from 'react-bootstrap/Badge';
import Button from "react-bootstrap/Button";

import BlankModal from '../../components/BlankModal';
import DefinitionModal from '../../components/DefinitionModal';

import regions from "../../components/Regions/regions.json";

import { BiSearch } from "react-icons/bi";
import { BiTrash } from "react-icons/bi";

import { applyFilters, resetFilters } from './filters';

// import { Search } from '../../components/WineFilters';

import WineCard from '../../components/WineCard';

import "./print.css";
import "./index.css";

// Utility to get available filter options after applying current filters
function getAvailableFilters(wines, regions, filters) {
  
  // Compose the filter logic (should match the filtering used in render)
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
  
  const filtered = wines.filter(w => {
    // Country/region logic
    const wineCountry = regions[w.Region]?.Country || w.Country;
    const matchCountry = filters.selectedCountry ? wineCountry === filters.selectedCountry : true;
    const matchRegion = filters.selectedRegion ? w.Region === filters.selectedRegion : true;
    const varietalMatch = filters.varietalValue === "all" || w.Varietal === filters.varietalValue;
    const iconMatch = !filters.selectedIcon || filters.selectedIcon.length === 0 ||
      (w['Top Icons'] && filters.selectedIcon.every(icon => w['Top Icons'].includes(icon)));
    let typeMatch = true;
    if (filters.selectedType === "all" || filters.selectedType === "" || null) {
      typeMatch = true;
    }
    else {
      const cats = (w.Categories || []).map(c => c.toLowerCase());
        const sel = filters.selectedType.toLowerCase();
        typeMatch = cats.includes(sel);
    }
    // const typeMatch = filters.selectedType
    //   ? (w["Wine Type"]?.toLowerCase() === filters.selectedType.toLowerCase())
    //   : true;
    const searchMatch = !filters.searchQuery ||
      searchFields.some(field =>
        w[field]?.toString().toLowerCase().includes(filters.searchQuery)
      );
    const priceMatch = filters.selectedPriceType === "glass"
      ? parseFloat(w.Glass_Price) > 0 && (!w.Bottle_Price || parseFloat(w.Bottle_Price) === 0)
      : filters.selectedPriceType === "bottle"
        ? parseFloat(w.Bottle_Price) > 0 && (!w.Glass_Price || parseFloat(w.Glass_Price) === 0)
        : true;
    const wineBodyValue = bodyScale[w.Body?.toLowerCase()] ?? 0;
    const boldnessMatch = !filters.showBoldnessFilter || wineBodyValue === filters.boldness;
    return matchCountry && matchRegion && varietalMatch && iconMatch && typeMatch && searchMatch && priceMatch && boldnessMatch;
  });
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


class index extends React.Component {
    state = {
      filters: resetFilters().filters,
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
        recommendationsOpen: false,
        suggestions: [],
        suggestionsLimit: 7
  }
  clearAllFilters = () => {
    this.setState(resetFilters(this.state.specs).filters);
    this.setState({
      searchQuery: '',
      selectedCountry: '',
      selectedRegion: '',
      selectedPriceType: '',
      selectedIcon: [],
      boldness: 0,
      showBoldnessFilter: false,
      veganOnly: false,
      sustainableOnly: false,
      selectedType: '',
      varietalValue: 'all',
      minBottlePrice: null,
      maxBottlePrice: null,
    });
  }
  handleFilterChange() {
    // this.setState(applyFilters(this.state.filters, this.state.specs))
  }
    // Add logic to set selectedType and filter by Wine Type based on hash on mount
    componentDidMount() {
        // Read wine type from URL hash and set as initial selectedType
        const match = window.location.href.match(/\/#\/wine#([\w-]+)/);
        const typeFromHash = match ? match[1] : "";
        this.setState({ selectedType: typeFromHash });

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
            // this.clearAllFilters()
            // this.setState(resetFilters(combinedData).filters);
            // Assign a random background offset class for each wine
            const offsetClasses = ['random-offset-1', 'random-offset-2', 'random-offset-3', 'random-offset-4', 'random-offset-5'];
            const producerOffsetClasses = {};
            combinedData.forEach((wine, idx) => {
              const rand = offsetClasses[Math.floor(Math.random() * offsetClasses.length)];
              producerOffsetClasses[idx] = rand;
            });
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
    // componentDidUpdate(prevProps, prevState) {
    //   // Optional: react to prop changes in the future
    //   if (JSON.stringify(this.state.specs) !== JSON.stringify(prevState.specs)) {
    //     return;
    //   }
    // }
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
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
    checkIfAllFilter(value) {
        if (value === "all") {
            return Object.keys(this.state.specs);
        }
        else {
            return Object.keys(this.state.specs);
            // return [value];
        }
    }
  handleCountryChange = (e) => {
    const selectedCountry = e.target.value;
    // When the country changes, optionally reset region filter
    this.setState({ selectedCountry, selectedRegion: "" });
  }
  render() {
        // --- region/country filter logic for filtering ---
        const filteredSpecs = this.state.specs.filter((wine) => {
          // Use regions mapping to get country for wine.Region
          const wineCountry = regions[wine.Region]?.Country || wine.Country;
          const matchCountry = this.state.selectedCountry ? wineCountry === this.state.selectedCountry : true;
          const matchRegion = this.state.selectedRegion ? wine.Region === this.state.selectedRegion : true;
          return matchCountry && matchRegion;
        });
        // Get available filters based on currently filtered data
        const availableFilters = getAvailableFilters(
          this.state.specs,
          regions,
          {
            selectedType: this.state.selectedType,
            varietalValue: this.state.varietalValue,
            selectedCountry: this.state.selectedCountry,
            selectedRegion: this.state.selectedRegion,
            selectedIcon: this.state.selectedIcon,
            selectedPriceType: this.state.selectedPriceType,
            showBoldnessFilter: this.state.showBoldnessFilter,
            boldness: this.state.boldness,
            searchQuery: this.state.searchQuery
          }
        );

        // Compute filteredData once so it can be used in multiple places (header count + results)
        let filteredData = filteredSpecs.filter(w => {
            const varietalMatch = this.state.varietalValue === "all" || w.Varietal === this.state.varietalValue;
            const iconMatch = this.state.selectedIcon.length === 0 ||
              (w['Top Icons'] && this.state.selectedIcon.every(icon => w['Top Icons'].includes(icon)));
            let typeMatch = true;
            if (this.state.selectedType === "all" || this.state.selectedType === "") {
              typeMatch = true;
            }
            else {
              const cats = (w.Categories || []).map(c => c.toLowerCase());
                const sel = this.state.selectedType.toLowerCase();
                typeMatch = cats.includes(sel);
            }

            const searchableFields = [
              'Summary','Flavor','Aroma','Finish','Acidity','Body','Body Characteristics',
              'Tannins','Tannin Characteristics','Stella Recommended','Vinification','Maturation',
              'Region','Vineyard','Wine Name','Vintage','Sweetness'
            ];
            const searchMatch = !this.state.searchQuery ||
              searchableFields.some(field => w[field]?.toString().toLowerCase().includes(this.state.searchQuery));
            const priceMatch = this.state.selectedPriceType === "glass"
              ? parseFloat(w.Glass_Price) > 0 && (!w.Bottle_Price || parseFloat(w.Bottle_Price) >= 0)
              : this.state.selectedPriceType === "bottle"
                ? parseFloat(w.Bottle_Price) > 0 && (!w.Glass_Price || parseFloat(w.Glass_Price) === 0)
                : true;
            const bodyScale = { "light": 0, "light to medium": 0.25, "medium": 0.5, "medium to full": 0.75, "full": 1 };
            const wineBodyValue = bodyScale[w.Body?.toLowerCase()] ?? 0;
            const boldnessMatch = !this.state.showBoldnessFilter || wineBodyValue === this.state.boldness;
            let bottlePrice = Number(w.Bottle_Price);
            if (isNaN(bottlePrice)) bottlePrice = 0;
            if (this.state.minBottlePrice && bottlePrice < Number(this.state.minBottlePrice)) return false;
            if (this.state.maxBottlePrice && bottlePrice > Number(this.state.maxBottlePrice)) return false;
            return varietalMatch && iconMatch && typeMatch && searchMatch && priceMatch && boldnessMatch;
          });
          if (this.state.veganOnly) {
            filteredData = filteredData.filter(wine => wine.Vegan === true);
          }
          if (this.state.sustainableOnly) {
            filteredData = filteredData.filter(wine => wine.Sustainability && wine.Sustainability.length > 0);
          }
          // Sort only when viewing the glass category
          if (this.state.selectedType === 'glass') {
            filteredData.sort((a, b) => {
              const posA = Number(a["Glass Position"]) || 0;
              const posB = Number(b["Glass Position"]) || 0;
              if (posA !== posB) return posA - posB;
              // optional stable tie-breaker:
              return (a["Wine Name"] || "").localeCompare(b["Wine Name"] || "");
            });
          }
        return (
            <>
            <Row className="p-3  form-wrapper">
              {/* Type Filter Tabs */}
              <Form.Group className="p-0 col-12">
                <Tabs
                  activeKey={this.state.selectedType}
                  onSelect={(k) => {
                    // Handle Top Picks logic
                    this.setState((prevState) => ({
                      ...prevState,
                      selectedType: k
                    }));
                    const url = new URL(window.location.href);
                    url.hash = `#/wine#${k}`;
                    window.history.pushState(null, "", url);
                  }}
                  id="type-tab"
                  className="wine-type-tabs"
                  fill
                  justify
                >
                  <Tab eventKey="" title="All Types" />
                  <Tab eventKey="glass" title="Wines by the Glass" />
                  <Tab eventKey="sparkling" title="Sparkling" />
                  <Tab eventKey="bianco" title="Bianco and Rose" />
                  <Tab eventKey="rosso" title="Rosso" />
                  <Tab eventKey="italiano" title="Italiano" />
                  {/* <Tab eventKey="rose" title="Rose" /> */}
                </Tabs>
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
                {(() => {
                  // Compute filtersCleared as described in the instructions
                  const filtersCleared =
                    !this.state.searchQuery &&
                    !this.state.selectedCountry &&
                    !this.state.selectedRegion &&
                    !this.state.selectedPriceType &&
                    this.state.selectedIcon.length === 0 &&
                    this.state.boldness === 0.25 &&
                    !this.state.showBoldnessFilter &&
                    !this.state.veganOnly &&
                    !this.state.sustainableOnly &&
                    !this.state.selectedType &&
                    this.state.varietalValue === "all" &&
                    this.state.minBottlePrice == null &&
                    this.state.maxBottlePrice == null &&
                    !this.state.topPicks;
                  return (
                    <Button
                      type="button"
                      variant="outline-danger"
                      className="form-control"
                      onClick={this.clearAllFilters}
                      disabled={filtersCleared}
                    >
                      Clear Filters
                    </Button>
                  );
                })()}
              </Form.Group>
              <Form.Group className="col-sm-2 mb-3 mt-3">

              </Form.Group>
              </Row>
              <Accordion className="mb-4">
                <Accordion.Item eventKey="0">
                  <Accordion.Header>Show More Filters</Accordion.Header>
                  <Accordion.Body>
                    <Row>
                      {/* Price Type Filter Radio Group */}
                      <Form.Group className="col-md-6 col-sm-12 fw-bold mb-3">
                        <Form.Label>Filter by Price Type</Form.Label>
                        <div>
                          {[
                            { value: "", label: "All" },
                            { value: "glass", label: "Glass Only" },
                            { value: "bottle", label: "Bottle Only" }
                          ].map((option) => (
                            <Form.Check
                              key={option.value}
                              type="radio"
                              label={option.label}
                              name="priceType"
                              value={option.value}
                              checked={this.state.selectedPriceType === option.value}
                              onChange={(e) => this.setState({ selectedPriceType: e.target.value })}
                            />
                          ))}
                        </div>

                      {/* Bottle Price Range Filter */}
                      <div className="">
                        <br />
                        <RangeExample
                          minPrice={this.state.minBottlePrice}
                          maxPrice={this.state.maxBottlePrice}
                          onChange={({ min, max }) => {
                            this.setState((prev) => ({
                              ...prev,
                              minBottlePrice: min ?? 0,
                              maxBottlePrice: max ?? 500,
                            }));
                          }}
                        />
                      </div>
                        {/* Vegan and Sustainability Switches */}
                        <div>
                          <br />
                        <Form.Label>Filter by Practices</Form.Label>
                          <Form.Check
                            type="switch"
                            id="vegan-switch"
                            label="Only Vegan Practices"
                            checked={this.state.veganOnly}
                            onChange={(e) =>
                              this.setState((prev) => ({ ...prev, veganOnly: e.target.checked }))
                            }
                          />
                          <Form.Check
                            type="switch"
                            id="sustainability-switch"
                            label="Only Sustainability Practices"
                            checked={this.state.sustainableOnly}
                            onChange={(e) =>
                              this.setState((prev) => ({ ...prev, sustainableOnly: e.target.checked }))
                            }
                          />
                        </div>
                      {/* Varietal Filter Block: Show placeholder when "All Types" is selected */}
                      </Form.Group>

                      <Form.Group className="col-md-6 col-sm-12 fw-bold mb-3">
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
                      </Form.Group>
                      {/* ---- Country Filter: Show only countries available in top picks if topPicks is active ---- */}
                      <Form.Group className="col-md-6 col-sm-12 fw-bold mb-3">
                        <Form.Label>Filter by Country</Form.Label>
                        <div>
                          <Form.Check
                            type="radio"
                            label="All"
                            name="country"
                            value=""
                            checked={this.state.selectedCountry === ""}
                            onChange={(e) => this.setState({ selectedCountry: e.target.value, selectedRegion: "" })}
                          />
                          {countries
                            .concat(
                              this.state.selectedCountry &&
                                !(
                                  this.state.specs
                                    .map(w => regions[w.Region]?.Country || w.Country)
                                    .filter(Boolean)
                                    .includes(this.state.selectedCountry)
                                )
                                ? [this.state.selectedCountry]
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
                                checked={this.state.selectedCountry === country}
                                onChange={(e) => this.setState({ selectedCountry: e.target.value, selectedRegion: "" })}
                              />
                            ))}
                        </div>
                      </Form.Group>
                      <div className="col-md-6 col-sm-12">
                        <Form.Group>
                          <Form.Label>Filter by Region</Form.Label>
                          {this.state.selectedCountry && this.state.selectedCountry !== "all" ? (
                            <></>
                          ) : (
                            <div className="text-muted mb-5" style={{ height: '38px', paddingTop: '6px' }}>
                              Select a country to choose a region
                            </div>
                          )}
                          <div hidden={!this.state.selectedCountry && this.state.selectedCountry !== "all"}>
                            <Form.Check
                              inline
                              type="radio"
                              label="All"
                              name="region"
                              value=""
                              checked={this.state.selectedRegion === ""}
                              onChange={(e) => this.setState({ selectedRegion: e.target.value })}
                            />
                            {(Object.keys(regions).filter(region =>
                                  this.state.selectedCountry === "all" ||
                                  this.state.selectedCountry === "" ||
                                  regions[region]?.Country === this.state.selectedCountry
                                )
                            ).map(region => (
                              <Form.Check
                                key={region}
                                type="radio"
                                inline
                                name="region"
                                value={region}
                                label={region}
                                checked={this.state.selectedRegion === region}
                                onChange={(e) => this.setState({ selectedRegion: e.target.value })}
                              />
                            ))}
                          </div>
                        </Form.Group>
                      </div>
                      <Form.Group className="col-md-6 col-sm-12 fw-bold mb-3">
                        <Form.Label>Filter by Description</Form.Label>
                        <div>
                          {Array.from(
                            new Set(
                              (this.state.specs.flatMap(wine => wine['Top Icons'] || [])
                                ).concat(
                                  this.state.selectedIcon.filter(
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
                              checked={this.state.selectedIcon.includes(icon)}
                              inline={true}
                              onChange={(e) => {
                                const { checked, value } = e.target;
                                this.setState(prevState => {
                                  const icons = new Set(prevState.selectedIcon);
                                  checked ? icons.add(value) : icons.delete(value);
                                  return { selectedIcon: [...icons] };
                                });
                              }}
                              disabled={!availableFilters.icons.includes(icon) && !this.state.selectedIcon.includes(icon)}
                            />
                          ))}
                        </div>
                      </Form.Group>
                      {/* Boldness Filter */}
                      <Form.Group className="col-md-6 col-sm-12 fw-bold mb-3">
                        <Form.Label>Filter by Boldness</Form.Label>
                        <Form.Check
                          type="switch"
                          id="boldness-switch"
                          label="Enable Boldness Filter"
                          checked={this.state.showBoldnessFilter}
                          onChange={(e) => this.setState({ showBoldnessFilter: e.target.checked })}
                        />
                        {this.state.showBoldnessFilter && (
                          <>
                            <Form.Range
                              min={0}
                              max={1}
                              step={0.25}
                              value={this.state.boldness || ""}
                              onChange={(e) => this.setState({ boldness: parseFloat(e.target.value) })}
                            />
                            <div>
                              {this.state.boldness === 0 && "Low Bodied"}
                              {this.state.boldness === 0.25 && "Light to Medium Bodied"}
                              {this.state.boldness === 0.5 && "Medium Bodied"}
                              {this.state.boldness === 0.75 && "Medium to Full Bodied"}
                              {this.state.boldness === 1 && "Full Bodied"}
                            </div>
                          </>
                        )}
                      </Form.Group>
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