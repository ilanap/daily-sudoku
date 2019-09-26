import { actionTypes } from './MainPageConstants.js';

export default (state = {}, action) => {
    switch (action.type) {
        case actionTypes.SUDOKU_DATA_LOADED:
            return {
                title: action.payload.title,
                difficulty: action.payload.difficulty,
                ...state
            };
        default:
            return state;
    }
};
