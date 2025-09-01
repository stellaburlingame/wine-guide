import React from "react";
import { Button } from "react-bootstrap";
import './index.css';

function Index(props) {
    return (
        <div className="side-badge">
            <Button variant="secondary" className="p-1">
                &nbsp;&nbsp;&nbsp;&nbsp;See Similar Wines
            </Button>
        </div>
    );
}

export default Index;