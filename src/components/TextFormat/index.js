import React from "react";

function Index(props) {
    function formatText(text) {
        var formattedText =
        <span>
            {text?.split(/\*\*(.*?)\*\*/g).map((part, index) =>
            index % 2 === 1 ? <strong key={index}>{part}</strong> : part
            )}
        </span>
        return formattedText;
    }    

    return (
        <>
            {formatText(props)}
        </>
    );
}

export default Index;