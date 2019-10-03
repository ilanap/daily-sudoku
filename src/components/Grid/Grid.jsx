import React from 'react';
import Cell from './Cell.jsx';
import Button from 'components/Button.jsx';

const Grid = ({
    cells,
    onChange,
    onUndo,
    onReset,
    isSweep,
    onSweep,
    onClick,
    solved
}) => {
    return (
        <div className="grid">
            {solved && (
                <div className="pyro">
                    <div className="before" />
                    <div className="after" />
                </div>
            )}
            <div className="wrapper">
                {cells.map((cell, i) => {
                    return (
                        <Cell
                            key={i}
                            cell={cell}
                            onClick={onClick}
                            isSweep={isSweep}
                            onChange={onChange}
                        />
                    );
                })}
            </div>
            <Button name="Undo" onClick={onUndo} />
            <Button name="Reset" onClick={onReset} />
            <Button name={isSweep ? 'UnSweep' : 'Sweep'} onClick={onSweep} />
        </div>
    );
};

export default Grid;
