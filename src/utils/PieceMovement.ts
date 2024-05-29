import { isPieceSameColor } from "./PieceUtils";

export function getPawnMoves(board: string[][], row: number, col: number, pieceColor: string) {
    const possibleMoves = [];
    const direction = pieceColor === "white" ? -1 : 1;
    const nextRow = row + direction;
    
    if (nextRow >= 0 && nextRow < 8) {
        // Moverse una casilla hacia adelante si está libre
        if (board[nextRow][col] === " ") possibleMoves.push({row: nextRow, col});
        
        // Moverse dos casillas hacia adelante (si están ambas libres)
        if (row === (pieceColor === "white" ? 6 : 1) && board[row + 2 * direction][col] === " " && board[nextRow][col] === " ") possibleMoves.push({row: row + 2 * direction, col});
        
        // Moverse a la izquierda y hacia adelante si existe una pieza enemiga
        if (col - 1 >= 0 && board[nextRow][col - 1] !== " " && !isPieceSameColor(board[nextRow][col - 1], pieceColor)) possibleMoves.push({row: nextRow, col: col - 1});
        
        // Moverse a la derecha y hacia adelante si existe una pieza enemiga
        if (col + 1 < 8 && board[nextRow][col + 1] !== " " && !isPieceSameColor(board[nextRow][col + 1], pieceColor)) possibleMoves.push({row: nextRow, col: col + 1});
    }
    
    return possibleMoves;

}

export function getRookMoves(board: string[][], row: number, col: number, pieceColor: string) {
    const possibleMoves = [];
    const directions = [[1, 0], [-1, 0], [0, 1], [0, -1]]; // Moverse en ortogonal hasta el borde del tablero

    for (const direction of directions) {
        let newRow = row + direction[0];
        let newCol = col + direction[1];

        while (newRow >= 0 && newRow < 8 && newCol >= 0 && newCol < 8) {
            if (board[newRow][newCol] === " ") {
                // Moverse a una casilla vacía
                possibleMoves.push({row: newRow, col: newCol});
            }
            else if (!isPieceSameColor(board[newRow][newCol], pieceColor)) {
                // Comer a una pieza enemiga, pero no se puede mover más allá de ella
                possibleMoves.push({row: newRow, col: newCol});
                break;
            }
            else break;

            newRow += direction[0];
            newCol += direction[1];
        }
    }
    
    return possibleMoves;
}

export function getKnightMoves(board: string[][], row: number, col: number, pieceColor: string) {
    const possibleMoves = [];
    const directions = [[2, 1], [2, -1], [-2, 1], [-2, -1], [1, 2], [1, -2], [-1, 2], [-1, -2]]; // Moverse en L

    for (const direction of directions) {
        const newRow = row + direction[0];
        const newCol = col + direction[1];

        if (newRow >= 0 && newRow < 8 && newCol >= 0 && newCol < 8) {
            if (board[newRow][newCol] === " " || !isPieceSameColor(board[newRow][newCol], pieceColor)) {
                possibleMoves.push({row: newRow, col: newCol});
            }
        }
    }

    return possibleMoves;
}

export function getBishopMoves(board: string[][], row: number, col: number, pieceColor: string) {
    const possibleMoves = [];
    const directions = [[1, 1], [1, -1], [-1, 1], [-1, -1]]; // Moverse en diagonal hasta el borde del tablero
    
    for (const direction of directions) {
        let newRow = row + direction[0];
        let newCol = col + direction[1];

        while (newRow >= 0 && newRow < 8 && newCol >= 0 && newCol < 8) {
            if (board[newRow][newCol] === " ") {
                // Moverse a una casilla vacía
                possibleMoves.push({row: newRow, col: newCol});
            }
            else if (!isPieceSameColor(board[newRow][newCol], pieceColor)) {
                // Comer a una pieza enemiga, pero no se puede mover más allá de ella
                possibleMoves.push({row: newRow, col: newCol});
                break;
            }
            else break;

            newRow += direction[0];
            newCol += direction[1];
        }
    }
    
    return possibleMoves;
}