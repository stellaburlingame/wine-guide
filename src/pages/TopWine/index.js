import React from "react";
import Row from 'react-bootstrap/Row';
import DefinitionModal from '../../components/DefinitionModal';

import WineCard from "../../components/WineCard";

import "./print.css";
import "./index.css";


class index extends React.Component {
    state = {
    }
    // Add logic to set selectedType and filter by Wine Type based on hash on mount
    componentDidMount() {
        // --- End hash filter logic for #top ---
        window.addEventListener('scroll', this.checkScrollTop);
    }

    componentWillUnmount() {
        window.removeEventListener('scroll', this.checkScrollTop);
    }
    scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    checkScrollTop = () => {
        if (!this.state.showScrollToTop && window.pageYOffset > 400) {
            this.setState({ showScrollToTop: true });
        } else if (this.state.showScrollToTop && window.pageYOffset <= 400) {
            this.setState({ showScrollToTop: false });
        }
    }
    handleChange(event) {
        this.setState({ selectedRegion: event.target.value });
    }
    handleModalShow = (term) => {
      this.setState({ showDefinitionModal: true, currentTerm: term });
    }
    handleDefinitionShow = (term) => {
        const matched = this.props.state.definitions.find(
            d => d.Name?.toLowerCase() === (term?.Name || term)?.toLowerCase()
        );
        if (matched) {
            this.handleModalShow(matched);
        }
    }
    handleDefinitionClose = () => {
        this.setState({ showDefinitionModal: false });
    }
  render() {
    const specsFromProps = this.props.state && Array.isArray(this.props.state.specs) ? this.props.state.specs : [];
    if (specsFromProps.length === 0) {
      return <div>Loading...</div>;
    }
        return (
            <>
              <Row className="col-12 wine-print">
                {(() => {
                  // Show Top Wine Picks only
                  const filteredData = specsFromProps.filter(w => w["Top Bottle"] || w["Top Glass"]);
                  return filteredData.map((data1, index) => (
                    <div className="wine-wrapper col-md-12 col-lg-6 col-sm-12" key={index}>
                      <WineCard
                        wine={data1}
                        index={index}
                        format={this.format}
                        state={this.props.state}
                        handleDefinitionShow={this.handleDefinitionShow}
                        handleModalShow={this.handleModalShow}
                        />
                      </div>
                  ));
                })()}
            </Row>

            <DefinitionModal
              show={this.state.showDefinitionModal}
              onHide={this.handleDefinitionClose}
              Name={this.state.currentTerm?.Name}
              Definition={this.state.currentTerm?.Definition}
              Secondary_Text={this.state.currentTerm?.Secondary_Text}
              Image={this.state.currentTerm?.Image}
            />
            {this.state.showScrollToTop && (
              <button
                onClick={this.scrollToTop}
                className="scroll-to-top-button"
                style={{
                }}
              >
                ↑ Top
              </button>
            )}
        </>
        )
    }
}

export default index;