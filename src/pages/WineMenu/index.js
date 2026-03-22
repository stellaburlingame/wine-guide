import React from "react";
import Row from 'react-bootstrap/Row';
import DefinitionModal from '../../components/DefinitionModal';
import BlankModal from '../../components/BlankModal';

import WineCard from "../../components/WineCard";

import "./index.css";


class index extends React.Component {

    state = {
    }
    handleChange(event) {
        this.setState({ selectedRegion: event.target.value });
    }
    handleModalShow = (body, fullScreen) => {
      this.setState({ showModal: true, fullScreen: fullScreen, modalContent: body });
    }
    handleDefinitionShow = (term) => {
        const matched = this.props.state.definitions.find(
            d => d.Name?.toLowerCase() === (term?.Name || term)?.toLowerCase()
        );
        if (matched) {
            this.handleModalShow(<DefinitionModal {...matched} />);
        }
    }
    handleDefinitionClose = () => {
        this.setState({ showModal: false });
    }
  render() {
    const wineMenu = [ {'Wines by the glass': 'glass'}, {'Sparkling' : 'sparkling'}, {'Bianco and Rose': 'bianco'}, {'Rosso': 'rosso'}, {'Rosso Italiano': 'italiano'} ];
    const getSortOrder = (item) => {
      const pos = item?.["Glass Position"];
      if (pos === undefined || pos === null) return 0;

      const parsed = Number(pos);
      return Number.isFinite(parsed) ? parsed : 0;
    };
    const specsFromProps = this.props.state && Array.isArray(this.props.state.specs) ? this.props.state.specs : [];
    if (specsFromProps.length === 0) {
      return <div>Loading...</div>;
    }
        return (
            <>
            <Row className="main-menu-wrapper">
                {/* <div className="col-8"> */}
                <span />
                <br />
                    {wineMenu.map((category, index) => {
                      return(
                        <div className="menu-wrapper" key={index}>
                          <h2 style={{ textAlign: 'left' }} className="food-menu-category">{Object.keys(category)[0]}</h2>
                            {specsFromProps
                              .filter(w => {
                                const wineCategories = Array.isArray(w['Categories']) ? w['Categories'] : [];
                                const targetCategory = String(Object.values(category)[0] || '').toLowerCase();
                                return wineCategories.some(cat => String(cat).toLowerCase() === targetCategory);
                              })
                              .sort((a, b) => {
                                const categoryKey = Object.values(category)[0];
                                if (categoryKey !== 'glass') return 0;
                                return getSortOrder(a) - getSortOrder(b);
                              })
                              .map((item, idx) => (
                                <div key={idx} style={{ textAlign: 'left', display: 'flex' }} className="food-menu-item">
                                  <div style={{ width: 'max-content'}} className="food-menu-title">{item["Wine Name"]}</div>
                                  <div style={{ width: 'max-content', marginLeft: 'auto' }} >
                                  {item['Glass_Price'] !== undefined && item['Glass_Price'] !== 0 && <span className="food-menu-description">${item['Glass_Price']}</span>}
                                  {item['Glass_Price'] !== undefined && item['Glass_Price'] !== 0 && item['Bottle_Price'] !== undefined && item['Bottle_Price'] !== 0 && <span className="food-menu-description"> / </span>}
                                  {item['Bottle_Price'] !== undefined && item['Bottle_Price'] !== 0 && <span className="food-menu-description">${item['Bottle_Price']}</span>}
                                  {item['Half_Bottle_Price'] !== undefined && item['Half_Bottle_Price'] !== 0 && <span className="food-menu-description">${item['Half_Bottle_Price']}</span>}
                                  </div>
                                  <br />
                                </div>
                              ))}
                        </div>
                      )
                    })}
                    {/* {menu.map((category, index) => {
                        return (
                            <div className="menu-wrapper" key={index}>
                                <h2 className="food-menu-category">{Object.keys(category)[0]}</h2>
                                {Object.values(category)[0]
                                    .sort((a, b) => getSortOrder(a) - getSortOrder(b))
                                    .map((item, idx) => (
                                    <div key={idx} className="food-menu-item">
                                        <span className="food-menu-title">{formatTitle(item.title.rendered)}</span>
                                        <br />
                                        <span className="food-menu-description">{getPlainText(item.content.rendered)}</span>
                                    </div>
                                ))}
                            </div>
                        )
                    })} */}
            </Row>
              <Row className="col-12 wine-print">
                {(() => {
                  // Show Top Wine Picks only
                  const filteredData = specsFromProps.filter(w => w["New Wine"]);
                  return filteredData.map((data1, index) => (
                    <div className="wine-wrapper col-md-12 col-lg-6 col-sm-12" key={index}>
                      <WineCard
                        wine={data1}
                        index={index}
                        format={this.format}
                        state={this.props.state}
                        handleDefinitionShow={this.handleDefinitionShow}
                        handleModalShow={this.handleModalShow}
                        handleModalClose={this.handleDefinitionClose}
                      />
                      </div>
                  ));
                })()}
            </Row>

            <BlankModal 
              show={this.state.showModal}
              onHide={this.handleDefinitionClose}
              body={this.state.modalContent}
              fullScreen={this.state.fullScreen}
            />
        </>
        )
    }
}

export default index;
