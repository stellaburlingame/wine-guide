import React from "react";

function Index(props) {
    return (
        <>
            <input type="radio" className="btn-check" name="options" id={props.id} autoComplete="off" />
            <label onClick={() => props.onClick()} className={`btn btn-secondary col ${props.class}`} htmlFor={props.id}>{props.label}</label>
        </>
    );
}

export default Index;