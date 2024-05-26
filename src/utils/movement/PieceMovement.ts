export function getPawnMoves(board: string[][], row: number, col: number, pieceColor: string) {
    const possibleMoves = [];
    const direction = pieceColor === "white" ? -1 : 1;
    
    if (row + direction >= 0 && row + direction < 8) {
        possibleMoves.push({row: row + direction, col}); // Mover una casilla hacia adelante
        
        if ((pieceColor === "white" && row === 6) || (pieceColor === "black" && row === 1)) {
            possibleMoves.push({row: row + 2 * direction, col}); // Mover dos casillas hacia adelante
        }

        if (col - 1 >= 0) possibleMoves.push({row: row + direction, col: col - 1}); // Mover una casilla hacia adelante y a la izquierda
        if (col + 1 < 8) possibleMoves.push({row: row + direction, col: col + 1}); // Mover una casilla hacia adelante y a la derecha
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
            possibleMoves.push({row: newRow, col: newCol});
            
            newRow += direction[0];
            newCol += direction[1];
        }
    }
    
    return possibleMoves;
}