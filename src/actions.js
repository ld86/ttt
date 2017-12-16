export const MAKE_MOVE = 'MAKE_MOVE'

export function makeMove(row, column) {
    return {
        type: MAKE_MOVE,
        row: row,
        column: column
    }
}
