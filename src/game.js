import React, { Component } from 'react';

import { connect } from 'react-redux'

import { Table } from './table'
import { makeMove } from './actions'

export class Game extends Component {
    render() {
        return (
            <div>
                <div>
                    Draw: {this.props.scores[0]}
                </div>
                <div>
                    X: {this.props.scores[1]}
                </div>
                <div>
                    O: {this.props.scores[2]}
                </div>
                <div>
                    Next player is {[' ', 'X', 'O'][this.props.player]}
                </div>
                <Table
                    table={this.props.table}
                    onBoardClick={this.props.onBoardClick}
                />
            </div>
        );
    }
}

Game = connect(
    (state) => {
        return {player: state.game.player, table: state.game.table, scores: state.game.scores}
},
(dispatch) => {
    return {
        onBoardClick: (row, column) => { dispatch(makeMove(row, column)) }
    }
})(Game)
