import { combineReducers } from 'redux';
import update from 'immutability-helper'

import {
    MAKE_MOVE,
    BOT_MOVE,
} from './actions'

const initialState = {
    game: {
        player: 1,
        table: [[0, 0, 0], [0, 0, 0], [0, 0, 0]],
        scores: [0, 0, 0],
        bots: [1],
        winner: 0,
        policy: [{},{},{}],
        previous: [[],[[0, 0, 0], [0, 0, 0], [0, 0, 0]],[[0, 0, 0], [0, 0, 0], [0, 0, 0]]]
    }
}

function makeMove(state, action) {
    if (state.table[action.row][action.column] !== 0) {
        return state
    }

    return update(state, {
        'player': {$set: 3 - state.player},
        'table': {[action.row]: {[action.column]: {$set: state.player}}}
    })
}

function getWinner(table) {
    var winner = 0

    for (var i = 0; i < 3; i++) {
        if (table[i][0] === table[i][1]
            && table[i][1] === table[i][2])
        {
            winner = table[i][0]
            break
        }
        if (table[0][i] === table[1][i]
            && table[1][i] === table[2][i])
        {
            winner = table[0][i]
            break
        }
    }

    if (table[0][0] === table[1][1]
        && table[1][1] === table[2][2])
    {
        winner = table[0][0]
    }

    if (table[0][2] === table[1][1]
        && table[1][1] === table[2][0])
    {
        winner = table[0][2]
    }
    
    return winner
}

function checkWinner(state) {
    var outofmoves = true 

    for (var i = 0; i < 3; i++) {
        for (var j = 0; j < 3; j++) {
            if (state.table[i][j] === 0) {
                outofmoves = false;
            }
        }
    }

    var winner = getWinner(state.table)


    if (winner === 0 && !outofmoves) {
        return state;
    }

    return update(state, {
        'table': {$set: initialState.game.table},
        'scores': {[winner]: {$set: state.scores[winner] + 1}},
        'winner': {$set: winner}
    })
}

function randomInteger(min, max) {
    var rand = min + Math.random() * (max + 1 - min);
    rand = Math.floor(rand);
    return rand;
}

function marshalTable(table) {
    return table.map((array) => array.join('')).join('-')
}

function stateValue(policy, table, player) {
    var winner = getWinner(table)
    if (winner === player) {
        return 1
    }

    if (winner === (3 - player)) {
        return 0
    }
    
    var filled = true;
    for (var i = 0; i < 3; i++) {
        for (var j = 0; j < 3; j++) {
            if (table[i][j] !== 0) {
                continue
            }
            filled = false;
        } 
    }

    if (filled) {
        return 0;
    }

    var marshaledTable = marshalTable(table)

    if (marshaledTable in policy[player]) {
        return policy[player][marshaledTable]
    }

    return 0.5
}

function updatePolicy(policy, previous, next, player) {
    var marshaledPrevious = marshalTable(previous)
    var marshaledNext = marshalTable(next)

    var stateValuePrevious = stateValue(policy, previous, player)
    var stateValueNext = stateValue(policy, next, player)

    policy[player][marshaledPrevious] = stateValuePrevious + 
                                        0.1 * (stateValueNext - stateValuePrevious)

    console.log(marshaledPrevious)
    console.log(stateValuePrevious)
    console.log(marshaledNext)
    console.log(stateValueNext)
}

function botMove(state) {
    var row = randomInteger(0, 2)
    var column = randomInteger(0, 2)

    while (state.table[row][column] !== 0) {
        row = randomInteger(0, 2)
        column = randomInteger(0, 2)
    }

    var maxValue = 0

    for (var k = 0; k < 20; k++) {
        var i = randomInteger(0, 2)
        var j = randomInteger(0, 2)

        if (state.table[i][j] !== 0) {
            continue
        }

        var nextState = update(state, {
            'table': {[i]: {[j]: {$set: state.player}}}
        })

        var nextStateValue = stateValue(state.policy, nextState.table, state.player)
        if (nextStateValue > maxValue) {
            row = i
            column = j
            maxValue = nextStateValue
        }
    }

    nextState = update(state, {
        'table': {[i]: {[j]: {$set: state.player}}}
    })

    updatePolicy(state.policy, state.previous[state.player], nextState.table, state.player, state.winner)


    return update(state, {
        'player': {$set: 3 - state.player},
        'table': {[row]: {[column]: {$set: state.player}}},
        'bots': {$set: [1]},
        'previous': {[state.player]: {$set: nextState.table}}
    })
}

function game(state = initialState.game, action) {
    switch (action.type) {
        case MAKE_MOVE:
            return checkWinner(makeMove(state, action))
        case BOT_MOVE:
            return checkWinner(botMove(state))
        default:
            return state
    }
}

export const doReduce = combineReducers({
    game
})
