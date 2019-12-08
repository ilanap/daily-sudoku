import { takeEvery, put, select } from 'redux-saga/effects';
import axios from 'axios';

import {
    callTypes,
    actionTypes
} from 'containers/MainPage/MainPageConstants.js';
import { actionTypes as loaderActionTypes } from 'components/Loader/LoaderConstants.js';
import { getMainPage } from 'containers/MainPage/MainPage';
import { getStrategy, getCells } from 'components/Grid/Grid';
import {
    actionTypes as gridCallTypes,
    strategyTypes
} from 'components/Grid/GridConstants';
import { getKeyCodeForNumber } from 'components/Grid/GridHelper';

export const getQueryParams = state => state.queryParams;

function* solveStrategy() {
    let cells = yield select(getCells);
    let strategy = yield select(getStrategy);
    let firstCell = cells.find(
        cell => cell.strategy && cell.solveValue !== null
    );
    console.log(firstCell);
    while (firstCell !== undefined) {
        yield put({
            type: gridCallTypes.CELL_CHANGED,
            payload: {
                keyCode: getKeyCodeForNumber(firstCell.solveValue),
                isShift: false,
                cell: firstCell
            }
        });
        let cells = yield select(getCells);
        firstCell = cells.find(
            cell => cell.strategy && cell.solveValue !== null
        );
        console.log(firstCell);
    }
    if (strategy !== strategyTypes.NONE) {
        for (let i = 0; i < cells.length; i++) {
            if (cells[i].strategy && cells[i].solveValue) {
                yield put({
                    type: gridCallTypes.CELL_CHANGED,
                    payload: {
                        keyCode: getKeyCodeForNumber(cells[i].solveValue),
                        isShift: false,
                        cell: cells[i]
                    }
                });
            }
        }
    }
}

function* loadExternalSudokuData(payload) {
    yield put({
        type: loaderActionTypes.SHOW
    });
    let date = null;
    let today = new Date();
    if (payload === null) {
        date = today;
    } else {
        let current = yield select(getMainPage);
        let day = current.date.day;
        if (payload.next) {
            day = day + 1;
        } else {
            day = day - 1;
        }
        let tomorrow = new Date(
            today.getFullYear(),
            today.getMonth(),
            today.getDate() + 1
        );
        date = new Date(current.date.year, current.date.month, day);
        if (date.getTime() >= tomorrow.getTime()) {
            console.warn('No puzzle data for future...');
            date = today;
        }
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
    yield takeEvery(callTypes.SOLVE_CURRENT_STRATEGY, solveStrategy);
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
