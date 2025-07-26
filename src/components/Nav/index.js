import React from "react";
import { Link } from "react-router-dom";
import Dropdown from 'react-bootstrap/Dropdown';
import NavItem from 'react-bootstrap/NavItem';
import NavLink from 'react-bootstrap/NavLink';

require('./index.css')

function Index(props) {
    return (
        <main>
        <nav className="navbar navbar-dark navbar-expand-lg bg-dark ">
            <div className="container">
                <Link variant="outline-*" className="navbar-brand logo" to="/">Wine Training</Link>
                <div id="navbarNav">
                <ul id="links" className="nav ml-auto">
                    <Link variant="outline-*" className="nav-link" to="/">Home</Link>
                    <Link variant="outline-*" className="nav-link" to="definitions">Definitions</Link>
                    <Link variant="outline-*" className="nav-link" to="wine">Wines</Link>

                    {/* <Dropdown as={NavItem}>
                      <Dropdown.Toggle as={NavLink} className="nav-link text-white">Wines</Dropdown.Toggle>
                      <Dropdown.Menu>
                        <Dropdown.Item as={Link} to="all">All Wines</Dropdown.Item>
                        <Dropdown.Item as={Link} to="italiano">Rosso Italiano</Dropdown.Item>
                        <Dropdown.Item as={Link} to="rosso">Rosso</Dropdown.Item>
                        <Dropdown.Item as={Link} to="bianco">Bianco</Dropdown.Item>
                        <Dropdown.Item as={Link} to="sparkling">Sparkling</Dropdown.Item>
                        <Dropdown.Item as={Link} to="rose">Rose</Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown> */}
                </ul>
                </div>
            </div>
            </nav>
        </main>
    );
}

export default Index;