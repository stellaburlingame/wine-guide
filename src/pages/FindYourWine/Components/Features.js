import './Features.css'

import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Row, Form, Button } from 'react-bootstrap'
import icons from '../../../components/Icons/icons.json'
import { FaArrowRight } from "react-icons/fa";
import CheckButton from '../../../components/CheckButton'
import { defineHex, Grid, rectangle } from 'honeycomb-grid'

export function Features(props) {
    const { handleUpdateChoice, nextPageActive, handleNextPage } = props;
    const [cols, setCols] = useState(() => {
        const w = typeof window !== 'undefined' ? window.innerWidth : 1200;
        if (w < 576) return 3; // xs
        if (w < 768) return 4; // sm
        return 5; // md+
    });
    const [selected, setSelected] = useState([]);
    const handleMultipleChoiceSelection = ((choice) => {
        setSelected(prev =>
            prev.includes(choice.features)
            ? prev.filter(c => c !== choice.features)
            : [...prev, choice.features]);
        handleUpdateChoice(selected)
    })
    // Container ref and dynamic shift for honeycomb offset
    const wrapRef = useRef(null);
    const [shift, setShift] = useState(18);
    // 1. Create a hex class:
    const Tile = defineHex({ dimensions: 30 })

    // 2. Build a grid sized to our responsive columns and total icon count
    const total = icons.length;
    const gridWidth = cols; // responsive columns
    const gridHeight = Math.ceil(total / gridWidth);

    // Memoize the rectangular grid and take only as many cells as we need
    const cells = useMemo(() => {
      const g = new Grid(Tile, rectangle({ width: gridWidth, height: gridHeight }));
      return Array.from(g).slice(0, total);
    }, [Tile, gridWidth, gridHeight, total]);

    // 3. For debugging, you can inspect the generated cells
    // console.log(cells)
    // Responsive columns per row

    useEffect(() => {
      function computeShift() {
        const wrap = wrapRef.current;
        if (!wrap) return;
        const first = wrap.querySelector('.choose-your-wine-button');
        if (first) {
          // half the element width approximates the needed horizontal offset
          const s = Math.round(first.offsetWidth / 2);
          setShift(s > 0 ? s : 18);
        }
      }
      computeShift();
      window.addEventListener('resize', computeShift);
      return () => window.removeEventListener('resize', computeShift);
    }, [cols]);


    useEffect(() => {
        function onResize() {
            const w = window.innerWidth;
            if (w < 576) setCols(3);
            else if (w < 768) setCols(4);
            else setCols(5);
        }
        window.addEventListener('resize', onResize);
        return () => window.removeEventListener('resize', onResize);
    }, []);


    return (
        <div className="position-relative overflow-hidden p-3 p-md-5 m-md-3 text-center bg-body-tertiary">
            <div className="col-md-12 p-lg-5 mx-auto my-5">
                <div className="d-flex align-items-center justify-content-center">
                    <h1 className="display-3 fw-bold">What sort of features are you looking for?</h1>
                </div>
                <br />
                <Row className='wine-choice-body'>
                  <Form className='body-choice'>
                    <div className='hex-wrap' ref={wrapRef}>
                      {(() => {
                        const rows = [];
                        let currentRow = [];
                        let currentR = cells.length ? cells[0].r : 0;
                        cells.forEach((hex, idx) => {
                          const icon = icons[idx];
                          if (!icon) return;
                          if (hex.r !== currentR) {
                            // push previous row with alternating shift
                            rows.push(
                                <Row
                                key={`row-${currentR}`}
                                className={`justify-content-center ${currentR % 2 === 0 ? 'row-shift-left' : 'row-shift-right'}`}
                                style={{ '--shift': `${shift}px` }}
                                >
                                {currentRow}
                              </Row>
                            );
                            currentRow = [];
                            currentR = hex.r;
                          }
                          currentRow.push(
                            <CheckButton
                              key={idx}
                              style={{ '--button-bg': icon.Color, color: icon.TextColor}}
                              className={'col-sm-12 col-md-12 col-lg-2 choose-your-wine-button'}
                              id={icon.Type}
                              label={`${icon.Icon} ${icon.Type}`}
                              onClick={(e) => {handleMultipleChoiceSelection({ 'features': icon.Type })}}
                            >
                                <span className='choose-your-wine-button-icon'>{icon.Icon}</span>
                                <span className='choose-your-wine-button-text'>{icon.Type}</span>
                            </CheckButton>
                          );
                        });
                        if (currentRow.length > 0) {
                          rows.push(
                            <Row
                              key={`row-${currentR}`}
                              className={`justify-content-center ${currentR % 2 === 0 ? 'row-shift-left' : 'row-shift-right'}`}
                              style={{ '--shift': `${shift}px` }}
                            >
                              {currentRow}
                            </Row>
                          );
                        }
                        return rows;
                      })()}
                    </div>
                  </Form>
                </Row>
                <br />
                <Row>
                    <Button disabled={nextPageActive} onClick={() => handleNextPage('varietals')} variant="secondary" size="md">Next Page {' '}<FaArrowRight size={'2em'} /></Button>
                </Row>
            </div>
        </div>
    )
}