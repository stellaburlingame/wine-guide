import React from 'react'

import Button from 'react-bootstrap/Button';
import { FaArrowRight } from "react-icons/fa";
import Row from 'react-bootstrap/Row';
import Form from 'react-bootstrap/Form'
import RadioButton from '../../components/RadioButton'
import CheckButton from '../../components/CheckButton'
import icons from '../../components/Icons/icons.json'
import './index.css'
import { Features } from './Components/Features';


class index extends React.Component {
    state = {
        page: ''
    }

    componentDidMount() {
    }

    componentWillUnmount() {
    }
    handleNextPage = (page) => {
        this.setState({ page: page });
        window.location.hash = `/find-your-wine#${page}`;
    }
    handleUpdateChoice(e) {
        console.log(e)
        let preferences = this.state.preferences || {}
        let updatedKey = Object.keys(e)[0]
        preferences[updatedKey] = e[updatedKey]
        this.setState({preferences: preferences})
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
                    <Row className='wine-choice-body'>
                        <Button variant='danger' size="lg" onClick={(e) => {this.handleUpdateChoice({'style': 'red'});}} style={{backgroundColor: 'indianred'}} className='wine-choice-button col-4'>
                            Red
                        </Button>
                        <Button variant='warning' size="lg" onClick={() => {this.handleUpdateChoice({'style': 'white'})}} style={{backgroundColor: '#F2E88F'}} className='wine-choice-button col-4'>
                            White
                        </Button>
                        <Button variant='danger' size="lg" onClick={() => {this.handleUpdateChoice({'style': 'rose'})}} style={{backgroundColor: 'indianred'}} className='wine-choice-button col-4'>
                            Rose
                        </Button>
                        <Button variant='warning' size="lg" onClick={() => {this.handleUpdateChoice({'style': 'sparkling'})}} style={{backgroundColor: '#F2E88F'}} className='wine-choice-button col-4'>
                            Sparkling
                        </Button>
                    </Row>
                    <br />
                    <Row>
                        <Button disabled={this.state['next-page-button-active']} onClick={() => this.handleNextPage('body-choice')} variant="secondary" size="md">Next Page {' '}<FaArrowRight size={'2em'} /></Button>
                    </Row>
                </div>
            </div> 
        )
    }

    bodyChoice() {
        return (
            <div className="position-relative overflow-hidden p-3 p-md-5 m-md-3 text-center bg-body-tertiary">
                <div className="col-md-8 p-lg-5 mx-auto my-5">
                    <div className="d-flex align-items-center justify-content-center">
                        <h1 className="display-3 fw-bold">Which body of wine would you prefer?</h1>
                    </div>
                    <br />
                    <Row className='wine-choice-body'>
                        <Form className='body-choice'>
                            {
                                [
                                    {
                                        'id': 'low',
                                        'label': ['Low', <br />, 'Bodied']
                                    },
                                    {
                                        'id': 'light-medium',
                                        'label': ['Low to Medium', <br />, 'Bodied']
                                    },
                                    {
                                        'id': 'medium',
                                        'label': ['Medium', <br />, 'Bodied']
                                    },
                                    {
                                        'id': 'medium-full',
                                        'label': ['Medium to Full', <br />, 'Bodied']
                                    },
                                    {
                                        'id': 'full',
                                        'label': ['Full', <br />, 'Bodied']
                                    }
                                ].map((btn,idx) => {
                                    return <RadioButton className={'col-sm-12 col-md-12 col-lg-2'} key={idx} id={btn.id} label={btn.label} onClick={() => this.handleUpdateChoice({'body': btn.id})} />
                                })
                            }
                        </Form>
                    </Row>
                    <br />
                    <Row>
                        <Button disabled={this.state['next-page-button-active']} onClick={() => this.handleNextPage('features')} variant="secondary" size="md">Next Page {' '}<FaArrowRight size={'2em'} /></Button>
                    </Row>
                </div>
            </div> 
        )
    }

    priceRange() {
        return (
            <div className="position-relative overflow-hidden p-3 p-md-5 m-md-3 text-center bg-body-tertiary">
                <div className="col-md-8 p-lg-5 mx-auto my-5">
                    <div className="d-flex align-items-center justify-content-center">
                        <h1 className="display-3 fw-bold">Which price range are you comfortable with?</h1>
                    </div>
                    <br />
                    <Row className='wine-choice-body'>
                        <Form className='body-choice'>
                            {
                                [
                                    {
                                        'id': 'low',
                                        'label': ['Low', <br />, 'Bodied']
                                    },
                                    {
                                        'id': 'light-medium',
                                        'label': ['Low to Medium', <br />, 'Bodied']
                                    },
                                    {
                                        'id': 'medium',
                                        'label': ['Medium', <br />, 'Bodied']
                                    },
                                    {
                                        'id': 'medium-full',
                                        'label': ['Medium to Full', <br />, 'Bodied']
                                    },
                                    {
                                        'id': 'full',
                                        'label': ['Full', <br />, 'Bodied']
                                    }
                                ].map((btn,idx) => {
                                    return <RadioButton className={'col-sm-12 col-md-12 col-lg-2'} key={idx} id={btn.id} label={btn.label} onClick={() => this.handleUpdateChoice({'body': btn.id})} />
                                })
                            }
                        </Form>
                    </Row>
                    <br />
                    <Row>
                        <Button disabled={this.state['next-page-button-active']} onClick={() => this.handleNextPage('varietals')} variant="secondary" size="md">Next Page {' '}<FaArrowRight size={'2em'} /></Button>
                    </Row>
                </div>
            </div> 
        )
    }
    features() {
        return (
            <div className="position-relative overflow-hidden p-3 p-md-5 m-md-3 text-center bg-body-tertiary">
                <div className="col-md-8 p-lg-5 mx-auto my-5">
                    <div className="d-flex align-items-center justify-content-center">
                        <h1 className="display-3 fw-bold">What sort of features are you looking for?</h1>
                    </div>
                    <br />
                    <Row className='wine-choice-body'>
                        <Form className='body-choice'>
                            {
                                icons.map((icon,idx) => {
                                    return <CheckButton style={{'--button-bg': icon.Color, color: icon.TextColor}} className={'col-sm-12 col-md-12 col-lg-2 choose-your-wine-button'} key={idx} id={icon.Type} label={icon.Type} onClick={() => this.handleUpdateChoice({'features': icon.Type})} />
                                })
                            }
                        </Form>
                    </Row>
                    <br />
                    <Row>
                        <Button disabled={this.state['next-page-button-active']} onClick={() => this.handleNextPage('varietals')} variant="secondary" size="md">Next Page {' '}<FaArrowRight size={'2em'} /></Button>
                    </Row>
                </div>
            </div> 
        )
    }


    pages(pageNumber) {
        let pages = {
            '': this.home(),
            'wine-choice': this.wineChoice(),
            'body-choice': this.bodyChoice(),
            'price-range': this.priceRange(),
            'varietals': this.bodyChoice(),
            'features': <Features {...{handleUpdateChoice: (e) => this.handleUpdateChoice(e), nextPageActive: this.state['next-page-button-active'], handleNextPage: this.handleNextPage} } />,
        }
        return pages[pageNumber] ? pages[pageNumber] : this.home()
    }
    render() {
        return(
            <main>
                {this.pages(this.state && this.state.page)}
            </main>
        )
    }
}

export default index