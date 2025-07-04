import React from "react";
import { Link } from "react-router-dom";

require('./index.css')

function Index(props) {
    return (
        <main>
        <nav className="navbar navbar-dark navbar-expand-lg bg-dark ">
            <div className="container">
                <div id="navbarNav">
                <ul id="links" className="nav  ml-auto">
                    {/* <Link variant="outline-*" className="navbar-brand logo" to="/">Training</Link> */}
                    <Link variant="outline-*" className="nav-link" to="italiano">Rosso Italiano</Link>
                    <Link variant="outline-*" className="nav-link" to="rosso">Rosso</Link>
                    <Link variant="outline-*" className="nav-link" to="bianco">Bianco</Link>
                    {/* <Link variant="outline-*" className="nav-link" to="sparkling">Sparking</Link>
                    <Link variant="outline-*" className="nav-link" to="rose">Rose</Link> */}
                </ul>
                </div>
            </div>
            </nav>
        </main>
    );
}

export default Index;