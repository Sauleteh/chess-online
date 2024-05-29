import { BoardInfo } from "../types/BoardInfo.ts";
import "./css/ChessboardGame.css";
import { useState } from "react";
import * as PieceUtils from "../utils/PieceUtils.ts";

interface ChessboardGameProps {
    boardInfo: BoardInfo | undefined;
}

function ChessboardGame({ boardInfo }: ChessboardGameProps) {
    const [isDragging, setisDragging] = useState<boolean>(false); // Indica si se está arrastrando una pieza
    const [draggingSourcePos, setDraggingSourcePos] = useState<{row: number, col: number}>({row: -1, col: -1}); // Posición inicial de la pieza que se está arrastrando
    const [draggingTarget, setDraggingTarget] = useState<HTMLDivElement | null>(null); // Elemento que está siendo arrastrado

    const ghostSquare = document.querySelector("#chessboard-drag-square") as HTMLElement;
    const squareSize = parseInt(getComputedStyle(document.body).getPropertyValue('--square-size').replace('px', ''));

    function onDragStart(event: React.MouseEvent<HTMLDivElement>, row: number, col: number) {
        event.preventDefault();

        ghostSquare.innerHTML = event.currentTarget.innerHTML;
        (event.currentTarget.children[0] as HTMLImageElement).style.opacity = "0";
        
        if (boardInfo?.board[row][col] !== " ") {
            setisDragging(true);
            setDraggingSourcePos({row, col});
            setDraggingTarget(event.currentTarget);

            // Dibujar los posibles movimientos de la pieza
            const moves = PieceUtils.getPossiblePositions(boardInfo!.board, row, col);
            const rows = document.querySelectorAll(".chessboard-row") as NodeListOf<HTMLElement>;
            moves.forEach(move => {
                rows[move.row].children[move.col].insertBefore(createPossibleMoveSquare(), rows[move.row].children[move.col].firstChild);
            });
        }
    }

    function onMouseMove(event: React.MouseEvent<HTMLDivElement>) {
        // Movemos la posición del cuadrado fantasma
        ghostSquare.style.top = event.clientY - squareSize / 2 + 'px';
        ghostSquare.style.left = event.clientX - squareSize / 2 + 'px';
    }

    function onMouseUp(row: number, col: number) {
        if (isDragging) {
            console.log("Dragged piece", boardInfo?.board[draggingSourcePos.row][draggingSourcePos.col], "from", draggingSourcePos, "to", {row, col});
            ghostSquare.innerHTML = "";

            // Si el movimiento es válido, mover la pieza
            if (PieceUtils.isValidMove(boardInfo!.board, draggingSourcePos, {row, col})) {
                boardInfo!.board[row][col] = boardInfo!.board[draggingSourcePos.row][draggingSourcePos.col];
                boardInfo!.board[draggingSourcePos.row][draggingSourcePos.col] = " ";
            }

            (draggingTarget?.children[0] as HTMLImageElement).style.opacity = "1";
            setisDragging(false);
            setDraggingSourcePos({row: -1, col: -1});
            setDraggingTarget(null);

            // Borramos los cuadrados que indican los movimientos posibles
            document.querySelectorAll(".possible-move-square").forEach(square => square.remove());
        }
    }

    function createPossibleMoveSquare() {
        const selectionSquare = document.createElement("div");
        selectionSquare.classList.add("possible-move-square");
        return selectionSquare;
    }

    return (
        <div>
            <div id="chessboard-drag-square" className="chessboard-piece"></div>

            {boardInfo?.board.map((row, rowIndex) => (
                <div key={rowIndex} className="chessboard-row">
                    {row.map((piece, pieceIndex) => (
                        <div key={pieceIndex}
                            onDragStart={(event) => onDragStart(event, rowIndex, pieceIndex)}
                            onMouseMove={(event) => onMouseMove(event)}
                            onMouseUp={() => onMouseUp(rowIndex, pieceIndex)}
                            className={(pieceIndex + rowIndex) % 2 === 0 ? "chessboard-piece light" : "chessboard-piece dark"}>
                            <img src={PieceUtils.getPieceImage(piece)}/>
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
}

export default ChessboardGame;