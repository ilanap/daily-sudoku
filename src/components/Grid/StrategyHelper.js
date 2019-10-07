import { strategyTypes } from './GridConstants';
import { handleOptionalValues } from './GridHelper';

export function applyStrategy(type, cells) {
    switch (type) {
        case strategyTypes.ONLY_ONE_VALUE: {
            let checkCells = handleOptionalValues(cells);
            cells = cells.map(item => {
                item.strategy = false;
                if (item.value) {
                    return item;
                } else {
                    return {
                        ...item,
                        strategy:
                            checkCells[item.index].sweepValues.length === 1
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
