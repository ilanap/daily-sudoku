import React from 'react';
import Cell from './Cell.jsx';
import Button from 'components/Button.jsx';

const Grid = ({
    cells,
    onChange,
    onUndo,
    onReset,
    isOptionalValues,
    onSweep,
    onClick
}) => {
    return (
        <div className="grid">
            <div className="wrapper">
                {cells.map((cell, i) => {
                    return (
                        <Cell
                            key={i}
                            cell={cell}
                            onClick={onClick}
                            isOptionalValues={isOptionalValues}
                            onChange={onChange}
                        />
                    );
                })}
            </div>
            <Button name="Undo" onClick={onUndo} />
            <Button name="Reset" onClick={onReset} />
            <Button name="Sweep" onClick={onSweep} />
        </div>
    );
};

export default Grid;
