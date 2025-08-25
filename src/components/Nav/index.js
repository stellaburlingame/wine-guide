import React from "react";
import { Link } from "react-router-dom";
import Navbar from 'react-bootstrap/Navbar';

require('./index.css')
function Index(props) {
    return (
        <main>
        <nav className="navbar navbar-dark navbar-expand-lg bg-dark ">
            <div className="container">
                <Link to="/" className="navbar-brand">
                <Navbar.Brand href="#home">
                    <img
                    alt=""
                    src={`./assets/dark.svg`}
                    width="30px"
                    height="30px"
                    className="d-inline-block align-top"
                    />{' '}
                    Stella Wine Guide
                </Navbar.Brand>
                </Link>
                <div id="navbarNav">
                <ul id="links" className="nav ml-auto">
                    <Link variant="outline-*" className="nav-link" to="/">Home</Link>
                    <Link variant="outline-*" className="nav-link" to="definitions">Definitions</Link>
                    <Link variant="outline-*" className="nav-link" to="wine">Wines</Link>
                    <Link variant="outline-*" className="nav-link" to="wine-top-picks">Top Wine Picks</Link>
                </ul>
                </div>
            </div>
            </nav>
        </main>
    );
}

export default Index;