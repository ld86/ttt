import React, { Component } from 'react';

import './table.css'

class Square extends Component {
    render() {
        return  <button
                    className="square"
                    onClick={() => this.props.onBoardClick(this.props.row, this.props.column)}
                >
                    {[' ', 'X', 'O'][this.props.value]}
                </button>
    }
}

export class Table extends Component {
    renderTable() {
        var table = []
        for (var row = 0; row < 3; row++) {
            var tableRow = []
            for (var column = 0; column < 3; column++) {
                tableRow.push(
                        <Square
                            key={row * 3 + column} 
                            row={row}
                            column={column}
                            value={this.props.table[row][column]}
                            onBoardClick={this.props.onBoardClick}
                        />)
            }
            table.push(<div key={row} className="table-row">{tableRow}</div>)
        }
 
        return (
            <div>
                {table}
            </div>
        );
    }

    render() {
        return (
            <div>
                {this.renderTable()}
            </div>
        );
    }
}
