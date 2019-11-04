import React from 'react';
import Cell from './Cell.jsx';
import CheckCell from './CheckCell.jsx';
import Button from 'components/Button.jsx';
import NumberHelper from 'components/Grid/NumberHelper';
import Strategies from './Strategies.jsx';
import { strategyTypes } from 'components/Grid/GridConstants';

const Grid = ({
    cells,
    onChange,
    onUndo,
    onReset,
    isSweep,
    onSweep,
    onClick,
    onPrint,
    onHelperClick,
    onHelperChange,
    fireworks,
    onShowFoundCells,
    onShowSweepCells,
    findCellValue,
    findSweepValue,
    solved,
    clickStrategy,
    strategy
}) => {
    return (
        <div>
            <div className="grid">
                <div className="print-wrapper">
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
            </div>
            <div className="grid noPrint">
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
                        title="Found Numbers"
                    />
                    <NumberHelper
                        onClick={onShowSweepCells}
                        cellValue={findSweepValue}
                        className="sweepNumber"
                        title="Swept Numbers"
                    />
                    <Strategies clickStrategy={clickStrategy} />
                </div>
                <br />
                <span>Use the SHIFT key to enter/remove possible values</span>
                <br />
                <div className="grids-wrapper">
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
                    <div className="checkgrid">
                        {strategy === strategyTypes.HELPER_GRID && (
                            <div className="wrapper reversed">
                                {cells.map((cell, i) => {
                                    return (
                                        <CheckCell
                                            key={i}
                                            cell={cell}
                                            onClick={onHelperClick}
                                            onChange={onHelperChange}
                                        />
                                    );
                                })}
                            </div>
                        )}
                    </div>
                    <div>
                        <div className="buttons">
                            <div className="buttons-left">
                                <Button name="Undo" onClick={onUndo} />
                                <Button name="Reset" onClick={onReset} />
                                <Button
                                    name={isSweep ? 'UnSweep' : 'Sweep'}
                                    onClick={onSweep}
                                />
                            </div>
                            <div className="buttons-right">
                                <Button name="Print" onClick={onPrint} />
                            </div>
                        </div>
                        <br />
                        <Button
                            name="Give me undeserved Fireworks"
                            classNames="fireworks"
                            onClick={fireworks}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Grid;
