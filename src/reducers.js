import { combineReducers } from 'redux';
import update from 'immutability-helper'

import {
    MAKE_MOVE
} from './actions'

const initialState = {
    game: {
        player: 1,
        table: [[0, 0, 0], [0, 0, 0], [0, 0, 0]],
        scores: [0, 0, 0]
    }
}

function game(state = initialState.game, action) {
    switch (action.type) {
        case MAKE_MOVE:
            if (state.table[action.row][action.column] !== 0) {
                return state
            }

            var updated = update(state, {
                'player': {$set: 3 - state.player},
                'table': {[action.row]: {[action.column]: {$set: state.player}}}
            })

            var outofmoves = true 
            var winner = 0

            for (var i = 0; i < 3; i++) {
                for (var j = 0; j < 3; j++) {
                    if (updated.table[i][j] === 0) {
                        outofmoves = false;
                    }
                }
            }

            for (i = 0; i < 3; i++) {
                if (updated.table[i][0] === updated.table[i][1]
                    && updated.table[i][1] === updated.table[i][2])
                {
                    winner = updated.table[i][0]
                    break
                }
                if (updated.table[0][i] === updated.table[1][i]
                    && updated.table[1][i] === updated.table[2][i])
                {
                    winner = updated.table[0][i]
                    break
                }
            }
            if (updated.table[0][0] === updated.table[1][1]
                && updated.table[1][1] === updated.table[2][2])
            {
                winner = updated.table[0][0]
            }
            if (updated.table[0][2] === updated.table[1][1]
                && updated.table[1][1] === updated.table[2][0])
            {
                winner = updated.table[0][2]
            }

            if (winner === 0 && !outofmoves) {
                return updated;
            }


            return update(updated, {
                'table': {$set: initialState.game.table},
                'scores': {[winner]: {$set: updated.scores[winner] + 1}}
            })

        default:
            return state
    }
}

export const doReduce = combineReducers({
    game
})
