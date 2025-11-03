// import logo from './logo.svg';
import React from "react";
import {
  Routes,
  Route,
  HashRouter
} from "react-router-dom";

import 'bootstrap/dist/css/bootstrap.min.css';


import './App.css';
import Nav from "./components/Nav";
import Footer from "./components/Footer";
import Wine from "./pages/wine";
import Wine2 from "./pages/wine/old_index.js";
import TopWine from "./pages/TopWine";
import NewWines from "./pages/NewWine";
import FindYourWine from "./pages/FindYourWine";
import TableOfConents from "./pages/TableOfConents";
import Home from "./pages/home";
import NotFound from "./pages/NotFound";

import Definitions from "./pages/definitions";
import Credits from "./pages/credits";
import { Modal, Button } from 'react-bootstrap';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ageVerified: localStorage.getItem('ageVerified') === 'true',
      specs: undefined,
      producerOffsetClasses: undefined,
      definitions: undefined,
    };
  }

  handleAgeConfirm = () => {
    localStorage.setItem('ageVerified', 'true');
    this.setState({ ageVerified: true });
  };

  componentDidMount() {
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

  render() {
    return (
      <HashRouter>
        <Modal
          show={!this.state.ageVerified}
          backdrop="static"
          keyboard={false}
          centered
        >
          <Modal.Header>
            <Modal.Title>Welcome to the Stella Wine Guide</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            By clicking Enter you verify that you are 21 years of age or older 
          </Modal.Body>
          <Modal.Footer className="p-0 m-0">
            <div style={{width: '100%'}} className="d-grid m-2">
            <Button size="lg" variant="outline-secondary" onClick={this.handleAgeConfirm}>
              Enter
            </Button>
            </div>
          </Modal.Footer>
        </Modal>
        <Nav />
        <div className="App col-lg-12 mx-auto">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="wine" element={<Wine />} />
            <Route path="wine2" element={<Wine2 />} />
            <Route path="table-of-contents" element={<TableOfConents />} />
            <Route path="find-your-wine" element={<FindYourWine state={this.state} />} />
            <Route path="wine-top-picks" element={<TopWine state={this.state}/>} />
            <Route path="new-wines" element={<NewWines state={this.state}/>} />
            <Route path="definitions" element={<Definitions/>} />
            <Route path="credits" element={<Credits state={this.state}/>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
        <Footer />
      </HashRouter>
    );
  }
}

export default App;
