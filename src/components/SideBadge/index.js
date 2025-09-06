import React from "react";
import { Button } from "react-bootstrap";
import './index.css';

function Index(props) {
    return (
        <Button className="side-badge" variant="secondary" onClick={() => {props.onClick()}}>
            See Similar Wines
        </Button>
    );
}

export default Index;