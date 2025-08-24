import React from "react";
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import { CardGroup } from "react-bootstrap";
import { Link } from "react-router-dom";


function Index(props) {
    return (
        <main>
            <div className="position-relative overflow-hidden p-3 p-md-5 m-md-3 text-center bg-body-tertiary">
                <div className="col-md-8 p-lg-5 mx-auto my-5">
                    <div className="d-flex align-items-center justify-content-center">
                        <img src="wine-training/assets/light.svg" alt="Stella Logo" height="120" className="me-3" />
                        <h1 className="display-3 fw-bold">Welcome to the Stella Wine Guide</h1>
                    </div>
                    <h3 className="fw-normal text-muted mb-3">
                        Explore our curated wine list, tasting notes, and recommended pairings
                    </h3>
                    <div className="d-flex justify-content-center gap-3 mt-4">
                        <Link to="wine">
                            <Button variant="primary" size="lg">Wine List</Button>
                        </Link>
                        <Link to="credits">
                            <Button variant="outline-secondary" size="lg">Credits</Button>
                        </Link>
                    </div>
                </div>
                <div className="product-device shadow-sm d-none d-md-block"></div>
                <div className="product-device product-device-2 shadow-sm d-none d-md-block"></div>
            </div>
        </main>
    );
}

export default Index;