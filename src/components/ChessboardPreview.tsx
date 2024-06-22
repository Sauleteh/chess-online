import { BoardInfo } from "../types/BoardInfo.ts";
import "./css/ChessboardPreview.css";
import * as PieceUtils from "../utils/PieceUtils.ts";

interface ChessboardPreviewProps {
    boardInfo: BoardInfo;
}

function ChessboardPreview({ boardInfo }: ChessboardPreviewProps) {
    return (
        <div className="board-prev-principal">
        {boardInfo?.board.map((row, rowIndex) => (
            <div key={rowIndex} className="chessboard-prev-row">
                {row.map((piece, pieceIndex) => (
                    <div key={pieceIndex}
                        className={(pieceIndex + rowIndex) % 2 === 0 ? "chessboard-prev-piece prev-light" : "chessboard-prev-piece prev-dark"}>
                        <img src={PieceUtils.getPieceImage(piece)}/>
                    </div>
                ))}
            </div>
        ))}
        </div>
    );
}

export default ChessboardPreview;