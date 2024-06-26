import { BoardInfo } from "../types/BoardInfo.ts";
import "./css/ChessboardGame.css";
import { useState } from "react";
import * as PieceUtils from "../utils/PieceUtils.ts";
import * as Constants from "../utils/Constants.ts";
import socket from "../WebSocket.tsx";

interface ChessboardGameProps {
    boardInfo: BoardInfo | undefined;
}

function ChessboardGame({ boardInfo }: ChessboardGameProps) {
    const [isDragging, setIsDragging] = useState<boolean>(false); // Indica si se está arrastrando una pieza
    const [draggingSourcePos, setDraggingSourcePos] = useState<{row: number, col: number}>({row: -1, col: -1}); // Posición inicial de la pieza que se está arrastrando
    const [draggingTarget, setDraggingTarget] = useState<HTMLDivElement | null>(null); // Elemento que está siendo arrastrado
    const [clickState, setClickState] = useState<boolean>(false); // Indica si se ha seleccionado una pieza

    const ghostSquare = document.querySelector("#chessboard-drag-square") as HTMLElement;
    const squareSize = parseInt(getComputedStyle(document.body).getPropertyValue('--square-size').replace('px', ''));

    function onDragStart(event: React.MouseEvent<HTMLDivElement>, row: number, col: number) {
        event.preventDefault();
        if (!selectedPieceIsPlayer(boardInfo!.board[row][col]) || !isPlayerTurn()) return;
        if (boardInfo?.white === null || boardInfo?.black === null) return; // Si no hay jugadores, no se puede mover ninguna pieza

        // Si anteriormente se ha seleccionado una pieza, borrar los cuadrados que indican los posibles movimientos
        if (clickState) document.querySelectorAll(".possible-move-square").forEach(square => square.remove());

        ghostSquare.innerHTML = event.currentTarget.innerHTML;
        (event.currentTarget.children[0] as HTMLImageElement).style.opacity = "0";
        
        if (boardInfo?.board[row][col] !== " ") {
            setIsDragging(true);
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
        console.log(event.clientX, event.clientY, squareSize / 2);
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

                // Actualizamos el movimiento en el servidor
                const message = JSON.stringify({
                    type: "game",
                    name: localStorage.getItem(Constants.STORAGE_KEYS.USERNAME),
                    pin: localStorage.getItem(Constants.STORAGE_KEYS.PIN),
                    content: {
                        id: boardInfo?.id,
                        from: draggingSourcePos,
                        to: {row, col}
                    }
                });
                socket.send(message);
            }

            (draggingTarget?.children[0] as HTMLImageElement).style.opacity = "1";
            setIsDragging(false);
            setDraggingSourcePos({row: -1, col: -1});
            setDraggingTarget(null);
            setClickState(false);

            // Borramos los cuadrados que indican los movimientos posibles
            document.querySelectorAll(".possible-move-square").forEach(square => square.remove());
        }
    }

    function onClick(event: React.MouseEvent<HTMLDivElement>, row: number, col: number) {
        if (isDragging) return;
        if (!clickState && !selectedPieceIsPlayer(boardInfo!.board[row][col])) return; // No se puede seleccionar las piezas que no son tuyas
        if (boardInfo?.white === null || boardInfo?.black === null) return; // Si no hay jugadores, no se puede mover ninguna pieza
        if (!isPlayerTurn()) return;
        
        if (!clickState || (clickState && selectedPieceIsPlayer(boardInfo!.board[row][col]))) {
            // Si anteriormente se ha seleccionado una pieza del jugador, borrar los cuadrados que indican los posibles movimientos
            if (clickState) document.querySelectorAll(".possible-move-square").forEach(square => square.remove());

            if (boardInfo?.board[row][col] !== " ") {
                setClickState(true);
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
        else {
            // Si el movimiento es válido, mover la pieza
            if (PieceUtils.isValidMove(boardInfo!.board, draggingSourcePos, {row, col})) {
                boardInfo!.board[row][col] = boardInfo!.board[draggingSourcePos.row][draggingSourcePos.col];
                boardInfo!.board[draggingSourcePos.row][draggingSourcePos.col] = " ";

                // Actualizamos el movimiento en el servidor
                const message = JSON.stringify({
                    type: "game",
                    name: localStorage.getItem(Constants.STORAGE_KEYS.USERNAME),
                    pin: localStorage.getItem(Constants.STORAGE_KEYS.PIN),
                    content: {
                        id: boardInfo?.id,
                        from: draggingSourcePos,
                        to: {row, col}
                    }
                });
                socket.send(message);
            }

            // Reseteamos el estado de la pieza seleccionada
            (draggingTarget?.children[0] as HTMLImageElement).style.opacity = "1";
            setClickState(false);
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

    // Retorna true si la pieza seleccionada es del jugador (si eres espectador, no puedes mover las piezas y, si eres jugador, solo puedes mover las tuyas)
    function selectedPieceIsPlayer(piece: string) {
        if (piece === " ") return false;
        return (piece === piece.toLowerCase() ? boardInfo?.black : boardInfo?.white) === localStorage.getItem(Constants.STORAGE_KEYS.USERNAME);
    }

    function isPlayerTurn() {
        return boardInfo?.turn === localStorage.getItem(Constants.STORAGE_KEYS.USERNAME);
    }

    return (
        <div style={{display: "flex", flexDirection: boardInfo?.black === localStorage.getItem(Constants.STORAGE_KEYS.USERNAME) ? "column-reverse" : "column"}}>
            <div id="chessboard-drag-square" className="chessboard-piece"></div>

            {boardInfo?.board.map((row, rowIndex) => (
                <div key={rowIndex} className="chessboard-row">
                    {row.map((piece, pieceIndex) => (
                        <div key={pieceIndex}
                            onDragStart={!boardInfo.isGameOver ? (event) => onDragStart(event, rowIndex, pieceIndex) : undefined}
                            onMouseMove={!boardInfo.isGameOver ? (event) => onMouseMove(event) : undefined}
                            onMouseUp={!boardInfo.isGameOver ? () => onMouseUp(rowIndex, pieceIndex) : undefined}
                            onClick={!boardInfo.isGameOver ? (event) => onClick(event, rowIndex, pieceIndex) : undefined}
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