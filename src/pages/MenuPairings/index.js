import React from "react";
import Row from 'react-bootstrap/Row';
import DefinitionModal from '../../components/DefinitionModal';
import BlankModal from '../../components/BlankModal';

import WineCard from "../../components/WineCard";

import "./index.css";

import antipasti from './antipasti.json'
import pasta from './pasta.json'
import entree from './entree.json'
// import cortoni from './cortoni.json'

const getPlainText = (html = '') => {
  if (!html) {
    return '';
  }
  if (typeof document !== 'undefined') {
    const div = document.createElement('div');
    div.innerHTML = html;
    return div.textContent || div.innerText || '';
  }
  const stripped = html.replace(/<[^>]+>/g, '');
  return stripped
    .replace(/&#x([0-9a-fA-F]+);/g, (_, code) => String.fromCharCode(parseInt(code, 16)))
    .replace(/&#([0-9]+);/g, (_, code) => String.fromCharCode(parseInt(code, 10)))
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'");
};

const formatTitle = (title = '') => {
  const decoded = getPlainText(title);
  return decoded.replace(/\s*\$.*/, '').trim();
};


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
    const menu = [ {'Antipasti': antipasti}, {'Pasta' : pasta}, {'Secondi': entree} ];
    const getSortOrder = (item) => {
      const order = item?.sort_order;
      const rawValue = typeof order === 'object' ? (order?.value ?? order?.rendered) : order;
      const parsed = Number(rawValue);
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

                    {menu.map((category, index) => {
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
                    })}
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
