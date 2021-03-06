import {
    GRID_SIZE,
    REGIONS,
    SUB_GRID_SIZE
} from 'components/Grid/GridConstants';

function getGridFilteredAndMappedToRegions(cells, filterFunction, mapFunction) {
    let regionData = {};
    REGIONS.forEach(field => {
        regionData[field] = new Array(GRID_SIZE);
    });
    for (let regionIndex = 0; regionIndex < GRID_SIZE; regionIndex++) {
        REGIONS.forEach(regionField => {
            regionData[regionField][regionIndex] = cells
                .filter(cell => filterFunction(cell, regionField, regionIndex))
                .map(cell => mapFunction(cell, regionField, regionIndex));
        });
    }
    return regionData;
}

function getValuesForRegionsOfCell(cell, regionData) {
    let foundValues = [];
    // get all the values that are present in the regions to know what
    // is not an optional value later on
    REGIONS.forEach(region => {
        foundValues = foundValues.concat(regionData[region][cell[region]]);
    });
    return [...new Set(foundValues)];
}

export function getValuesForRegions(cells) {
    return getGridFilteredAndMappedToRegions(
        cells,
        function(cell, regionField, regionIndex) {
            return cell.value !== null && cell[regionField] === regionIndex;
        },
        function(cell) {
            return cell.value;
        }
    );
}

export function getCellIndicesPerRegion(cells) {
    return getGridFilteredAndMappedToRegions(
        cells,
        function(cell, regionField, regionIndex) {
            return cell[regionField] === regionIndex;
        },
        function(cell) {
            return cell.index;
        }
    );
}

export function getArrayWithAllPossibleNumbers() {
    return [...Array(GRID_SIZE).keys()].map(x => x + 1);
}

export function getOptionalValues(cells) {
    let optionalValues = [];
    let regionData = getValuesForRegions(cells);
    cells.forEach(cell => {
        if (!cell.given) {
            let foundValues = getValuesForRegionsOfCell(cell, regionData);
            let optionalValuesCells = getArrayWithAllPossibleNumbers();
            optionalValues[cell.index] = optionalValuesCells.filter(
                num => !foundValues.includes(num)
            );
        } else {
            optionalValues[cell.index] = [];
        }
    });
    return optionalValues;
}

export function getCellsWithRelationship(testCell, cells) {
    return [
        ...new Set(
            cells.filter(
                cell =>
                    cell.index !== testCell.index &&
                    isCellRelationship(cell, testCell)
            )
        )
    ];
}

export function updateOptionalValues(cells, changedCell) {
    cells.forEach(cell => {
        if (cell.index != changedCell.index && cell.sweepValues !== undefined) {
            if (isCellRelationship(cell, changedCell)) {
                if (cell.sweepValues.includes(changedCell.value)) {
                    cell.sweepValues = cell.sweepValues.filter(
                        val => val != changedCell.value
                    );
                }
            }
        }
    });
    return cells;
}

export function parseOrigDataToCells(strArr) {
    let outputData = new Array(GRID_SIZE * GRID_SIZE);
    for (let i = 0; i < strArr.length; i++) {
        let cellData = {
            index: i,
            error: false,
            active: false,
            strategy: false,
            solveValue: null,
            helperValues: {
                left: null,
                right: null,
                active: false,
                activeSide: null,
                startedCell: null
            },
            sweepValues: []
        };
        if (strArr[i] !== null && strArr[i] !== '.') {
            cellData.value = +strArr[i];
            cellData.given = true;
        } else {
            cellData.value = null;
        }
        // setting identifiers for relationships
        cellData.row = Math.floor(i / GRID_SIZE);
        cellData.column = i % GRID_SIZE;
        let subGridForRow = Math.floor(cellData.row / SUB_GRID_SIZE);
        let subGridForCol = Math.floor(cellData.column / SUB_GRID_SIZE);
        cellData.subGrid = subGridForRow * SUB_GRID_SIZE + subGridForCol;

        outputData[i] = cellData;
    }
    let sweepCells = getOptionalValues(outputData);
    outputData.forEach(cell => {
        cell.sweepValues = sweepCells[cell.index];
    });

    return outputData;
}

export function getKeyCodeForNumber(val) {
    return val + 48;
}

export function getKeyValueFromEvent({ keyCode, isShift }) {
    let keyInfo = { val: null, isSweep: false };
    if (keyCode >= 49 && keyCode <= 58) {
        // handling numbers
        keyInfo.val = keyCode - 48;
        keyInfo.isSweep = isShift;
    } else if (keyCode != 8 && keyCode != 46) {
        // was not delete
        return null;
    }
    return keyInfo;
}

export function checkError(grid, cell) {
    if (cell.value === null) return false;
    let error = grid.find(
        c =>
            c.index !== cell.index &&
            isCellRelationship(c, cell) &&
            c.value === cell.value
    );

    return error != null;
}

/***
 * Checks whether two cells are related by row/column or subgrid
 * @param cell
 * @param other
 * @returns {boolean}
 */
export function isCellRelationship(cell, other) {
    return (
        other.row === cell.row ||
        other.column === cell.column ||
        other.subGrid == cell.subGrid
    );
}

/***
 * Used on undo, to check whether the undo affect the sweepvalues and if it should be updated
 * @param grid
 * @param cell
 * @param changeData
 * @returns {boolean}
 */
export function isValueRelevantForSweep(grid, cell, changeData) {
    if (
        cell.value === null &&
        isCellRelationship(cell, grid[changeData.index])
    ) {
        let testCell = {
            value: grid[changeData.index].value,
            row: cell.row,
            column: cell.column,
            subGrid: cell.subGrid
        };
        // if we can set the new value, then we should add it to the sweepvalues
        grid[changeData.index].value = changeData.value;
        return checkError(grid, testCell) == false;
    }
    return false;
}
