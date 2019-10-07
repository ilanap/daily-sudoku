import React from 'react';
import Cell from './Cell.jsx';
import Button from 'components/Button.jsx';
import NumberHelper from 'components/Grid/NumberHelper';
import Strategies from './Strategies.jsx';

const Grid = ({
    cells,
    onChange,
    onUndo,
    onReset,
    isSweep,
    onSweep,
    onClick,
    fireworks,
    onShowFoundCells,
    onShowSweepCells,
    findCellValue,
    findSweepValue,
    solved,
    clickStrategy
}) => {
    return (
        <div className="grid">
            {solved && (
                <div className="pyro">
                    <div className="before" />
                    <div className="after" />
                </div>
            )}
            <br />
            <div className="helpers">
                <NumberHelper
                    onClick={onShowFoundCells}
                    cellValue={findCellValue}
                    className="foundNumber"
                    title="Search Found Numbers"
                />
                <NumberHelper
                    onClick={onShowSweepCells}
                    cellValue={findSweepValue}
                    className="sweepNumber"
                    title="Search Swept Numbers"
                />
                <Strategies clickStrategy={clickStrategy} />
            </div>
            <br />
            Use the SHIFT key to enter/remove possible values
            <br />
            <div className="wrapper">
                {cells.map((cell, i) => {
                    return (
                        <Cell
                            key={i}
                            cell={cell}
                            onClick={onClick}
                            isSweep={isSweep}
                            onChange={onChange}
                            findCellValue={findCellValue}
                            findSweepValue={findSweepValue}
                        />
                    );
                })}
            </div>
            <Button name="Undo" onClick={onUndo} />
            <Button name="Reset" onClick={onReset} />
            <Button name={isSweep ? 'UnSweep' : 'Sweep'} onClick={onSweep} />
            <br />
            <Button
                name="Give me undeserved Fireworks"
                classNames="fireworks"
                onClick={fireworks}
            />
        </div>
    );
};

export default Grid;
