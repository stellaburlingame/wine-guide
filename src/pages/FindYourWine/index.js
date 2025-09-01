import React from 'react'

import Button from 'react-bootstrap/Button';
import { FaArrowRight } from "react-icons/fa";
import Row from 'react-bootstrap/Row';
import { Col } from 'react-bootstrap';


class index extends React.Component {
    state = {
        page: 'home'
    }

    componentDidMount() {
    }

    componentWillUnmount() {
    }
    handleNextPage = (page) => {
        this.setState({ page: page });
        window.location.hash = `/find-your-wine#${page}`;
    }
    home() {
        return (
            <div className="position-relative overflow-hidden p-3 p-md-5 m-md-3 text-center bg-body-tertiary">
                <div className="col-md-8 p-lg-5 mx-auto my-5">
                    <div className="d-flex align-items-center justify-content-center">
                        <h1 className="display-3 fw-bold">Get the best wine for your experience tonight</h1>
                    </div>
                    <br />
                    <div className="d-flex justify-content-center gap-3 mt-4">
                        <Button onClick={() => this.handleNextPage('wine-choice')} variant="dark" size="lg">Get started{' '}<FaArrowRight size={'2em'} /></Button>
                    </div>
                </div>
            </div> 
        )
    }
    wineChoice() {
        return (
            <div className="position-relative overflow-hidden p-3 p-md-5 m-md-3 text-center bg-body-tertiary">
                <div className="col-md-8 p-lg-5 mx-auto my-5">
                    <div className="d-flex align-items-center justify-content-center">
                        <h1 className="display-3 fw-bold">Which style of wine would you prefer?</h1>
                    </div>
                    <br />
                    <Row>
                        <Col className=''>
                        </Col>
                    </Row>
                    <div className="d-flex justify-content-center gap-3 mt-4">
                        <Button onClick={() => this.handleNextPage('body-choice')} variant="dark" size="lg">Get started{' '}<FaArrowRight size={'2em'} /></Button>
                    </div>
                </div>
            </div> 
        )
    }

    bodyChoice() {
        return (
            <div className="position-relative overflow-hidden p-3 p-md-5 m-md-3 text-center bg-body-tertiary">
                <div className="col-md-8 p-lg-5 mx-auto my-5">
                    <div className="d-flex align-items-center justify-content-center">
                        <h1 className="display-3 fw-bold">4 sets of bodies</h1>
                    </div>
                    <br />
                    <div className="d-flex justify-content-center gap-3 mt-4">
                        <Button onClick={() => this.handleNextPage('body-choice')} variant="dark" size="lg">Get started{' '}<FaArrowRight size={'2em'} /></Button>
                    </div>
                </div>
            </div> 
        )
    }


    pages(pageNumber) {
        let pages = {
            '': this.home(),
            'wine-choice': this.wineChoice(),
            'body-choice': this.bodyChoice(),
        }
        return pages[pageNumber] ? pages[pageNumber] : this.home()
    }
    render() {
        return(
            <main>
                {this.pages((this.state && this.state.page) ? this.state.page : 'page1')}
            </main>
        )
    }
}

export default index