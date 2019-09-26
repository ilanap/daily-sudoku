import React from 'react';
import classnames from 'classnames';
import Grid from 'components/Grid/Grid';

const Cell = ({ cell, onChange }) => {
    let gridClass = cell.subGrid % 2 ? 'even' : 'uneven';
    let errorClass = cell.error ? 'error' : '';
    return (
        <div
            key={cell.index}
            className={classnames(errorClass, 'cell', gridClass)}>
            {!cell.given && (
                <input
                    type="text"
                    className="valueEditor"
                    value={cell.value}
                    onChange={e => onChange(e.target.value, cell)}
                />
            )}
            {cell.given && <div className="cellValue">{cell.value}</div>}
        </div>
    );
};
export default Cell;
