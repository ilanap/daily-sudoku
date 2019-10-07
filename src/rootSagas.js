import { takeEvery, put, select } from 'redux-saga/effects';
import axios from 'axios';

import {
    callTypes,
    actionTypes
} from 'containers/MainPage/MainPageConstants.js';
import { actionTypes as loaderActionTypes } from 'components/Loader/LoaderConstants.js';

export const getQueryParams = state => state.queryParams;

function* loadExternalSudokuData() {
    yield put({
        type: loaderActionTypes.SHOW
    });
    let now = new Date();
    let url = '/sudoku';
    let queryParams = yield select(getQueryParams);
    if (queryParams !== null) {
        url += queryParams + '&';
    } else {
        url += '?';
    }
    let responseData = yield axios.get(
        `${url}type=daily&year=${now.getFullYear()}&month=${now.getMonth() +
            1}&day=${now.getDate()}`
    );
    yield put({
        type: actionTypes.SUDOKU_DATA_LOADED,
        payload: responseData.data
    });
    yield put({
        type: loaderActionTypes.HIDE
    });
}

function* rootSagas() {
    yield takeEvery(callTypes.LOAD_SUDOKU_DATA, loadExternalSudokuData);
}

export default rootSagas;
