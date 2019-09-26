import { actionTypes } from 'containers/MainPage/MainPageConstants.js';
import {
    GRID_SIZE,
    actionTypes as gridActionTypes
} from 'components/Grid/GridConstants';

const subGridSize = Math.sqrt(GRID_SIZE);
const checkFields = ['column', 'row', 'subGrid'];

export default (
    state = {
        origData: null,
        withOptionalValues: false,
        history: new Array(),
        cells: new Array(GRID_SIZE * GRID_SIZE)
    },
    action
) => {
    switch (action.type) {
        case actionTypes.SUDOKU_DATA_LOADED: {
            let data = [...action.payload.numbers];
            let cells = parseOrigDataToCells(data);
            return {
                ...state,
                origData: data,
                cells: cells
            };
        }
        case gridActionTypes.UNDO: {
            if (state.history.length === 0) {
                return state;
            }
            let lastChange = state.history.slice(0, 1);
            let cells = state.cells.map((item, index) => {
                if (index !== lastChange[0].index) {
                    return item;
                }
                return {
                    ...item,
                    value: lastChange[0].value,
                    error: lastChange.error
                };
            });
            cells = updateOptionalValues(cells);
            return {
                ...state,
                history: state.history.slice(1),
                cells: cells
            };
        }
        case gridActionTypes.SWEEP: {
            return {
                ...state,
                withOptionalValues: true
            };
        }
        case gridActionTypes.CELL_CLICKED: {
            let cells = state.cells.map((item, index) => {
                if (index !== action.payload.cell.index) {
                    if (item.active) {
                        return {
                            ...item,
                            active: false
                        };
                    } else {
                        return item;
                    }
                }
                return {
                    ...item,
                    active: true
                };
            });
            return {
                ...state,
                cells: cells
            };
        }
        case gridActionTypes.RESET: {
            return {
                ...state,
                cells: parseOrigDataToCells(state.origData),
                history: new Array()
            };
        }
        case gridActionTypes.CELL_CHANGED: {
            // TODO handle the keycode we got...
            let evt = action.payload.newValue;
            let val = null;
            let removePossible = null;
            // handling numbers
            if (evt.which >= 49 && evt.which <= 58) {
                val = evt.which - 48;
                if (evt.shiftKey) {
                    removePossible = val;
                    val = null;
                }
            } else if (evt.which == 8 || evt.which == 46) {
                // handling delete or backspace
                val = null;
            } else {
                val = null;
                evt.preventDefault();
            }

            let cells = [...state.cells];
            let cell = cells[action.payload.cell.index];
            let { index, value, error, allowedValues } = cell;
            if (removePossible) {
                cells = cells.map((item, index) => {
                    if (index !== action.payload.cell.index) {
                        return item;
                    }
                    return {
                        ...item,
                        allowedValues: item.allowedValues.filter(
                            c => c !== removePossible
                        )
                    };
                });
            } else {
                if (val === cell.value) {
                    return state;
                }
                if (cell.value !== null) {
                    // resetting old value first
                    cell.value = null;
                    cells = updateOptionalValues(cells);
                }
                cells = cells.map((item, index) => {
                    if (index !== action.payload.cell.index) {
                        return item;
                    }
                    return {
                        ...item,
                        value: val,
                        error: val !== null && !cell.allowedValues.includes(val)
                    };
                });
                cells = updateOptionalValues(cells);
            }
            return {
                ...state,
                cells: cells,
                history: [{ value, index, error, allowedValues }, ...state.history]
            };
        }
        default:
            return state;
    }
};

function parseOrigDataToCells(strArr) {
    let outputData = new Array(GRID_SIZE * GRID_SIZE);
    for (let i = 0; i < strArr.length; i++) {
        let cellData = { index: i, error: false, active: false };
        if (strArr[i] !== '.') {
            cellData.value = +strArr[i];
            cellData.given = true;
        } else {
            cellData.value = null;
        }
        cellData.row = Math.floor(i / GRID_SIZE);
        cellData.column = i % GRID_SIZE;

        let subGridForRow = Math.floor(cellData.row / subGridSize);
        let subGridForCol = Math.floor(cellData.column / subGridSize);
        cellData.subGrid = subGridForRow * subGridSize + subGridForCol;
        outputData[i] = cellData;
    }
    return updateOptionalValues(outputData);
}

function updateOptionalValues(cells) {
    let sweepData = {};
    checkFields.forEach(field => {
        sweepData[field] = new Array(GRID_SIZE);
    });
    for (let i = 0; i < GRID_SIZE; i++) {
        checkFields.forEach(field => {
            sweepData[field][i] = cells
                .filter(cell => cell.value !== null && cell[field] === i)
                .map(cell => cell.value);
        });
    }
    cells.forEach(cell => {
        if (!cell.given) {
            // init to to all possible values. will then remove the ones that are already presend
            cell.allowedValues = Array.from(Array(GRID_SIZE), (e, i) => i + 1);
            checkFields.forEach(field => {
                let values = sweepData[field][cell[field]];
                cell.allowedValues = cell.allowedValues.filter(
                    val => !values.includes(val)
                );
            });
        }
    });
    return cells;
}

/*
function checkValue(grid, cell, newVal) {

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
*/
