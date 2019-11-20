import { parseOrigDataToCells } from 'components/Grid/GridHelper.js';
import { GRID_SIZE, strategyTypes } from 'components/Grid/GridConstants';
import { applyStrategy } from 'components/Grid/StrategyHelper';
import _ from 'lodash';

let hardData =
    '....1......34...7.2..9..4.1.6.3..75.8...6...3.37..8.1.7.8..1..6.9...42......9....';
let hardDataArray = [...hardData];

test('test single value for cell', () => {
    let nums = new Array(GRID_SIZE * GRID_SIZE);
    for (let i = 0; i < nums.length; i++) {
        nums[i] = i + 1;
    }
    nums[8] = null;
    let cells = parseOrigDataToCells(nums);
    cells = applyStrategy(strategyTypes.ONLY_ONE_VALUE, cells);
    for (let i = 0; i < nums.length; i++) {
        if (i != 8) {
            expect(cells[i].value).toBe(i + 1);
            expect(cells[i].strategy).toBeFalsy();
        } else {
            expect(cells[i].value).toBeNull();
            expect(cells[i].strategy).toBeTruthy();
        }
    }
});

test('test single value for in subgrid', () => {
    let cells = parseOrigDataToCells(hardDataArray);
    cells = applyStrategy(strategyTypes.ONLY_VALUE_IN_REGION, cells);
    let checkCell = [
        { row: 3, column: 8, subGrid: 5 },
        { row: 4, column: 3, subGrid: 4 },
        { row: 5, column: 6, subGrid: 5 },
        { row: 8, column: 6, subGrid: 8 }
    ];
    cells.forEach(cell => {
        if (cell.strategy) {
            let index = checkCell.findIndex(c => {
                return _.isMatch(cell, c);
            });
            if (index >= 0) {
                checkCell[index].found = true;
            } else {
                checkCell.push({ ...cell });
            }
        }
    });
    let found = checkCell.filter(c => c.found === true);
    expect(found.length).toBe(checkCell.length);

    found = checkCell.find(c => c.found === undefined);
    expect(found).toBeUndefined();
});
