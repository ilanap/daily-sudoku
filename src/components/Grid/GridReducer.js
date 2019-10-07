import { actionTypes } from 'containers/MainPage/MainPageConstants.js';
import {
    GRID_SIZE,
    actionTypes as gridActionTypes,
    strategyTypes
} from 'components/Grid/GridConstants';
import {
    handleOptionalValues,
    updateOptionalValues,
    parseOrigDataToCells,
    getKeyValueFromEvent,
    checkError
} from './GridHelper.js';
import { applyStrategy } from './StrategyHelper.js';

export default (
    state = {
        origData: null,
        isSweep: false,
        history: new Array(),
        solved: false,
        showFoundValue: null,
        showSweepValue: null,
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
                history: new Array()
            };
        }
        case gridActionTypes.SHOW_FOUND:
            return {
                ...state,
                showFoundValue: action.payload
            };
        case gridActionTypes.SHOW_SWEEP:
            return {
                ...state,
                showSweepValue: action.payload
            };
        case gridActionTypes.FIREWORKS: {
            return {
                ...state,
                solved: true
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
                    return {
                        ...item,
                        active: false
                    };
                }
                return {
                    ...item,
                    ...lastChange[0]
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
        case strategyTypes.ONLY_ONE_VALUE: {
            let cells = [...state.cells];
            cells = applyStrategy(strategyTypes.ONLY_ONE_VALUE, cells);
            return {
                ...state,
                strategy: strategyTypes.ONLY_ONE_VALUE,
                cells: cells
            };
        }
        case strategyTypes.NONE: {
            let cells = [...state.cells];
            cells = cells.map(item => ({ ...item, strategy: false }));
            return { ...state, cells };
        }
        case strategyTypes.ONLY_ROW_COL_GRID_VALUE: {
            let cells = [...state.cells];
            cells = handleOptionalValues(cells);
            return { ...state, cells };
        }
        case strategyTypes.XWING_2: {
            let cells = [...state.cells];
            cells = handleOptionalValues(cells);
            return { ...state, cells };
        }
        default:
            return state;
    }
};
