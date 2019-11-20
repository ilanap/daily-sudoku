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
    return (
        <div
            tabIndex={cell.index}
            key={cell.index}
            onClick={cell.given ? null : () => onClick(cell)}
            onKeyDown={cell.given ? null : e => onChange(e, cell)}
            className={classnames(
                cell.given ? 'given' : null,
                cell.active ? 'active' : null,
                cell.strategy ? 'strategy' : null,
                foundCellClass,
                sweepCellClass,
                cell.error ? 'error' : null,
                'cell',
                cell.subGrid % 2 ? 'even' : 'uneven',
                cell.value != null ? 'cellValueClass' : null,
                cell.value === null && isSweep ? 'optionalValues' : null
            )}>
            {cell.value !== null && <div>{cell.value}</div>}
            {!cell.value &&
                cell.sweepValues !== undefined &&
                cell.sweepValues.length > 0 && (
                    <div className="cellOptionalValues-wrapper">
                        {isSweep &&
                            cell.sweepValues.map((val, i) => (
                                <div
                                    key={i}
                                    className="cellOptionalValues-cell">
                                    {val}
                                </div>
                            ))}
                    </div>
                )}
        </div>
    );
};
export default Cell;
