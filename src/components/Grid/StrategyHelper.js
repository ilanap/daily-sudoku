import Combinatorics from 'js-combinatorics';
import { REGIONS, strategyTypes } from './GridConstants';
import {
    getArrayWithAllPossibleNumbers,
    getCellIndicesPerRegion,
    getValuesForRegions
} from './GridHelper';

export function applyStrategy(type, cells) {
    cells = cells.map(item => {
        return { ...item, strategy: false };
    });
    switch (type) {
        case strategyTypes.HELPER_GRID: {
            let returnCells = cells.map(item => {
                return {
                    ...item,
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
            let returnCells = cells.map(item => {
                if (item.value) {
                    return item;
                } else {
                    return {
                        ...item,
                        strategy: cells[item.index].sweepValues.length === 1
                    };
                }
            });
            return returnCells;
        }
        case strategyTypes.ONLY_VALUE_IN_REGION: {
            /*
            - loop over all cells with optional values and do following:
                - get all relations indices removing those with a value and our current cell
                to get all relations with optional values
                - map the relevant cells to the optional values
                - reduce all the optional values so that we are left with a flat
                array of all possible values for those cells
                - filter out the optional values for our cells with all the surrounding values
                - if we have a value left -> then we know this fulfiils the strategy
             */
            let regionValues = getCellIndicesPerRegion(cells);
            cells.forEach(c => {
                if (c.value !== null) {
                    return;
                }
                let isStrategy = false;
                REGIONS.forEach(region => {
                    if (!isStrategy) {
                        let checkRegion = regionValues[region];
                        checkRegion = checkRegion[c[region]];
                        let relations = checkRegion
                            .filter(relationsIndex => {
                                return (
                                    cells[relationsIndex].index !== c.index &&
                                    cells[relationsIndex].value === null
                                );
                            })
                            .map(relationsIndex => {
                                return cells[relationsIndex].sweepValues;
                            })
                            .reduce(function(total, currentValue) {
                                total = total.concat(currentValue);
                                return [...new Set(total)];
                            }, []);
                        let onlyValues = c.sweepValues.filter(
                            val => !relations.includes(val)
                        );
                        isStrategy = onlyValues.length > 0;
                        if (isStrategy) {
                            printHint(onlyValues, c);
                        }
                    }
                });
                if (isStrategy) {
                    cells[c.index] = { ...c, strategy: true };
                }
            });
            return cells;
        }
        case strategyTypes.COMBINATION_2: {
            // TODO WIP
            // etting the missing values per region to use for combis
            let regionData = getValuesForRegions(cells);
            let combinationsSize = 2;
            // getting the combinations possible for each region
            REGIONS.forEach(region => {
                regionData[region].forEach((foundValues, i) => {
                    // getting all values and removing those that exist so that
                    // we are left with the missing values for this cross region
                    let missingValues = getArrayWithAllPossibleNumbers();
                    // removing all the foundValues from the array
                    missingValues = missingValues.filter(
                        val => !foundValues.includes(val)
                    );
                    if (missingValues.length >= combinationsSize) {
                        let cmb = Combinatorics.combination(
                            missingValues,
                            combinationsSize
                        ).toArray();
                        regionData[region][i] = cmb;
                    } else {
                        regionData[region][i] = null;
                    }
                });
            });
            // checking the cells in our regions for the strategy
            let regionCells = getCellIndicesPerRegion(cells);
            REGIONS.forEach(region => {
                regionCells[region].forEach((regionCells, i) => {
                    let cmb = regionData[region][i];
                    cmb.forEach(c => {
                        let foundCells = [];
                        regionCells.forEach(cell => {
                            let found = cells[cell].sweepValues.filter(val =>
                                c.includes(val)
                            );
                            if (found === combinationsSize) {
                                foundCells.push(cell);
                            }
                        });
                        if (foundCells.length === combinationsSize) {
                            // we found the same amount of cells as the number is the combination.
                            // fulfiils the strategy
                            foundCells.forEach(cellIndex => {
                                cells[cellIndex] = {
                                    ...cells[cellIndex],
                                    strategy: true
                                };
                            });
                        }
                    });
                });
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

    function printHint(hint, { row, column, subGrid }) {
        console.log(
            'rows: ' +
                row +
                ', column: ' +
                column +
                ', subgrid: ' +
                subGrid +
                ' --> ' +
                hint
        );
    }
}
