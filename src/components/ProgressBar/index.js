import React from "react";
import './index.css';

import ProgressBar from 'react-bootstrap/ProgressBar';

const barValues = {
    "body" : {
        "full": 100,
        "medium to full": 75,
        "medium": 50,
        "light to medium": 25,
        "light": 10,
        "": 0
    },
    "tannin": {
        "high": 100,
        "medium to high": 75,
        "medium": 50,
        "medium to low": 25,
        "low": 0,
        "": 0
    }
}

const barLevels = {
    "body" : ["Light", "Medium", "Full"],
    "tannin": ["Low", "Medium", "High"]
}


function Index(props) {
    return (

        <div className="wine-specs__body" data-testid="wine-specs__tannins">
            <div>
                {barLevels[props.type].map((level) => (
                    <span key={level} className="wine-specs__body--medium">{level}</span>
                ))}
            </div>
            <ProgressBar
                className={"bg-wine-body"}
                style={{ '--color-bg': props.color }}
                now={
                    barValues[props.type][props.value?.toLowerCase()] || 0
                }
            />
        </div>
        
    );
}

export default Index;