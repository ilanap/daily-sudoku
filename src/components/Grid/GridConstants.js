export const GRID_SIZE = 9;
export const actionTypes = {
    CELL_CHANGED: 'grid/CELL_CHANGED',
    UNDO: 'grid/UNDO',
    SWEEP: 'grid/SWEEP',
    RESET: 'grid/RESET',
    CELL_CLICKED: 'grid/CELL_CLICKED'
};
export const SUB_GRID_SIZE = Math.sqrt(GRID_SIZE);
export const CHECK_FIELDS = ['column', 'row', 'subGrid'];
