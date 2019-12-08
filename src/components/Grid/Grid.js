import React from 'react';
import GridView from './Grid.jsx';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { actionTypes } from './GridConstants.js';
import { callTypes } from 'containers/MainPage/MainPageConstants';

// selectors
export const getCells = state => state && state.grid && state.grid.cells;
export const getStrategy = state => state && state.grid && state.grid.strategy;
const isSweep = state => state && state.grid && state.grid.isSweep;
const isSolved = state => state && state.grid && state.grid.solved;
const getFindCellValue = state =>
    state && state.grid && state.grid.showFoundValue;
const getSweepCellValue = state =>
    state && state.grid && state.grid.showSweepValue;

const mapStateToProps = state => {
    return {
        cells: getCells(state),
        isSweep: isSweep(state),
        solved: isSolved(state),
        strategy: getStrategy(state),
        findCellValue: getFindCellValue(state),
        findSweepValue: getSweepCellValue(state)
    };
};

function mapDispatchToProps(dispatch) {
    return {
        onChange: (e, cell) =>
            dispatch({
                type: actionTypes.CELL_CHANGED,
                payload: { keyCode: e.which, isShift: e.shiftKey, cell: cell }
            }),
        onClick: cell =>
            dispatch({
                type: actionTypes.CELL_CLICKED,
                payload: { cell: cell }
            }),
        onHelperClick: (cell, side) =>
            dispatch({
                type: actionTypes.HELPER_CELL_CLICKED,
                payload: { cell: cell, side: side }
            }),
        onHelperChange: (e, cell) => {
            dispatch({
                type: actionTypes.HELPER_CELL_CHANGED,
                payload: {
                    keyCode: e.which,
                    isShift: e.shiftKey,
                    cell: cell
                }
            });
        },
        onUndo: () =>
            dispatch({
                type: actionTypes.UNDO
            }),
        onPrint: () => {
            window.print();
        },
        onReset: () =>
            dispatch({
                type: actionTypes.RESET
            }),
        onSweep: () =>
            dispatch({
                type: actionTypes.SWEEP
            }),
        fireworks: () =>
            dispatch({
                type: actionTypes.FIREWORKS
            }),
        onShowFoundCells: value =>
            dispatch({
                type: actionTypes.SHOW_FOUND,
                payload: value
            }),
        onShowSweepCells: value =>
            dispatch({
                type: actionTypes.SHOW_SWEEP,
                payload: value
            }),
        solveStrategy: () => {
            dispatch({
                type: callTypes.SOLVE_CURRENT_STRATEGY
            });
        },
        clickStrategy: evt => {
            dispatch({
                type: evt.target.value
            });
        }
    };
}

class Grid extends React.Component {
    static propTypes = {
        cells: PropTypes.array,
        onChange: PropTypes.func,
        onUndo: PropTypes.func,
        onReset: PropTypes.func,
        onSweep: PropTypes.func,
        fireworks: PropTypes.func,
        onClick: PropTypes.func,
        onPrint: PropTypes.func,
        onHelperClick: PropTypes.func,
        onHelperChange: PropTypes.func,
        onShowFoundCells: PropTypes.func,
        onShowSweepCells: PropTypes.func,
        clickStrategy: PropTypes.func,
        solved: PropTypes.bool,
        isSweep: PropTypes.bool,
        findCellValue: PropTypes.number,
        findSweepValue: PropTypes.number,
        strategy: PropTypes.string,
        solveStrategy: PropTypes.func
    };

    render() {
        let {
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
            strategy,
            solveStrategy
        } = this.props;
        return (
            <div>
                <GridView
                    onChange={onChange}
                    onClick={onClick}
                    onHelperClick={onHelperClick}
                    onHelperChange={onHelperChange}
                    onUndo={onUndo}
                    onPrint={onPrint}
                    onReset={onReset}
                    onSweep={onSweep}
                    isSweep={isSweep}
                    solved={solved}
                    fireworks={fireworks}
                    cells={cells}
                    onShowFoundCells={onShowFoundCells}
                    onShowSweepCells={onShowSweepCells}
                    findCellValue={findCellValue}
                    findSweepValue={findSweepValue}
                    clickStrategy={clickStrategy}
                    solveStrategy={solveStrategy}
                    strategy={strategy}
                />
            </div>
        );
    }
}
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Grid);
