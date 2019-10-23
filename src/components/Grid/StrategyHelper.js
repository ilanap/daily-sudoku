import { CHECK_FIELDS, GRID_SIZE, strategyTypes } from './GridConstants';
import { handleOptionalValues } from './GridHelper';

export function applyStrategy(type, cells) {
    switch (type) {
        case strategyTypes.HELPER_GRID: {
            let returnCells = cells.map(item => {
                return {
                    ...item,
                    strategy: false,
                    helperValues: {
                        left: null,
                        right: null,
                        active: false,
                        activeSide: null,
                        startedCell: null
                    }
                };
            });
            return returnCells;
        }
        case strategyTypes.ONLY_ONE_VALUE: {
            let sweepValues = handleOptionalValues(cells);
            let returnCells = cells.map(item => {
                item.strategy = false;
                if (item.value) {
                    return item;
                } else {
                    return {
                        ...item,
                        strategy: sweepValues[item.index].length === 1
                    };
                }
            });
            return returnCells;
        }
        case strategyTypes.ONLY_ROW_COL_GRID_VALUE: {
            let sweepValues = handleOptionalValues(cells);
            let strategyCells = [];
            let sweepData = {};
            CHECK_FIELDS.forEach(field => {
                sweepData[field] = new Array(GRID_SIZE);
            });
            for (let i = 0; i < GRID_SIZE; i++) {
                CHECK_FIELDS.forEach(field => {
                    // first get all cells with optional values
                    let sweepCells = cells.filter(
                        c => sweepValues[c.index].length > 0 && c[field] === i
                    );
                    // mark the numbers, set index of cell when found, unmark if we find more than one
                    let foundValues = new Array(GRID_SIZE);
                    sweepCells.forEach(c => {
                        sweepValues[c.index].forEach(val => {
                            if (foundValues[val] === undefined) {
                                foundValues[val] = c.index;
                            } else if (foundValues !== -1) {
                                foundValues[val] = -1;
                            }
                        });
                    });
                    // only taking the indeces and adding in to the cells that fulfill the strategy
                    foundValues.filter(v => {
                        if (
                            v !== undefined &&
                            v !== -1 &&
                            !strategyCells.includes(v)
                        ) {
                            strategyCells.push(v);
                        }
                    });
                });
            }
            cells = cells.map(item => {
                if (item.value) {
                    return item;
                } else {
                    return {
                        ...item,
                        strategy: strategyCells.includes(item.index)
                    };
                }
            });
            return cells;
        }
        default:
            cells = cells.map(item => ({ ...item, strategy: false }));
            return cells;
    }
}
