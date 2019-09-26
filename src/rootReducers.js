import { combineReducers } from 'redux';

import loaderReducer from 'components/Loader/LoaderReducer.js';
import mainpageReducer from './containers/MainPage/MainPageReducer.js';
import gridReducer from 'components/Grid/GridReducer.js';

export default combineReducers({
    loader: loaderReducer,
    mainpage: mainpageReducer,
    grid: gridReducer
});
