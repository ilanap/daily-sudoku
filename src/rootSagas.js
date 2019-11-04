import { takeEvery, put, select } from 'redux-saga/effects';
import axios from 'axios';

import {
    callTypes,
    actionTypes
} from 'containers/MainPage/MainPageConstants.js';
import { actionTypes as loaderActionTypes } from 'components/Loader/LoaderConstants.js';
import { getMainPage } from 'containers/MainPage/MainPage';

export const getQueryParams = state => state.queryParams;

function* loadExternalSudokuData(payload) {
    yield put({
        type: loaderActionTypes.SHOW
    });
    let date = null;
    if (payload === null) {
        date = new Date();
    } else {
        let current = yield select(getMainPage);
        let day = current.date.day;
        if (payload.next) {
            day = day + 1;
        } else {
            day = day - 1;
        }
        date = new Date(current.date.year, current.date.month, day);
    }
    let url = '/sudoku';
    let queryParams = yield select(getQueryParams);
    if (queryParams !== null && queryParams !== '') {
        url += queryParams + '&';
    } else {
        url += '?';
    }
    let responseData = yield axios.get(
        `${url}type=daily&year=${date.getFullYear()}&month=${date.getMonth() +
            1}&day=${date.getDate()}`
    );
    yield put({
        type: actionTypes.SUDOKU_DATA_LOADED,
        payload: { date: date, ...responseData.data }
    });
    yield put({
        type: loaderActionTypes.HIDE
    });
}

function* rootSagas() {
    yield takeEvery(callTypes.LOAD_SUDOKU_DATA, loadExternalSudokuData, null);
    yield takeEvery(
        callTypes.LOAD_SUDOKU_DATA_PREVIOUS,
        loadExternalSudokuData,
        { prev: true }
    );
    yield takeEvery(callTypes.LOAD_SUDOKU_DATA_NEXT, loadExternalSudokuData, {
        next: true
    });
}

export default rootSagas;
