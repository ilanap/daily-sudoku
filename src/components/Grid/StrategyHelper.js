import { REGIONS, GRID_SIZE, strategyTypes } from './GridConstants';
import { getOptionalValues } from './GridHelper';

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
            let sweepValues = getOptionalValues(cells);
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
        case strategyTypes.ONLY_VALUE_IN_REGION: {
            // initializing our arrays.
            let sweepData = {};
            REGIONS.forEach(region => {
                sweepData[region] = new Array(GRID_SIZE);
                for (let i = 0; i < GRID_SIZE; i++) {
                    sweepData[region][i] = new Array(GRID_SIZE);
                }
            });
            // mapping the values per region. marking the ones that are found and that are found more than once
            getOptionalValues(cells).forEach((values, i) => {
                if (values.length) {
                    REGIONS.forEach(region => {
                        values.forEach(val => {
                            let regionIndex = cells[i][region];
                            if (
                                sweepData[region][regionIndex][val] ===
                                undefined
                            ) {
                                sweepData[region][regionIndex][val] = i;
                            } else {
                                sweepData[region][regionIndex][val] = -1;
                            }
                        });
                    });
                }
            });
            // now we will get an array with all the indices that have a singular value for the region
            let strategyCells = [];
            REGIONS.forEach(region => {
                for (let i = 0; i < GRID_SIZE; i++) {
                    strategyCells = strategyCells.concat(
                        sweepData[region][i].filter(
                            val => val !== undefined && val !== -1
                        )
                    );
                }
            });
            // last but not least set the flag
            cells = cells.map(cell => {
                if (cell.value) {
                    return cell;
                } else {
                    return {
                        ...cell,
                        strategy: strategyCells.includes(cell.index)
                    };
                }
            });
            return cells;
        }
        case strategyTypes.XWING_2: {
            return cells;
        }
        default:
            cells = cells.map(item => ({ ...item, strategy: false }));
            return cells;
    }
}
