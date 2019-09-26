import React, { Component } from 'react';
import { hot } from 'react-hot-loader';
import { connect } from 'react-redux';
import './style.scss';

import MainPage from './containers/MainPage/MainPage.js';

class App extends Component {
    render() {
        return (
            <div>
                <MainPage />
            </div>
        );
    }
}

const mapStateToProps = function(state) {
    return state;
};
export default hot(module)(connect(mapStateToProps)(App));
