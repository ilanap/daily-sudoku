import { actionTypes } from './LoaderConstants.js';

export default (state = { isLoading: false }, action) => {
    switch (action.type) {
        case actionTypes.SHOW:
            return { isLoading: true };
        case actionTypes.HIDE:
            return { isLoading: false };
        default:
            return state;
    }
};
