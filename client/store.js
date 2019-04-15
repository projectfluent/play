import {  createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk'
import { createLogger } from 'redux-logger';

import reducers from './reducers';

const middlewares = process.env.NODE_ENV === 'development'
    ? [thunkMiddleware, createLogger()]
    : [thunkMiddleware];

export default createStore(
    reducers,
    applyMiddleware(...middlewares),
);
