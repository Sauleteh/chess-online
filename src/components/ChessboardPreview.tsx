import { BoardInfo } from "../types/BoardInfo.ts";
import "./ChessboardPreview.css";

interface ChessboardPreviewProps {
    boardInfo: BoardInfo;
}

function ChessboardPreview({ boardInfo }: ChessboardPreviewProps) {
  return (
    <div>
        <label>Tablero de ajedrez {boardInfo.black}</label>
        <button>Unirse</button>
    </div>
  );
}

export default ChessboardPreview;