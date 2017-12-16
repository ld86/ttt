import { combineReducers } from 'redux';
import update from 'immutability-helper'

import {
    MAKE_MOVE
} from './actions'

const initialState = {
    game: {
        player: 1,
        table: [[0, 0, 0], [0, 0, 0], [0, 0, 0]]
    }
}

function game(state = initialState.game, action) {
    switch (action.type) {
        case MAKE_MOVE:
            return update(state, {
                'player': {$set: 3 - state.player},
            })
        default:
            return state
    }
}

export const doReduce = combineReducers({
    game
})
