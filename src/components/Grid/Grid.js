import React from 'react';
import GridView from './Grid.jsx';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { actionTypes } from './GridConstants.js';

const getCells = state => state && state.grid && state.grid.cells;
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
        onUndo: () =>
            dispatch({
                type: actionTypes.UNDO
            }),
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
        onShowFoundCells: PropTypes.func,
        onShowSweepCells: PropTypes.func,
        clickStrategy: PropTypes.func,
        solved: PropTypes.bool,
        isSweep: PropTypes.bool,
        findCellValue: PropTypes.number,
        findSweepValue: PropTypes.number
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
            fireworks,
            onShowFoundCells,
            onShowSweepCells,
            findCellValue,
            findSweepValue,
            solved,
            clickStrategy
        } = this.props;
        return (
            <GridView
                onChange={onChange}
                onClick={onClick}
                onUndo={onUndo}
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
            />
        );
    }
}
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Grid);
