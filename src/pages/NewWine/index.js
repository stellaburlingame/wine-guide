import React from "react";
import Row from 'react-bootstrap/Row';
import DefinitionModal from '../../components/DefinitionModal';
import BlankModal from '../../components/BlankModal';

import WineCard from "../../components/WineCard";

import "./print.css";
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
    const specsFromProps = this.props.state && Array.isArray(this.props.state.specs) ? this.props.state.specs : [];
    if (specsFromProps.length === 0) {
      return <div>Loading...</div>;
    }
        return (
            <>
              <Row className="col-12 wine-print">
                {(() => {
                  // Show Top Wine Picks only
                  const introducedDates = specsFromProps
                    .filter(w => w["introduced"])
                    .map(w => w["introduced"]);
                  const mostRecentDates = [...new Set(introducedDates)]
                    .sort((a, b) => new Date(b) - new Date(a))
                    .slice(0, 3);
                  const formatIntroducedDate = (dateStr) => {
                    const date = new Date(dateStr);
                    const day = date.getDate();
                    const month = date.toLocaleString("en-US", { month: "long" });
                    const year = date.getFullYear();
                    const v = day % 100;
                    const suffix = (v >= 11 && v <= 13)
                      ? "th"
                      : (["th", "st", "nd", "rd"][Math.min(day % 10, 4)] || "th");
                    return `${month} ${day}${suffix}, ${year}`;
                  };

                  return mostRecentDates.map((dateStr) => {
                    const winesForDate = specsFromProps.filter(
                      w => w["New Wine"] && w["introduced"] === dateStr
                    );

                    return (
                      <React.Fragment key={dateStr}>
                        <hr />
                        <br />
                        <div className="col-12">
                          <h3>{formatIntroducedDate(dateStr)}</h3>
                        </div>
                        {winesForDate.map((data1, index) => (
                          <div
                            className="wine-wrapper col-md-12 col-lg-6 col-sm-12"
                            key={`${dateStr}-${data1["Wine Name"] || index}`}
                          >
                            <WineCard
                              wine={data1}
                              index={index}
                              format={this.format}
                              state={this.props.state}
                              specs={specsFromProps}
                              handleDefinitionShow={this.handleDefinitionShow}
                              handleModalShow={this.handleModalShow}
                              handleModalClose={this.handleDefinitionClose}
                              varietals={this.props.state.varietals}
                            />
                          </div>
                        ))}
                      </React.Fragment>
                    );
                  });
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
