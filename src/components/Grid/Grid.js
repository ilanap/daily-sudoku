import React from 'react';
import GridView from './Grid.jsx';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { actionTypes } from './GridConstants.js';

const getCells = state => state && state.grid && state.grid.cells;

const mapStateToProps = state => {
    return {
        cells: getCells(state)
    };
};

function mapDispatchToProps(dispatch) {
    return {
        onChange: (e, cell) =>
            dispatch({
                type: actionTypes.CELL_CHANGED,
                payload: { newValue: e, cell: cell }
            })
    };
}

class Grid extends React.Component {
    static propTypes = {
        cells: PropTypes.array,
        onChange: PropTypes.func
    };

    render() {
        let { cells, onChange } = this.props;
        return <GridView onChange={onChange} cells={cells} />;
    }
}
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Grid);
