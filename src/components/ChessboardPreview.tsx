import { BoardInfo } from "../types/BoardInfo.ts";
import "./ChessboardPreview.css";

interface ChessboardPreviewProps {
    boardInfo: BoardInfo;
}

function ChessboardPreview({ boardInfo }: ChessboardPreviewProps) {
    function joinGame() {
        console.log("Unirse a la partida " + boardInfo.id);
        window.location.href = "/board/" + boardInfo.id;
    }

    return (
    <div>
        <label>Tablero de ajedrez {boardInfo.white} {boardInfo.black}</label>
        <button onClick={joinGame}>Unirse</button>
    </div>
    );
}

export default ChessboardPreview;