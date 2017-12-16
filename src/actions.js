export const MAKE_MOVE = 'MAKE_MOVE'
export const BOT_MOVE = 'BOT_MOVE'

export function makeMove(row, column) {
    return {
        type: MAKE_MOVE,
        row: row,
        column: column
    }
}

export function botMove() {
    return {
        type: BOT_MOVE
    }
}
