import * as PieceMovement from "./PieceMovement.ts";

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

// Verifica si la pieza es del mismo color que el jugador
export function isPieceSameColor(piece: string, pieceColor: string) {
    return piece === (pieceColor === "white" ? piece.toUpperCase() : piece.toLowerCase());
}

// Todas las posiciones posibles son aquellas donde la pieza puede moverse
export function getPossiblePositions(board: string[][], row: number, col: number): {row: number, col: number}[] {
    const piece = board[row][col];
    const pieceColor = piece === piece.toUpperCase() ? "white" : "black";
    
    const pieceType = piece.toLowerCase();
    const handler = moveHandlers[pieceType];
    if (handler) return handler(board, row, col, pieceColor);
    return [];
}

// Una posición válida es aquel movimiento que está dentro de las posiciones posibles
export function isValidMove(board: string[][], from: {row: number, col: number}, to: {row: number, col: number}): boolean {
    const possiblePositions = getPossiblePositions(board, from.row, from.col);
    for (const position of possiblePositions) {
        if (position.row === to.row && position.col === to.col) {
            return true;
        }
    }
    return false;
}