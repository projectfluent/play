import {  createStore, applyMiddleware } from 'redux';
import createLogger from 'redux-logger';

import reducers from './reducers';

const middlewares = process.env.NODE_ENV === 'development'
    ? [createLogger()]
    : [];

export default createStore(
    reducers,
    applyMiddleware(...middlewares),
);
