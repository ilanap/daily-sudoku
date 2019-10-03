import React from 'react';
import GridView from './Grid.jsx';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { actionTypes } from './GridConstants.js';

const getCells = state => state && state.grid && state.grid.cells;
const isSweep = state => state && state.grid && state.grid.isSweep;
const isSolved = state => state && state.grid && state.grid.solved;
const mapStateToProps = state => {
    return {
        cells: getCells(state),
        isSweep: isSweep(state),
        solved: isSolved(state)
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
            })
    };
}

class Grid extends React.Component {
    static propTypes = {
        cells: PropTypes.array,
        onChange: PropTypes.func,
        onUndo: PropTypes.func,
        onReset: PropTypes.func,
        onSweep: PropTypes.func,
        onClick: PropTypes.func,
        solved: PropTypes.bool,
        isSweep: PropTypes.bool
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
            solved
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
                cells={cells}
            />
        );
    }
}
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Grid);
