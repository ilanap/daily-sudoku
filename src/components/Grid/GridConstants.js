export const GRID_SIZE = 9;
export const actionTypes = {
    CELL_CHANGED: 'grid/CELL_CHANGED',
    UNDO: 'grid/UNDO',
    SWEEP: 'grid/SWEEP',
    RESET: 'grid/RESET',
    FIREWORKS: 'grid/FIREWORKS',
    CELL_CLICKED: 'grid/CELL_CLICKED',
    SHOW_FOUND: 'grid/SHOW_FOUND',
    SHOW_SWEEP: 'grid/SHOW_SWEEP'
};
export const strategyTypes = {
    ONLY_ONE_VALUE: 'strategy/ONLY_ONE_VALUE',
    ONLY_ROW_COL_GRID_VALUE: 'strategy/ONLY_ROW_COL_GRID_VALUE',
    XWING_2: 'strategy/XWING_2',
    NONE: 'strategy/NONE'
};
export const SUB_GRID_SIZE = Math.sqrt(GRID_SIZE);
export const CHECK_FIELDS = ['column', 'row', 'subGrid'];
