import * as PieceMovement from "./movement/PieceMovement.ts";
import * as PieceValidation from "./validation/PieceValidation.ts";

import WhitePawnImg from "../assets/chess-pieces/white_pawn.png";
import BlackPawnImg from "../assets/chess-pieces/black_pawn.png";
import WhiteRookImg from "../assets/chess-pieces/white_rook.png";
import BlackRookImg from "../assets/chess-pieces/black_rook.png";
import WhiteKnightImg from "../assets/chess-pieces/white_knight.png";
import BlackKnightImg from "../assets/chess-pieces/black_knight.png";
import WhiteBishopImg from "../assets/chess-pieces/white_bishop.png";
import BlackBishopImg from "../assets/chess-pieces/black_bishop.png";
import WhiteQueenImg from "../assets/chess-pieces/white_queen.png";
import BlackQueenImg from "../assets/chess-pieces/black_queen.png";
import WhiteKingImg from "../assets/chess-pieces/white_king.png";
import BlackKingImg from "../assets/chess-pieces/black_king.png";

const moveHandlers = {
    p: PieceMovement.getPawnMoves,
    r: PieceMovement.getRookMoves,
    n: PieceMovement.getKnightMoves,
    b: PieceMovement.getBishopMoves,
    q: PieceMovement.getQueenMoves,
    k: PieceMovement.getKingMoves
}

const validationHandlers = {
    p: PieceValidation.isValidPawnMove,
    r: PieceValidation.isValidRookMove,
    n: PieceValidation.isValidKnightMove,
    b: PieceValidation.isValidBishopMove,
    q: PieceValidation.isValidQueenMove,
    k: PieceValidation.isValidKingMove
}

export function getPieceImage(piece: string) {
    switch (piece) {
        case "P": return WhitePawnImg;
        case "p": return BlackPawnImg;
        case "R": return WhiteRookImg;
        case "r": return BlackRookImg;
        case "N": return WhiteKnightImg;
        case "n": return BlackKnightImg;
        case "B": return WhiteBishopImg;
        case "b": return BlackBishopImg;
        case "Q": return WhiteQueenImg;
        case "q": return BlackQueenImg;
        case "K": return WhiteKingImg;
        case "k": return BlackKingImg;
        default: return "";
    }
}

// Todas las posiciones posibles son aquellas que es capaz de hacer una pieza sin importar nada más que su posición, no se toma en cuenta si hay piezas enemigas o aliadas interponiéndose ni si el rey está en jaque
export function getAllPossiblePositions(board: string[][], row: number, col: number): {row: number, col: number}[] {
    const piece = board[row][col];
    const pieceColor = piece === piece.toUpperCase() ? "white" : "black";
    
    const pieceType = piece.toLowerCase();
    const handler = moveHandlers[pieceType];
    if (handler) return handler(board, row, col, pieceColor);
    return [];
}

// Una posición válida es aquella en la que primero existe en la lista de posiciones posibles y además no hay ninguna pieza interponiéndose ni el rey está en jaque
export function isValidMove(board: string[][], from: {row: number, col: number}, to: {row: number, col: number}): boolean {
    const piece = board[from.row][from.col];
    const pieceColor = piece === piece.toUpperCase() ? "white" : "black";

    const pieceType = piece.toLowerCase();
    const handler = validationHandlers[pieceType];
    if (handler) return handler(board, from, to, pieceColor);
    return false;
}