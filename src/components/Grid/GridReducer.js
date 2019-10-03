import { actionTypes } from 'containers/MainPage/MainPageConstants.js';
import {
    GRID_SIZE,
    actionTypes as gridActionTypes
} from 'components/Grid/GridConstants';
import {
    handleOptionalValues,
    updateOptionalValues,
    parseOrigDataToCells,
    getKeyValueFromEvent,
    checkValue
} from './GridHelper.js';

export default (
    state = {
        origData: null,
        isSweep: false,
        history: new Array(),
        solved: false,
        cells: new Array(GRID_SIZE * GRID_SIZE)
    },
    action
) => {
    switch (action.type) {
        case actionTypes.SUDOKU_DATA_LOADED: {
            let data = [...action.payload.numbers];
            return {
                ...state,
                origData: data,
                solved: false,
                cells: parseOrigDataToCells(data)
            };
        }
        case gridActionTypes.RESET: {
            return {
                ...state,
                cells: parseOrigDataToCells(state.origData),
                isSweep: false,
                solved: false,
                history: new Array()
            };
        }
        case gridActionTypes.SWEEP: {
            let cells = [...state.cells];
            let sweep = state.isSweep === false;
            if (sweep) {
                cells = handleOptionalValues(cells);
            } else {
                cells = cells.map(item => {
                    item.sweepValues = [];
                    return item;
                });
            }
            return {
                ...state,
                cells: cells,
                solved: false,
                isSweep: sweep
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
                    error: lastChange[0].error
                };
            });
            if (state.isSweep) {
                cells = handleOptionalValues(cells);
            }
            return {
                ...state,
                history: state.history.slice(1),
                solved: false,
                cells: cells
            };
        }
        case gridActionTypes.CELL_CLICKED: {
            //resetting previously clicked cell and setting current
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
                solved: false,
                cells: cells
            };
        }
        case gridActionTypes.CELL_CHANGED: {
            let keyData = getKeyValueFromEvent(action.payload);
            if (keyData === null) {
                // uninteresting key
                return state;
            }
            let cells = [...state.cells];
            let cell = cells[action.payload.cell.index];
            let { index, value, error, sweepValues } = cell;
            if (keyData.isSweep) {
                cells = cells.map((item, index) => {
                    if (index !== action.payload.cell.index) {
                        return item;
                    }
                    return {
                        ...item,
                        sweepValues: item.sweepValues.filter(
                            c => c !== keyData.val
                        )
                    };
                });
            } else {
                if (keyData.val === cell.value) {
                    return state;
                }
                /*
                if (cell.value !== null) {
                    // resetting all the optional values in case we changed the value of a cell
                    cell.value = null;
                    cells = handleOptionalValues(cells);
                }
                */
                cells = cells.map((item, index) => {
                    if (index !== action.payload.cell.index) {
                        return item;
                    }
                    cell.value = keyData.val;
                    error = checkValue(cells, cell);
                    return {
                        ...item,
                        value: keyData.val,
                        error: error
                    };
                });
                if (state.isSweep) {
                    updateOptionalValues(cells, cells[cell.index]);
                }
            }
            if (value === null) error = false;
            let solved = cells.find(cell => cell.error || cell.value === null);
            console.log(solved);
            return {
                ...state,
                cells: cells,
                solved:
                    cells.find(cell => cell.error || cell.value === null) ===
                    undefined,
                history: [
                    { value, index, error, sweepValues },
                    ...state.history
                ]
            };
        }
        default:
            return state;
    }
};
