import React from "react";
import { NavLink } from "react-router-dom";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Container from "react-bootstrap/Container";

require("./index.css");

function Index() {
    return (
        <main>
        {/* Navbar controls its own collapse. Make sure Bootstrap CSS is loaded in your app entry (e.g., index.js). */}
        <Navbar expand="lg" bg="dark" variant="dark" className="justify-content-between">
            <Container>
            <Navbar.Brand as={NavLink} to="/">
                <img
                alt=""
                src={`${process.env.PUBLIC_URL}/assets/dark.svg`}
                width="30"
                height="30"
                className="d-inline-block align-top"
                />{" "}
                Stella Wine Guide
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
                <Nav className="nav-links">
                <NavLink
                    to="/wine-top-picks"
                    className={({ isActive }) => "nav-link" + (isActive ? " nav-active" : "")}
                >
                    Top Wine Picks
                </NavLink>
                <NavLink
                    to="/wine"
                    className={({ isActive }) => "nav-link" + (isActive ? " nav-active" : "")}
                >
                    Wine List
                </NavLink>
                {/*
                <NavLink
                    to="/find-your-wine"
                    className={({ isActive }) => "nav-link" + (isActive ? " nav-active" : "")}
                >
                    Find Your Wine
                </NavLink>
                */}
                </Nav>
            </Navbar.Collapse>
            </Container>
        </Navbar>
        </main>
    );
}

export default Index;