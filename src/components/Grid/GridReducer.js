import { actionTypes } from 'containers/MainPage/MainPageConstants.js';
import {
    GRID_SIZE,
    actionTypes as gridActionTypes
} from 'components/Grid/GridConstants';

const subGridSize = Math.sqrt(GRID_SIZE);

export default (
    state = {
        origData: null,
        history: new Array(),
        cells: new Array(GRID_SIZE * GRID_SIZE)
    },
    action
) => {
    switch (action.type) {
        case actionTypes.SUDOKU_DATA_LOADED:
            return {
                origData: action.payload.numbers,
                cells: parseOrigDataToCells(
                    action.payload.numbers,
                    state.cells
                ),
                ...state
            };
        case gridActionTypes.CELL_CHANGED: {
            let val = +action.payload.newValue;
            if (isNaN(val) && val !== '') {
                console.log('invalid string');
                val = '';
            }
            if (val > 9) {
                val = val % 10;
            }
            if (Number.parseInt(val) === 0) {
                console.log('zero');
                val = '';
            }
            let cell = state.cells[action.payload.cell.index];
            let { row, index, value } = cell;
            let cells = state.cells.map((item, index) => {
                if (index !== action.payload.cell.index) {
                    return item;
                }
                return {
                    ...item,
                    value: val,
                    error: checkValue(state.cells, cell, val)
                };
            });
            return {
                ...state,
                cells: cells,
                history: [{ value, row, index }, ...state.history]
            };
        }
        default:
            return state;
    }
};

function parseOrigDataToCells(numbers, data) {
    let strArr = [...numbers];

    for (let i = 0; i < strArr.length; i++) {
        let cellData = { index: i, error: false };
        if (strArr[i] !== '.') {
            cellData.value = +strArr[i];
            cellData.given = true;
        } else {
            cellData.value = '';
        }
        cellData.row = Math.floor(i / GRID_SIZE);
        cellData.column = i % GRID_SIZE;

        let subGridForRow = Math.floor(cellData.row / subGridSize);
        let subGridForCol = Math.floor(cellData.column / subGridSize);
        cellData.subGrid = subGridForRow * subGridSize + subGridForCol;
        data[i] = cellData;
    }
}

function checkValue(grid, cell, newVal) {
    if (newVal === '') return false;
    let error = grid.find(
        c =>
            c.index !== cell.index &&
            (c.row === cell.row ||
                c.column === cell.column ||
                c.subGrid === cell.subGrid) &&
            c.value === newVal
    );
    return error != null;
}
