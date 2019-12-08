import {
    parseOrigDataToCells,
    checkError
} from 'components/Grid/GridHelper.js';
import {
    getCellIndicesPerRegion,
    getCellsWithRelationship,
    getValuesForRegions,
    isCellRelationship,
    updateOptionalValues
} from 'components/Grid/GridHelper';
import { REGIONS } from 'components/Grid/GridConstants';

const hardData =
    '....1......34...7.2..9..4.1.6.3..75.8...6...3.37..8.1.7.8..1..6.9...42......9....';
const hardDataArray = [...hardData];
const cells = parseOrigDataToCells(hardDataArray);

test('test parseOrigDataToCells', () => {
    cells.forEach((cell, index) => {
        let data = hardDataArray[index];
        if (data !== '.') {
            expect(cell.value).toBe(+data);
            expect(cell.given).toBeTruthy();
        } else {
            expect(cell.value).toBeNull();
            expect(cell.given).toBeFalsy();
        }
    });
});

test('test checkError', () => {
    let testCell = { ...cells[1], value: 1 };
    let error = checkError(cells, testCell);
    expect(error).toBeTruthy();
    testCell = { ...cells[42], value: 9 };
    error = checkError(cells, testCell);
    expect(error).toBeFalsy();
    testCell = { ...cells[0], value: null };
    error = checkError(cells, testCell);
    expect(error).toBeFalsy();
});

test('test isCellRelationship', () => {
    let checkCell = cells[0];
    cells.filter(cell => {
        if (cell.index != checkCell.index) {
            if (
                cell.row === checkCell.row ||
                cell.column === checkCell.column ||
                cell.subGrid === checkCell.subGrid
            ) {
                expect(isCellRelationship(cell, checkCell)).toBeTruthy();
            } else {
                expect(isCellRelationship(cell, checkCell)).toBeFalsy();
            }
        }
    });
});

test('test getValuesForRegions', () => {
    let response = getValuesForRegions(cells);
    REGIONS.forEach(region => {
        let data = response[region];
        expect(data).toBeDefined();
    });
    cells.forEach(cell => {
        if (cell.value !== null) {
            expect(
                response['column'][cell.column].includes(cell.value)
            ).toBeTruthy();
            expect(response['row'][cell.row].includes(cell.value)).toBeTruthy();
            expect(
                response['subGrid'][cell.subGrid].includes(cell.value)
            ).toBeTruthy();
        } else {
            expect(
                response['column'][cell.column].includes(cell.value)
            ).toBeFalsy();
            expect(response['row'][cell.row].includes(cell.value)).toBeFalsy();
            expect(
                response['subGrid'][cell.subGrid].includes(cell.value)
            ).toBeFalsy();
        }
    });
});

test('test getCellIndicesPerRegion', () => {
    let response = getCellIndicesPerRegion(cells);
    REGIONS.forEach(region => {
        let data = response[region];
        expect(data).toBeDefined();
        expect(data.length).toBe(9);
    });
    cells.forEach(cell => {
        expect(
            response['column'][cell.column].includes(cell.index)
        ).toBeTruthy();
        expect(response['row'][cell.row].includes(cell.index)).toBeTruthy();
        expect(
            response['subGrid'][cell.subGrid].includes(cell.index)
        ).toBeTruthy();
    });
});

test('test updateOptionalValues', () => {
    let changeMe = cells[42];
    let relations = getCellsWithRelationship(changeMe, cells);
    // check who has the value we are to assign.
    relations = relations.filter(c => c.sweepValues.includes(9));
    expect(relations.length).toBe(9);
    changeMe.value = 9;
    updateOptionalValues(cells, changeMe);
    relations = relations.filter(c => c.sweepValues.includes(9));
    expect(relations.length).toBe(0);
});
