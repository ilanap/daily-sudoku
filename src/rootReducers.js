import { combineReducers } from 'redux';

import loaderReducer from 'components/Loader/LoaderReducer.js';
import mainpageReducer from './containers/MainPage/MainPageReducer.js';
import gridReducer from 'components/Grid/GridReducer.js';

const queryParamsReducer = (state = location.search) => {
    return state;
};

export default combineReducers({
    loader: loaderReducer,
    mainpage: mainpageReducer,
    grid: gridReducer,
    queryParams: queryParamsReducer
});
