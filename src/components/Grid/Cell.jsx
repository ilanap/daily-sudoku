import React from 'react';
import classnames from 'classnames';

const Cell = ({
    cell,
    onChange,
    isSweep,
    onClick,
    findCellValue,
    findSweepValue
}) => {
    let gridClass = cell.subGrid % 2 ? 'even' : 'uneven';
    let errorClass = cell.error ? 'error' : null;
    let foundCellClass =
        !cell.error && cell.value !== null && cell.value === findCellValue
            ? 'foundValue'
            : null;
    let sweepCellClass =
        !cell.error &&
        cell.value === null &&
        cell.sweepValues.includes(findSweepValue)
            ? 'sweepValue'
            : null;
    let optionValuesClass =
        cell.value === null && isSweep ? 'optionalValues' : null;
    let cellvalueClass = cell.value != null ? 'cellValueClass' : null;
    let activeClass = cell.active ? 'active' : null;
    let strategyClass = cell.strategy ? 'strategy' : null;
    return (
        <div
            tabIndex={cell.index}
            key={cell.index}
            onClick={cell.given ? null : () => onClick(cell)}
            onKeyDown={cell.given ? null : e => onChange(e, cell)}
            className={classnames(
                activeClass,
                strategyClass,
                foundCellClass,
                sweepCellClass,
                errorClass,
                'cell',
                gridClass,
                cellvalueClass,
                optionValuesClass
            )}>
            {cell.value !== null && <div>{cell.value}</div>}
            {!cell.value && cell.sweepValues.length > 0 && (
                <div className="cellOptionalValues-wrapper">
                    {cell.sweepValues.map((val, i) => (
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
