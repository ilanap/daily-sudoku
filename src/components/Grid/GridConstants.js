export const GRID_SIZE = 9;
export const actionTypes = {
    CELL_CHANGED: 'grid/CELL_CHANGED',
    UNDO: 'grid/UNDO',
    SWEEP: 'grid/SWEEP',
    RESET: 'grid/RESET',
    FIREWORKS: 'grid/FIREWORKS',
    CELL_CLICKED: 'grid/CELL_CLICKED',
    HELPER_CELL_CLICKED: 'grid/HELPER_CELL_CLICKED',
    HELPER_CELL_CHANGED: 'grid/HELPER_CELL_CHANGED',
    SHOW_FOUND: 'grid/SHOW_FOUND',
    SHOW_SWEEP: 'grid/SHOW_SWEEP'
};
export const strategyTypes = {
    ONLY_ONE_VALUE: 'strategy/ONLY_ONE_VALUE',
    ONLY_VALUE_IN_REGION: 'strategy/ONLY_VALUE_IN_REGION',
    COMBINATION_2: 'strategy/COMBINATION_2',
    COMBINATION_3: 'strategy/COMBINATION_3',
    HELPER_GRID: 'stategy/HELPER_GRID',
    XWING_2: 'strategy/XWING_2',
    NONE: 'strategy/NONE'
};
export const SUB_GRID_SIZE = Math.sqrt(GRID_SIZE);
export const REGIONS = ['column', 'row', 'subGrid'];
