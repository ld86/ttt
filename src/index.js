import React from 'react';
import ReactDOM from 'react-dom';

import { doReduce } from './reducers'

import { Provider } from 'react-redux'
import thunkMiddleware from 'redux-thunk'
import { createStore, applyMiddleware, compose } from 'redux'

import { autoRehydrate, persistStore } from 'redux-persist'
import logger from 'redux-logger'

import { App } from './app';

import { botMove } from './actions'

let store = compose(
    applyMiddleware(thunkMiddleware),
    autoRehydrate()
)(createStore)(doReduce)

store.subscribe(() => {
    setTimeout(() => {
        var state = store.getState()
            if (state.game.bots.includes(state.game.player)) {
                store.dispatch(botMove())
            }
    }, 1)
})

persistStore(store)

window.store = store

ReactDOM.render(<Provider store={store}>
                    <App/>
                </Provider>,
                document.getElementById('root'));
