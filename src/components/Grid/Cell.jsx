import React from 'react';
import classnames from 'classnames';


const Cell = ({ cell, onChange, isOptionalValues, onClick }) => {
    let gridClass = cell.subGrid % 2 ? 'even' : 'uneven';
    let errorClass = cell.error ? 'error' : null;
    let optionValuesClass =
        cell.value === null && isOptionalValues ? 'optionalValues' : null;
    let cellvalueClass = cell.value != null ? 'cellValueClass' : null;
    let activeClass = cell.active ? 'active' : null;
    return (
        <div
            tabIndex={cell.index}
            key={cell.index}
            onClick={cell.given ? null : () => onClick(cell)}
            onKeyDown={cell.given ? null : (e) => onChange(e, cell)}
            className={classnames(
                activeClass,
                errorClass,
                'cell',
                gridClass,
                cellvalueClass,
                optionValuesClass
            )}>
            {cell.value !== null && <div>{cell.value}</div>}
            {!cell.value && isOptionalValues && (
                <div className="cellOptionalValues-wrapper">
                    {cell.allowedValues.map((val, i) => (
                        <div key={i} className="cellOptionalValues-cell">
                            {val}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
export default Cell;