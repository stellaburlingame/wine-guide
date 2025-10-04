import { Tabs, Tab } from "react-bootstrap";

import './WineTabs.css'

export function WineTabs(props) {
    const { activeKey, updateFilters } = props;
    return(
        <Tabs
            activeKey={activeKey}
            onSelect={(k) => {
                // Handle Top Picks logic
                // this.setState((prevState) => ({
                //     ...prevState,
                //     selectedType: k
                // }));
                updateFilters({ selectedType: k });
                // Update URL hash without reloading the page
                const url = new URL(window.location.href);
                url.hash = `#/wine#${k}`;
                window.history.pushState(null, "", url);
            }}
            id="type-tab"
            className="wine-type-tabs"
            justify
        >
            <Tab eventKey="" title="All Types" />
            <Tab eventKey="glass" title="Wines by the Glass" />
            <Tab eventKey="sparkling" title="Sparkling" />
            <Tab eventKey="bianco" title="Bianco and Rose" />
            <Tab eventKey="rosso" title="Rosso" />
            <Tab eventKey="italiano" title="Italiano" />
            {/* <Tab eventKey="rose" title="Rose" /> */}
        </Tabs>
    )
}