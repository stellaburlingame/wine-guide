import React from 'react';
import { Form } from 'react-bootstrap';
import RangeExample from '../../../components/RangeExample';

// BoldnessFilter Component
export function BoldnessFilter(props) {
    const { boldness, showBoldnessFilter, updateFilters } = props;
    
    return(
    <Form.Group className="col-md-6 col-sm-12 fw-bold mb-3">
        <Form.Label>Filter by Boldness</Form.Label>
        <Form.Check
            type="switch"
            id="boldness-switch"
            label="Enable Boldness Filter"
            checked={showBoldnessFilter}
            onChange={(e) => updateFilters({ showBoldnessFilter: e.target.checked })}
        />
        {showBoldnessFilter && (
            <>
            <Form.Range
                min={0}
                max={1}
                step={0.25}
                value={boldness ?? 0}
                onChange={(e) => updateFilters({ boldness: parseFloat(e.target.value) })}
            />
            <div>
                {boldness === 0 && "Low Bodied"}
                {boldness === 0.25 && "Low to Medium Bodied"}
                {boldness === 0.5 && "Medium Bodied"}
                {boldness === 0.75 && "Medium to Full Bodied"}
                {boldness === 1 && "Full Bodied"}
            </div>
            </>
        )}
    </Form.Group>
    )
}
// 
export function DescriptionFilter(props) {
    <Form.Group className="col-md-6 col-sm-12 fw-bold mb-3">
        <Form.Label>Filter by Description</Form.Label>
        <div>
            {Array.from(
            new Set(
                (this.state.specs.flatMap(wine => wine['Top Icons'] || [])
                ).concat(
                    this.state.selectedIcon.filter(
                    icon => !(this.state.specs.flatMap(w => w['Top Icons'] || []).includes(icon))
                    )
                )
            )
            ).map((icon, idx) => (
            <Form.Check
                key={idx}
                type="checkbox"
                label={icon}
                value={icon}
                checked={this.state.selectedIcon.includes(icon)}
                inline={true}
                onChange={(e) => {
                const { checked, value } = e.target;
                this.setState(prevState => {
                    const icons = new Set(prevState.selectedIcon);
                    checked ? icons.add(value) : icons.delete(value);
                    return { selectedIcon: [...icons] };
                });
                }}
                // disabled={!getAvailableFilters(filteredData).icons.includes(icon) && !this.state.selectedIcon.includes(icon)}
            />
            ))}
        </div>
    </Form.Group>
}
export function PriceFilters(props) {
    const { priceType, handleFilterChange, priceRange } = props

    let min = 0;
    let max = 0;
    if (priceType === "bottle") {
        min = priceRange.bottle.min ?? 0;
        max = priceRange.bottle.max ?? 500;
    } else if (priceType === "glass") {
        min = priceRange.glass.min ?? 0;
        max = priceRange.glass.max ?? 100;
    }
    return(
        <>
            <Form.Group className="col-md-6 col-sm-12 fw-bold mb-3">
                <Form.Label>Filter by Price Type</Form.Label>
                <div>
                    {[
                    { value: "", label: "All" },
                    { value: "glass", label: "Glass Only" },
                    { value: "bottle", label: "Bottle Only" }
                    ].map((option) => (
                    <Form.Check
                        key={option.value}
                        type="radio"
                        label={option.label}
                        name="priceType"
                        value={option.value}
                        checked={priceType === option.value}
                        onChange={(e) => handleFilterChange({ priceType: e.target.value, priceRange: { bottle: { min: 0, max: 0 }, glass: { min: 0, max: 0 } } }) }
                    />
                    ))}
                </div>
            </Form.Group>
            {priceType === "bottle" && (
                <Form.Group className="col-md-6 col-sm-12 fw-bold mb-3">
                    <RangeExample
                        min={min}
                        max={max}
                        defaultValues={[min, max]}
                        type="Bottle"
                        onChange={({ min, max }) => {
                            const minVal = typeof min === 'string' ? parseFloat(min) : min;
                            const maxVal = typeof max === 'string' ? parseFloat(max) : max;
                            handleFilterChange({
                                priceRange: {
                                    bottle: {
                                        min: minVal,
                                        max: maxVal
                                    },
                                    glass: {
                                        min: 0,
                                        max: 0
                                    }
                                }
                            })
                        }}
                    />
                </Form.Group>
            )}
            {priceType === "glass" && (
                <Form.Group className="col-md-6 col-sm-12 fw-bold mb-3">
                    <RangeExample
                        min={min}
                        max={max}
                        defaultValues={[min, max]}
                        type="Glass"
                        onChange={({ min, max }) => {
                            const minVal = typeof min === 'string' ? parseFloat(min) : min;
                            const maxVal = typeof max === 'string' ? parseFloat(max) : max;
                            handleFilterChange({
                                priceRange: {
                                    glass: {
                                        min: minVal,
                                        max: maxVal
                                    },
                                    bottle: {
                                        min: 0,
                                        max: 0 
                                    }
                                }
                            })
                        }}
                    />
                </Form.Group>
            )}
        </>
    )
}