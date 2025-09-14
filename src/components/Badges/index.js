import React from "react";
import './index.css';

import icons from "../../components/Icons/icons.json";
import DefinitionModal from "../DefinitionModal";


function getDefinitionModal(icon, wine) {
        const lowerKeywords = icon.Keywords?.map(k => k.toLowerCase()) || [];
        const fields = ["Summary", "Flavor", "Aroma", "Body Characteristics", "Tannin Characteristics"];

        for (const field of fields) {
            const text = wine[field];
            if (!text) continue;
            const sentence = text.split(/(?<=[.?!])\s+/).find(sent => lowerKeywords.some(keyword => sent.toLowerCase().includes(keyword))
            );
            if (sentence) {
                return( <DefinitionModal 
                    Name={icon.Type}
                    Definition={<><strong>Definition: </strong>{icon.Definition.replace(/\*\*/g, '').trim()}</>}
                    Secondary_Text={<><strong>{wine["Wine Name"]}: </strong>{sentence.replace(/\*\*/g, '').trim()}</>}
                    Image=""
                />)
            }
        }
        // fallback: show first keyword match or empty string
        const allText = `${wine["Summary"] ?? ""} ${wine["Flavor"] ?? ""} ${wine["Aroma"] ?? ""} ${wine["Body Characteristics"] ?? ""} ${wine["Tannin Characteristics"] ?? ""} ${wine["Tannin Characteristics"] ?? ""}`;
        const fallbackKeyword = lowerKeywords.find(k => allText.toLowerCase().includes(k)) || "";
        return( <DefinitionModal 
            Name={icon.Type}
            Definition={<><strong>Definition: </strong>{icon.Definition.replace(/\*\*/g, '').trim()}</>}
            Secondary_Text={fallbackKeyword ? <><strong>{wine["Wine Name"]}: </strong>{fallbackKeyword}</> : ""}
            Image=""
        />)
}

export function TopBottle() {
    return (
        <span className="badge wine-top-selling">⭐️ Top Selling Bottle</span>
    )
}

export function TopGlass() {
    return (
        <span className="badge wine-top-selling">⭐️ Top Selling Glass</span>
    )
}
export function Piemonte(onClick) {
    if (!onClick) {
        return (
            <span className="badge wine-piemonte" style={{ cursor: 'default' }}>✨ Piemonte</span>
        )
    }
    else {
        return (
            <span className="badge wine-piemonte" onClick={() => onClick("Piemonte")} style={{ cursor: 'pointer' }}>✨ Piemonte</span>
        )
    }
}

export function DOCG(props) {
    if (!props.onClick) {
        return (
            <span className="badge wine-docg" style={{ cursor: 'default' }}>DOCG</span>
        )
    }
    return (
        <span className="badge wine-docg" onClick={() => props.onClick("DOCG")} style={{ cursor: 'pointer' }}>DOCG</span>
    )
}

export function DOC(props) {
    if (!props.onClick) {
        return (
            <span className="badge wine-doc" style={{ cursor: 'default' }}>DOC</span>
        )
    }
    return (
        <span className="badge wine-doc" onClick={() => props.onClick("DOC")} style={{ cursor: 'pointer' }}>DOC</span>
    )
}

export function Vintage(props) {
    return (
        <span className="badge wine-vintage bg-secondary">{props.children}</span>
    )
}

export function PriceBadge(props) {
    const wine = props.wine;
    return (
        <>
        {!isNaN(parseFloat(wine.Glass_Price)) && parseFloat(wine.Glass_Price) > 0 && (
            <span bg='success' className="badge wine-price bg-success">${parseInt(wine.Glass_Price)}/gls</span>
        )} {' '}
        {!isNaN(parseFloat(wine.Half_Bottle_Price)) && parseFloat(wine.Half_Bottle_Price) > 0 && (
            <span bg='success' className="badge wine-price bg-success">${parseInt(wine.Half_Bottle_Price)}/half btl</span>
        )} {' '}
        {!isNaN(parseFloat(wine.Bottle_Price)) && parseFloat(wine.Bottle_Price) > 0 && (
            <span bg='success' className="badge wine-price bg-success">${parseInt(wine.Bottle_Price)}/btl</span>
        )}
        </>
    )
}


export function getIcon(iconType, handleModalShow, wine) {
    const icon = icons.filter(icon => icon.Type === iconType)[0]
    if (!icon) {
        return null;
    }
    return (
        <span
            className="badge"
            style={{ marginRight: "0.5em", backgroundColor: icon.Color, color: icon.TextColor || "black", cursor: handleModalShow ? 'pointer' : 'default' }}
            onClick={handleModalShow ? () => handleModalShow(
                getDefinitionModal(icon, wine)
            ) : null}
        >
            {icon.Icon} {icon.Type}
        </span>
    )   

}

export function Icons(props) {
    const wine = props.wine;
    // Compute the array of icon elements to render
    const iconArray = icons.map((icon, i) => {
        const lowerKeywords = icon.Keywords?.map(k => k.toLowerCase()) || [];
        // const match = lowerKeywords.some(keyword => `${wine["Summary"] ?? ""} ${wine["Flavor"] ?? ""} ${wine["Aroma"] ?? ""} ${wine["Body Characteristics"] ?? ""} ${wine["Tannin Characteristics"] ?? ""}`.toLowerCase().includes(keyword)
        const match = lowerKeywords.some(keyword => `${wine["Top Icons"] ??  ""}`.toLowerCase().includes(keyword)
        );
        return match ? (
        <React.Fragment key={i}>
            <span
            className="badge"
            style={{ marginRight: "0.5em", backgroundColor: icon.Color, color: icon.TextColor, cursor: props.handleModalShow ? 'pointer' : 'default' }}
            onClick={
                props.handleModalShow ? () => {
                    props.handleModalShow(
                        getDefinitionModal(icon, wine)
                    )
            } : null}
            >
            {icon.Icon} {icon.Type}
            </span>
        </React.Fragment>
        ) : null;
    });
    return iconArray.filter(Boolean).length > 0 && (
    <>
        {wine['Region'] === "Piemonte" && (
            <>{Piemonte(props.handleDefinitionShow)}{' '}</>
        )}
        {wine['Sustainability'] && (
            getIcon("Sustainable", props.handleModalShow, wine)
        )}
        {wine['Vegan'] && (
            getIcon("Vegan", props.handleModalShow, wine)
        )}
        {iconArray}
    </>
    );
}