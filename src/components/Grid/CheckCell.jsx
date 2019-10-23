import React from 'react';
import classnames from 'classnames';

const CheckCell = ({ cell, onChange, onClick }) => {
    let gridClass = cell.subGrid % 2 ? 'even' : 'uneven';
    let cellvalueClass = cell.value != null ? 'cellValueClass' : null;
    let activeClass =
        cell.helperValues !== undefined && cell.helperValues.active
            ? 'active'
            : null;
    let activeSide = cell.helperValues.active
        ? 'side-' + cell.helperValues.activeSide
        : null;
    let startedCell =
        cell.helperValues.startedCell !== null
            ? 'started-' + cell.helperValues.startedCell
            : null;

    return (
        <div
            tabIndex={cell.index}
            key={cell.index}
            onClick={() => onClick(cell)}
            onKeyDown={e => onChange(e, cell)}
            className={classnames(
                activeClass,
                'cell',
                gridClass,
                cellvalueClass
            )}>
            {cell.value !== null && <div>{cell.value}</div>}
            {!cell.value && (
                <div className="cellHelper-wrapper">
                    {['left', 'right'].map((side, index) => {
                        return (
                            <div
                                key={index}
                                className={classnames(
                                    startedCell,
                                    activeSide,
                                    'helper-input',
                                    side
                                )}
                                onClick={e => {
                                    e.stopPropagation();
                                    onClick(cell, side);
                                }}>
                                {' '}
                                {cell.helperValues[side]}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};
export default CheckCell;
