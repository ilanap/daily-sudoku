import { createStore, applyMiddleware, compose } from 'redux';
import createSagaMiddleware from 'redux-saga';

import reducers from './rootReducers.js';
import sagas from './rootSagas.js';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const combinedReducers = (state, action) => ({
    ...reducers(state, action),
    queryParams: location.search
});

const sagaMiddleware = createSagaMiddleware();
const store = createStore(
    combinedReducers,
    composeEnhancers(applyMiddleware(sagaMiddleware))
);
sagaMiddleware.run(sagas);

export default store;
