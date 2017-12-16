import React from 'react';
import ReactDOM from 'react-dom';

import { doReduce } from './reducers'

import { Provider } from 'react-redux'
import thunkMiddleware from 'redux-thunk'
import { createStore, applyMiddleware, compose } from 'redux'

import { autoRehydrate, persistStore } from 'redux-persist'
import logger from 'redux-logger'

import { App } from './app';

let store = compose(
    applyMiddleware(thunkMiddleware, logger),
    autoRehydrate()
)(createStore)(doReduce)

persistStore(store)

ReactDOM.render(<Provider store={store}>
                    <App/>
                </Provider>,
                document.getElementById('root'));
