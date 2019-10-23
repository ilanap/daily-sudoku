import {
    GRID_SIZE,
    CHECK_FIELDS,
    SUB_GRID_SIZE
} from 'components/Grid/GridConstants';

export function getFieldsSweepData(cells) {
    let sweepData = {};
    CHECK_FIELDS.forEach(field => {
        sweepData[field] = new Array(GRID_SIZE);
    });
    for (let i = 0; i < GRID_SIZE; i++) {
        CHECK_FIELDS.forEach(field => {
            sweepData[field][i] = cells
                .filter(cell => cell.value !== null && cell[field] === i)
                .map(cell => cell.value);
        });
    }
    return sweepData;
}
export function handleOptionalValues(cells) {
    let sweepData = getFieldsSweepData(cells);
    let optionalValuesCells = new Array(GRID_SIZE * GRID_SIZE);
    cells.forEach(cell => {
        if (!cell.given) {
            // init to to all possible values. will then remove the ones that are already presend
            optionalValuesCells[cell.index] = Array.from(
                Array(GRID_SIZE),
                (e, i) => i + 1
            );
            CHECK_FIELDS.forEach(field => {
                let values = sweepData[field][cell[field]];
                optionalValuesCells[cell.index] = optionalValuesCells[
                    cell.index
                ].filter(val => !values.includes(val));
            });
        } else {
            optionalValuesCells[cell.index] = [];
        }
    });
    return optionalValuesCells;
}

export function updateOptionalValues(cells, changedCell) {
    cells.forEach(cell => {
        if (cell.index != changedCell.index && cell.sweepValues !== undefined) {
            let isRelevantCell = false;
            CHECK_FIELDS.forEach(field => {
                if (cell[field] == changedCell[field]) {
                    isRelevantCell = true;
                }
            });
            if (isRelevantCell) {
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
            helperValues: {
                left: null,
                right: null,
                active: false,
                activeSide: null,
                startedCell: null
            },
            sweepValues: []
        };
        if (strArr[i] !== '.') {
            cellData.value = +strArr[i];
            cellData.given = true;
        } else {
            cellData.value = null;
        }
        cellData.row = Math.floor(i / GRID_SIZE);
        cellData.column = i % GRID_SIZE;

        let subGridForRow = Math.floor(cellData.row / SUB_GRID_SIZE);
        let subGridForCol = Math.floor(cellData.column / SUB_GRID_SIZE);
        cellData.subGrid = subGridForRow * SUB_GRID_SIZE + subGridForCol;
        outputData[i] = cellData;
    }
    return outputData;
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
            (c.row === cell.row ||
                c.column === cell.column ||
                c.subGrid === cell.subGrid) &&
            c.value === cell.value
    );

    return error != null;
}
