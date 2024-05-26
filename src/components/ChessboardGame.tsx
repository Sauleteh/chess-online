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

    const ghostSquare = document.querySelector(".chessboard-drag-square") as HTMLElement;
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
            const moves = PieceUtils.getAllPossiblePositions(boardInfo!.board, row, col);
            const rows = document.querySelectorAll(".chessboard-row") as NodeListOf<HTMLElement>;
            moves.forEach(move => {
                rows[move.row].children[move.col].classList.add("possible-move");
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

            // TODO: Validar si el movimiento es válido

            (draggingTarget?.children[0] as HTMLImageElement).style.opacity = "1";
            setisDragging(false);
            setDraggingSourcePos({row: -1, col: -1});
            setDraggingTarget(null);

            const squares = document.querySelectorAll(".chessboard-piece") as NodeListOf<HTMLElement>;
            squares.forEach(square => square.classList.remove("possible-move"));
        }
    }

    return (
        <div>
            <div className="chessboard-piece chessboard-drag-square"></div>

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