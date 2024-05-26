import "./ChessboardChat.css"
import socket from "../WebSocket.tsx"
import * as Constants from "../Constants.ts"
import { ChatMessage } from "../types/ChatMessage.ts"

interface ChessboardChatProps {
    chatMessages: ChatMessage[] | undefined;
    boardId: number;
}

function ChessboardChat({ chatMessages, boardId }: ChessboardChatProps) {
    function sendMessage() {
        console.log("Enviar mensaje");
        const input = document.querySelector(".chat-input") as HTMLInputElement;

        const message = JSON.stringify({
            type: "chat",
            name: localStorage.getItem(Constants.STORAGE_KEYS.USERNAME),
            pin: localStorage.getItem(Constants.STORAGE_KEYS.PIN),
            content: {
                id: boardId,
                message: input.value
            }
        });
        socket.send(message);
    }

    return (
        <div>
            <h1>ChessboardChat</h1>
            <div className="chat-messages">
                {chatMessages?.map((chatMessage, i) => (
                    <div key={i} className="chat-message">
                        <span className="chat-username">{chatMessage.name}</span>:&nbsp;
                        <span className="chat-content">{chatMessage.message}</span>
                    </div> 
                ))}
            </div>
            <input type="text" className="chat-input" placeholder="Escribe un mensaje..."/>
            <button className="chat-send" onClick={sendMessage}>Enviar</button>
        </div>
    )
}

export default ChessboardChat