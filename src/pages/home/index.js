import React from "react";
import Button from 'react-bootstrap/Button';
import { Link } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";
import { ReactComponent as RotatedLogo } from '../wine/rotated.svg';



import './index.css';



function Index(props) {
    return (
        <main>
            <div className="position-relative overflow-hidden p-3 p-md-5 m-md-3 text-center bg-body-tertiary">
                <div className="col-md-8 p-lg-5 mx-auto my-5">
                    <div className="d-flex align-items-center justify-content-center">
                        {/* <img src={`${process.env.PUBLIC_URL}/assets/light.svg`} alt="Wine Guide Logo" height="120" className="me-3" /> */}
                        <h1 className="display-3 fw-bold">Welcome to the Stella Wine Guide</h1>
                    </div>
                    <h3 className="fw-normal text-muted mb-3">
                        Explore our curated wine list, tasting notes, and recommended pairings
                    </h3>
                    <div className="d-flex justify-content-center gap-3 mt-4">
                        <Link to="wine">
                            <Button variant="dark" size="lg">Go to Wine List{' '}<FaArrowRight size={'2em'} /></Button>
                        </Link>
                    </div>
                </div>
                <RotatedLogo
                className="wine-logo wine-2 d-none d-md-block"
                    style={{
                    zIndex: 1,
                    // CSS variables consumed inside the SVG (see rotated.svg edits)
                    '--wine-base': '#6B0F1A',
                    '--bubbles-stroke': '#fff',
                    }}
                />
                <RotatedLogo
                className="wine-logo wine-logo d-none d-md-block"
                    style={{
                    zIndex: 1,
                    // CSS variables consumed inside the SVG (see rotated.svg edits)
                    '--wine-base': '#F5F6CF',
                    '--bubbles-stroke': '#F5F6CF',
                    }}
                />
                {/* <RotatedLogo className="wine-logo d-none d-md-block"/> */}
            </div>
        </main>
    );
}

export default Index;