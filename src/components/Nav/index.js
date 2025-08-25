import React from "react";
import Nav from 'react-bootstrap/Nav';
import { NavLink } from "react-router-dom";
import Navbar from 'react-bootstrap/Navbar';

require('./index.css')
function Index(props) {
    return (
        <main>
        <Nav variant="underline" defaultActiveKey="/" className="navbar navbar-dark navbar-expand-lg bg-dark ">
            <div className="container">
                <Navbar.Brand as={NavLink} to="/">
                    <img
                    alt=""
                    src={`${process.env.PUBLIC_URL}/assets/dark.svg`}
                    width="30px"
                    height="30px"
                    className="d-inline-block align-top"
                    />{' '}
                    Stella Wine Guide
                </Navbar.Brand>
                <div id="navbarNav">
                <ul id="links" className="nav ml-auto">
                    {/* <NavLink to="/" end className={({ isActive }) => "nav-link" + (isActive ? " nav-active" : "")}>
                        Home
                    </NavLink> */}
                    <NavLink to="/definitions" className={({ isActive }) => "nav-link" + (isActive ? " nav-active" : "")}>
                        Definitions
                    </NavLink>
                    <NavLink to="/wine" className={({ isActive }) => "nav-link" + (isActive ? " nav-active" : "")}>
                        Wines
                    </NavLink>
                    <NavLink to="/wine-top-picks" className={({ isActive }) => "nav-link" + (isActive ? " nav-active" : "")}>
                        Top Wine Picks
                    </NavLink>
                </ul>
                </div>
            </div>
            </Nav>
        </main>
    );
}

export default Index;