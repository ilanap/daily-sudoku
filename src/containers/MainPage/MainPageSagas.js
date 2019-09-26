import { takeEvery, put } from 'redux-saga/effects';
import axios from 'axios';

import { callTypes, actionTypes } from './MainPageConstants.js';
import { actionTypes as loaderActionTypes } from 'components/Loader/LoaderConstants.js';

function* loadExternalSudokuData() {
    yield put({
        type: loaderActionTypes.SHOW
    });
    let now = new Date();
    let responseData = yield axios.get(
        `/sudoku?type=daily&year=${now.getFullYear()}&month=${now.getMonth() +
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

function* mainpageSagas() {
    yield takeEvery(callTypes.LOAD_SUDOKU_DATA, loadExternalSudokuData);
}

export default mainpageSagas;
