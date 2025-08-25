import React from "react";
import Accordion from "react-bootstrap/Accordion";

const CreditsPage = () => (
  <>

  <div className="position-relative overflow-hidden p-3 p-md-5 m-md-3 text-center bg-body-tertiary">
      <div className="col-md-8 p-lg-5 mx-auto my-5">
          <div className="d-flex align-items-center justify-content-center">
              <h1 className="display-3 fw-bold">Credits &amp; Sources</h1>
          </div>
      </div>
      <div className="product-device shadow-sm d-none d-md-block"></div>
      <div className="product-device product-device-2 shadow-sm d-none d-md-block"></div>
  </div>
  <div style={{ maxWidth: 600, margin: "0 auto", padding: "2rem" }}>
    <h2>Curated Wine List</h2>
    <ul>
      <li>
        Stella Burlingame{" "}
        <a href="https://stellaburlingame.com" target="_blank" rel="noopener noreferrer">
          stellaburlingame.com
        </a>
        , 1448 Burlingame Ave, Burlingame, CA
      </li>
    </ul>
    <h2>Curated Food Pairings</h2>
    <ul>
      <li>
        Stella Burlingame{" "}
        <a href="https://stellaburlingame.com" target="_blank" rel="noopener noreferrer">
          stellaburlingame.com
        </a>
        , 1448 Burlingame Ave, Burlingame, CA
      </li>
    </ul>

    <h2>Website Creation</h2>
    <ul>
      <li>
        Daniel Vasquez
      </li>
    </ul>
    <h2>Winemakers</h2>
    <p>
      Wine details, tasting notes, and winemaking information are adapted from official winery and importer technical sheets.
    </p><br />
    <Accordion>
      <Accordion.Item eventKey="0">
        <Accordion.Header>View Full Winemaker Credits</Accordion.Header>
        <Accordion.Body>
          <ul>
            <li>Michele Chiarlo – Barbera d’Asti DOCG</li>
            <li>Prunotto – Barbaresco DOCG</li>
            <li>Pio Cesare – Barolo DOCG</li>
          </ul>
        </Accordion.Body>
      </Accordion.Item>
    </Accordion>
    <br />
    <h2>Region Images</h2>
    <br />
    <Accordion>
      <Accordion.Item eventKey="0">
        <Accordion.Header>View Region Image Credits</Accordion.Header>
        <Accordion.Body>
          <ul>
            <li>
              <span style={{fontWeight: 'bold'}}>Oregeon</span> Adaptation of a file from Wikimedia Commons:{" "}
              <a href="http://en.wikipedia.org/wiki/File:Map_of_Oregon_NA.png" target="_blank" rel="noopener noreferrer">
                Map of Oregon NA
              </a>
              , Digital editing by Tim Davenport for Wikipedia, no copyright claimed
            </li>
            <li>
              <span style={{fontWeight: 'bold'}}>California Regons</span> By David Benbennick - The maps use data from nationalatlas.gov, specifically countyp020.tar.gz on the Raw Data Download page. The maps also use state outline data from statesp020.tar.gz. The Florida maps use hydrogm020.tar.gz to display Lake Okeechobee., Public Domain,{" "}
              <a href="https://commons.wikimedia.org/w/index.php?curid=570045" target="_blank" rel="noopener noreferrer">
                Wikimedia Commons
              </a>
            </li>
            <li>
              <span style={{fontWeight: 'bold'}}>Italy Regons</span> By TUBS - This SVG map includes elements that have been taken or adapted from this map:, CC BY-SA 3.0,{" "}
              <a href="https://commons.wikimedia.org/w/index.php?curid=14512890" target="_blank" rel="noopener noreferrer">
                Wikimedia Commons
              </a>
            </li>
          </ul>
        </Accordion.Body>
      </Accordion.Item>
    </Accordion>
  </div>
  </>
);

export default CreditsPage;