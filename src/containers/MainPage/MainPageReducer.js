import { actionTypes } from './MainPageConstants.js';

export default (state = {}, action) => {
    switch (action.type) {
        case actionTypes.SUDOKU_DATA_LOADED:
            return {
                ...state,
                title: action.payload.title,
                date: {
                    day: action.payload.date.getDate(),
                    month: action.payload.date.getMonth(),
                    year: action.payload.date.getFullYear()
                },
                difficulty: action.payload.difficulty
            };
        default:
            return state;
    }
};
