import React from 'react';
import { connect } from 'react-redux';
import { callTypes } from './MainPageConstants';
import PropTypes from 'prop-types';

import MainPageView from './MainPage.jsx';

export const getMainPage = state => state && state.mainpage;
export const isLoading = state =>
    state && state.loader && state.loader.isLoading;

function mapDispatchToProps(dispatch) {
    return {
        initSudokuData: () =>
            dispatch({
                type: callTypes.LOAD_SUDOKU_DATA,
                payload: {}
            }),
        onPrevious: () =>
            dispatch({
                type: callTypes.LOAD_SUDOKU_DATA_PREVIOUS,
                payload: {}
            }),
        onNext: () =>
            dispatch({
                type: callTypes.LOAD_SUDOKU_DATA_NEXT,
                payload: {}
            })
    };
}

const mapStateToProps = state => {
    return {
        isLoading: isLoading(state),
        data: getMainPage(state)
    };
};

class MainPage extends React.Component {
    static propTypes = {
        initSudokuData: PropTypes.func,
        data: PropTypes.object
    };

    componentDidMount() {
        this.props.initSudokuData();
    }

    render() {
        return (
            <MainPageView
                data={this.props.data}
                onNext={this.props.onNext}
                isLoading={this.props.isLoading}
                onPrevious={this.props.onPrevious}
            />
        );
    }
}
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(MainPage);
