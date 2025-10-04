import React from "react";

function setActive(event) {
    const label = event.currentTarget;
    if (label.classList.contains('active')) {
        label.classList.remove('active');
    } else {
        label.classList.add('active');
    }
}

function Index(props) {
    return (
        <>
            <input type="checkbox" className="btn-check" name="options" id={props.id} autoComplete="off" />
            <label onClick={(e) => {props.onClick(e); setActive(e)}} className={`btn ${props.className}`} style={props.style} htmlFor={props.id}>{props.children}</label>
        </>
    );
}

export default Index;