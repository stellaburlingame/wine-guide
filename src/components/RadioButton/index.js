import React from "react";

function Index(props) {
    return (
        <>
            <input type="check" className="btn-check" name="options" id={props.id} autoComplete="off" />
            <label onClick={() => props.onClick()} className={`btn btn-secondary ${props.className}`} htmlFor={props.id}>{props.label}</label>
        </>
    );
}

export default Index;