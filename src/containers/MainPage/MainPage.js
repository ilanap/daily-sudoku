import React from 'react';
import { connect } from 'react-redux';
import { callTypes } from './MainPageConstants';
import PropTypes from 'prop-types';

import MainPageView from './MainPage.jsx';

const getMainPage = state => state && state.mainpage;

function mapDispatchToProps(dispatch) {
    return {
        initSudokuData: () =>
            dispatch({
                type: callTypes.LOAD_SUDOKU_DATA,
                payload: {}
            })
    };
}

const mapStateToProps = state => {
    return {
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
        return <MainPageView data={this.props.data} />;
    }
}
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(MainPage);
