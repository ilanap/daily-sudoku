import { actionTypes } from 'containers/MainPage/MainPageConstants.js';
import {
    GRID_SIZE,
    actionTypes as gridActionTypes,
    strategyTypes
} from 'components/Grid/GridConstants';
import {
    getOptionalValues,
    updateOptionalValues,
    parseOrigDataToCells,
    getKeyValueFromEvent,
    checkError
} from './GridHelper.js';
import { applyStrategy } from './StrategyHelper.js';
import { isValueRelevantForSweep } from './GridHelper';

export default (
    state = {
        origData: null,
        isSweep: false,
        history: new Array(),
        solved: false,
        showFoundValue: null,
        showSweepValue: null,
        helperStartIndex: null,
        strategy: strategyTypes.NONE,
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
                showFoundValue: null,
                showSweepValue: null,
                strategy: strategyTypes.NONE,
                history: new Array()
            };
        }
        case gridActionTypes.SHOW_FOUND: {
            let val =
                state.showFoundValue === action.payload ? null : action.payload;
            return {
                ...state,
                showFoundValue: val
            };
        }
        case gridActionTypes.SHOW_SWEEP: {
            let val =
                state.showSweepValue === action.payload ? null : action.payload;
            return {
                ...state,
                showSweepValue: val
            };
        }
        case gridActionTypes.FIREWORKS: {
            return {
                ...state,
                solved: true
            };
        }
        case gridActionTypes.SWEEP: {
            let cells = [...state.cells];
            let sweep = state.isSweep === false;
            let sweepCells = getOptionalValues(cells);
            cells = cells.map(item => {
                item.sweepValues = sweep ? sweepCells[item.index] : [];
                return item;
            });
            return {
                ...state,
                cells: cells,
                isSweep: sweep
            };
        }
        case gridActionTypes.UNDO: {
            if (state.history.length === 0) {
                return state;
            }
            let lastChange = state.history.slice(0, 1);
            let oldValue = state.cells[lastChange[0].index].value;
            let cells = state.cells.map((item, index) => {
                if (index !== lastChange[0].index) {
                    // if we are in sweep mode - then we have to reset the sweep values in the grid with our value,
                    // that is not stored in history
                    let returnItem = {
                        ...item,
                        active: false
                    };
                    if (state.isSweep && item.value === null) {
                        if (
                            oldValue !== null &&
                            item.sweepValues !== null &&
                            !item.sweepValues.includes(lastChange[0].value)
                        ) {
                            if (
                                isValueRelevantForSweep(
                                    state.cells,
                                    item,
                                    lastChange[0]
                                )
                            ) {
                                returnItem.sweepValues.push(oldValue);
                                console.log(returnItem);
                            }
                        }
                    }
                    return returnItem;
                } else {
                    return {
                        ...item,
                        ...lastChange[0]
                    };
                }
            });
            return {
                ...state,
                history: state.history.slice(1),
                cells: cells
            };
        }
        case gridActionTypes.CELL_CLICKED: {
            let cells = state.cells.map((item, index) => {
                return {
                    ...item,
                    active: index === action.payload.cell.index
                };
            });
            return {
                ...state,
                cells: cells
            };
        }
        case gridActionTypes.HELPER_CELL_CLICKED: {
            let cells = state.cells.map((item, index) => {
                return {
                    ...item,
                    helperValues: {
                        ...item.helperValues,
                        active: index === action.payload.cell.index,
                        activeSide:
                            index === action.payload.cell.index
                                ? action.payload.side
                                : null
                    }
                };
            });
            return {
                ...state,
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
            let historyCell = { ...cells[action.payload.cell.index] };
            historyCell.sweepValues = [...historyCell.sweepValues];
            if (keyData.isSweep) {
                cells = cells.map((item, index) => {
                    if (index !== action.payload.cell.index) {
                        return item;
                    }
                    let sweepValues = item.sweepValues;
                    if (item.sweepValues.includes(keyData.val)) {
                        sweepValues = sweepValues.filter(
                            c => c !== keyData.val
                        );
                    } else {
                        sweepValues.push(keyData.val);
                        sweepValues = sweepValues.sort();
                    }
                    return {
                        ...item,
                        sweepValues: sweepValues
                    };
                });
            } else {
                let cell = cells[action.payload.cell.index];
                if (keyData.val === cell.value) {
                    return state;
                }
                cells = cells.map((item, index) => {
                    if (index !== action.payload.cell.index) {
                        return item;
                    }
                    cell.value = keyData.val;
                    return {
                        ...item,
                        value: keyData.val,
                        error: checkError(cells, cell),
                        strategy: false
                    };
                });
                if (state.isSweep) {
                    updateOptionalValues(cells, cells[cell.index]);
                }
                if (state.strategy !== strategyTypes.NONE) {
                    cells = applyStrategy(state.strategy, cells);
                }
            }
            return {
                ...state,
                cells: cells,
                solved:
                    cells.find(cell => cell.error || cell.value === null) ===
                    undefined,
                history: [historyCell].concat(state.history)
            };
        }
        case gridActionTypes.HELPER_CELL_CHANGED: {
            let keyData = getKeyValueFromEvent(action.payload);
            if (keyData === null) {
                // uninteresting key
                return state;
            }
            let cells = [...state.cells];
            let cell = cells[action.payload.cell.index];
            let helperValues = { ...cell.helperValues };
            helperValues[helperValues.activeSide] = keyData.val;
            let startIndex = state.helperStartIndex;
            if (startIndex === null) {
                startIndex = action.payload.cell.index;
                helperValues.startedCell = helperValues.activeSide;
            }
            cells = cells.map((item, index) => {
                if (index !== action.payload.cell.index) {
                    return item;
                }
                return {
                    ...item,
                    helperValues: helperValues
                };
            });
            return {
                ...state,
                helperStartIndex: startIndex,
                cells: cells
            };
        }

        case strategyTypes.NONE:
        case strategyTypes.HELPER_GRID:
        case strategyTypes.ONLY_VALUE_IN_REGION:
        case strategyTypes.ONLY_ONE_VALUE: {
            let cells = [...state.cells];
            cells = applyStrategy(action.type, cells);
            return {
                ...state,
                strategy: action.type,
                cells: cells
            };
        }
        default:
            return state;
    }
};
