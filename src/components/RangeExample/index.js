import React, { useState } from 'react';
import { Range } from 'react-range';
import Form from 'react-bootstrap/Form';

function RangeExample({ onChange, min = 0, max = 395, defaultValues = [0, 395] }) {
  const [values, setValues] = useState(defaultValues);

  const handleChange = (newValues) => {
    setValues(newValues);
    onChange?.({ min: newValues[0], max: newValues[1] });
  };

  return (
    <Form.Group>
      <Form.Label>
        Bottle Price Range (${values[0]} - ${values[1]})
      </Form.Label>
      <div className="px-2" style={{ width: '100%' }}>
        <Range
          step={1}
          min={min}
          max={max}
          values={values}
          onChange={handleChange}
          renderTrack={({ props, children }) => {
            // Calculate left and right percentages for the colored track
            const percentLeft = ((values[0] - min) / (max - min)) * 100;
            const percentRight = ((values[1] - min) / (max - min)) * 100;
            return (
              <div
                {...props}
                style={{
                  height: '6px',
                  width: '100%',
                  background: `linear-gradient(to right, #ccc 0%, #ccc ${percentLeft}%, #0d6efd ${percentLeft}%, #0d6efd ${percentRight}%, #ccc ${percentRight}%, #ccc 100%)`,
                  borderRadius: '3px',
                  ...props.style,
                }}
              >
                {children}
              </div>
            );
          }}
          renderThumb={({ props }) => (
            <div
              {...props}
              style={{
                height: '20px',
                width: '20px',
                backgroundColor: '#0d6efd',
                borderRadius: '50%',
                ...props.style,
              }}
            />
          )}
        />
      </div>
    </Form.Group>
  );
}

export default RangeExample;