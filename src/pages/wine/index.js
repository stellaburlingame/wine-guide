
import React from "react";
import RangeExample from '../../components/RangeExample';
import { Card, ListGroup } from "react-bootstrap";
import Badge from 'react-bootstrap/Badge';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import Accordion from 'react-bootstrap/Accordion';
import DefinitionModal from '../../components/DefinitionModal';

import icons from "../../components/Icons/icons.json";
import regions from "../../components/Regions/regions.json";

import "./print.css";
import "./index.css";
const sustainabilityIcon = icons.filter(icon => icon.Type === "Sustainable")[0]
const veganIcon = icons.filter(icon => icon.Type === "Vegan")[0]

// Utility to get available filter options after applying current filters
function getAvailableFilters(wines, regions, filters) {
  // filters: { selectedType, varietalValue, selectedCountry, selectedRegion, selectedIcon, selectedPriceType, showBoldnessFilter, boldness, searchQuery }
  // Returns: { countries, regions, varietals, icons }
  // Note: country/region/varietal values are unique arrays of allowed values in the current filtered list
  // If a filter is not applied (e.g., selectedCountry=""), do not restrict based on that filter.

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
    const typeMatch = filters.selectedType
      ? (w["Wine Type"]?.toLowerCase() === filters.selectedType.toLowerCase())
      : true;
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
    }
  clearAllFilters = () => {
    this.setState({
      searchQuery: '',
      selectedCountry: '',
      selectedRegion: '',
      selectedPriceType: '',
      selectedIcon: [],
      boldness: 0.25,
      showBoldnessFilter: false,
      veganOnly: false,
      sustainableOnly: false,
      selectedType: '',
      varietalValue: 'all'
    });
  }
    // Add logic to set selectedType and filter by Wine Type based on hash on mount
    componentDidMount() {
        // Read wine type from URL hash and set as initial selectedType
        const match = window.location.href.match(/\/#\/wine#([\w-]+)/);
        const typeFromHash = match ? match[1] : "";
        this.setState({ selectedType: typeFromHash });

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
            const bottlePrices = combinedData
              .map(w => parseFloat(w.Bottle_Price))
              .filter(price => !isNaN(price) && price > 0);
            console.log("All Bottle Prices:", bottlePrices);
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
      // Optional: if you ever want to react to prop changes in the future
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
        return (
            <>
            <Row className="p-3  form-wrapper">
              {/* Type Filter Tabs */}
              <Form.Group className="p-0 col-12">
                <Tabs
                  activeKey={this.state.selectedType}
                  onSelect={(k) => {
                    this.setState({ selectedType: k });
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
                  {[...new Set(this.state.specs.map(w => w["Wine Type"]).filter(Boolean))].sort().map(type => (
                    <Tab key={type} eventKey={type} title={type} />
                  ))}
                </Tabs>
              </Form.Group>
            <Card body className="form-wrapper">
              <Row>
              {/* Search */}
              <Form.Group className="mt-3 col-sm-10">
                <Form.Control
                  type="text"
                  id="searchFilter"
                  placeholder="Search by any keyword..."
                  value={this.state.searchQuery || ""}
                  onChange={(e) => this.setState({ searchQuery: e.target.value.toLowerCase() })}
                />
              </Form.Group>

              {/* Clear Filters Button Group */}
              <Form.Group className="col-sm-2 mb-3 mt-3">
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
                    this.state.maxBottlePrice == null;
                  return (
                    <button
                      type="button"
                      className="btn btn-success form-control"
                      onClick={this.clearAllFilters}
                      disabled={filtersCleared}
                    >
                      Clear Filters
                    </button>
                  );
                })()}
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
                        <Form.Label>Filter by Varietal</Form.Label>
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
                              {Array.from(
                                new Set(
                                  this.state.specs
                                    .filter((wine) =>
                                      wine["Wine Type"] === this.state.selectedType
                                    )
                                    .flatMap((wine) =>
                                      wine.Varietal
                                        ? wine.Varietal
                                        : []
                                    )
                                )
                              )
                                .sort()
                                .map((varietal) => (
                                  <Form.Check
                                    key={varietal}
                                    type="radio"
                                    inline
                                    name="varietal"
                                    value={varietal}
                                    id={`varietal-${varietal}`}
                                    label={varietal}
                                    checked={this.state.varietalValue === varietal}
                                    onChange={(e) =>
                                      this.setState((prev) => ({ ...prev, varietalValue: e.target.value }))
                                    }
                                  />
                                ))}
                            </div>
                          ) : (
                            <div className="text-muted">Select Wine Type to choose a varietal</div>
                          )}
                      </Form.Group>
                      {/* Country Filter */}
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
                            // "All" is always enabled
                          />
                          {countries.concat(
                            this.state.selectedCountry && !countries.includes(this.state.selectedCountry)
                              ? [this.state.selectedCountry]
                              : []
                          ).filter((v, i, arr) => arr.indexOf(v) === i).map((country) => (
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
                      {/* Region Filter: Always render the Form.Group for layout, but only render filtered region options */}
                      <div className="col-md-6 col-sm-12">
                        <Form.Group>
                          <Form.Label>Filter by Region</Form.Label>

                          {this.state.selectedCountry && this.state.selectedCountry !== "all" ? (
                          <></>
                          ) : (
                            <div className="text-muted" style={{ height: '38px', paddingTop: '6px' }}>
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
                            {Object.keys(regions)
                              .filter(region =>
                                this.state.selectedCountry === "all" ||
                                this.state.selectedCountry === "" ||
                                regions[region]?.Country === this.state.selectedCountry
                              )
                              .map(region => (
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
                      {/* Top Icon Filter */}
                      <Form.Group className="col-md-6 col-sm-12 fw-bold mb-3">
                        <Form.Label>Filter by Description</Form.Label>
                        <div>
                          {Array.from(new Set(
                            this.state.specs.flatMap(wine => wine['Top Icons'] || [])
                              .concat(
                                this.state.selectedIcon.filter(icon => !this.state.specs.flatMap(wine => wine['Top Icons'] || []).includes(icon))
                              )
                          )).map((icon, idx) => (
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
                              value={this.state.boldness}
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
                  // Apply remaining filters to filteredSpecs
                  let filteredData = filteredSpecs.filter(w => {
                    // region is already filtered by filteredSpecs
                    const varietalMatch = this.state.varietalValue === "all" || w.Varietal === this.state.varietalValue;
                    const iconMatch = this.state.selectedIcon.length === 0 ||
                      (w['Top Icons'] && this.state.selectedIcon.every(icon => w['Top Icons'].includes(icon)));
                    const typeMatch = this.state.selectedType
                      ? (w["Wine Type"]?.toLowerCase() === this.state.selectedType.toLowerCase())
                      : true;
                    const searchableFields = [
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
                    const searchMatch = !this.state.searchQuery ||
                      searchableFields.some(field =>
                        w[field]?.toString().toLowerCase().includes(this.state.searchQuery)
                      );
                    const priceMatch = this.state.selectedPriceType === "glass"
                      ? parseFloat(w.Glass_Price) > 0 && (!w.Bottle_Price || parseFloat(w.Bottle_Price) === 0)
                      : this.state.selectedPriceType === "bottle"
                        ? parseFloat(w.Bottle_Price) > 0 && (!w.Glass_Price || parseFloat(w.Glass_Price) === 0)
                        : true;
                    // Boldness filter
                    const bodyScale = {
                      "light": 0,
                      "light to medium": 0.25,
                      "medium": 0.5,
                      "medium to full": 0.75,
                      "full": 1
                    };
                    const wineBodyValue = bodyScale[w.Body?.toLowerCase()] ?? 0;
                    const boldnessMatch = !this.state.showBoldnessFilter || wineBodyValue === this.state.boldness;
                    // Bottle Price Range filter
                    let bottlePrice = Number(w.Bottle_Price);
                    if (isNaN(bottlePrice)) bottlePrice = 0;
                    if (this.state.minBottlePrice && bottlePrice < Number(this.state.minBottlePrice)) return false;
                    if (this.state.maxBottlePrice && bottlePrice > Number(this.state.maxBottlePrice)) return false;
                    return varietalMatch && iconMatch && typeMatch && searchMatch && priceMatch && boldnessMatch;
                  });
                  // Vegan and Sustainability filters
                  if (this.state.veganOnly) {
                    filteredData = filteredData.filter(wine => wine.Vegan === true);
                  }
                  if (this.state.sustainableOnly) {
                    filteredData = filteredData.filter(wine => wine.Sustainability && wine.Sustainability.length > 0);
                  }
                  return filteredData.map((data1, index) => (
                    <div className="wine-wrapper col-md-12 col-lg-6 col-sm-12" key={index}>
                        <Card className='wine-card' bg={"Light"}>
                          <Card.Header>
                            <Card.Text>
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
                                  <Badge className="wine-piemonte" onClick={() => this.handleDefinitionShow("Piemonte")} style={{ cursor: 'pointer' }}>Piemonte</Badge>
                                )}{' '}
                                {this.icons(data1)}
                              </ListGroup.Item>
                            </Row>
                            <Row>
                            <div className="col-lg-3 col-md-3 col-sm-3">
                              <div className="wine-card-image-wrapper">

                                <img
                                  src={`${process.env.PUBLIC_URL}/photos/producer/${data1["Producer"]}.png`}
                                  alt="Producer"
                                  className="wine-card-image-producer"
                                  onError={(e) => (e.currentTarget.style.display = 'none')}
                                  onLoad={(e) => (e.currentTarget.style.display = '')}
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