import React from 'react';
import Button from 'components/Button.jsx';
import { GRID_SIZE } from './GridConstants.js';
import classnames from 'classnames';

const NumberHelper = ({ onClick, cellValue, className, title }) => {
    let numbers = Array.from(Array(GRID_SIZE).keys());
    return (
        <div className="helper">
            <label className="label">{title}:</label>
            {numbers.map((n, i) => {
                let activeClass = cellValue === i + 1 ? 'active' : null;
                return (
                    <Button
                        onClick={onClick}
                        value={i + 1}
                        classNames={classnames(
                            'number',
                            className,
                            activeClass
                        )}
                        key={i}
                        name={i + 1}
                    />
                );
            })}
            <Button
                onClick={onClick}
                value={null}
                classNames={classnames('number off ')}
                key="off"
                name="Off"
            />
        </div>
    );
};

export default NumberHelper;
