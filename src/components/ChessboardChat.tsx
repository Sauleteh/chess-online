import "./css/ChessboardChat.css"
import socket from "../WebSocket.tsx"
import * as Constants from "../utils/Constants.ts"
import { ChatMessage } from "../types/ChatMessage.ts"

interface ChessboardChatProps {
    chatMessages: ChatMessage[] | undefined;
    boardId: number;
}

function ChessboardChat({ chatMessages, boardId }: ChessboardChatProps) {
    function onInputChat(event: React.KeyboardEvent<HTMLInputElement>) {
        const input = document.querySelector("#chat-input") as HTMLInputElement;
        
        if (input.value.length > 100) {
            input.value = input.value.substring(0, 100);
        }
        else if (input.value.length === 0) return;
        else if (event.key === "Enter" && !event.shiftKey) {
            sendMessage();
            input.value = "";
        }
    }

    function sendMessage() {
        console.log("Enviar mensaje");
        const input = document.querySelector("#chat-input") as HTMLInputElement;
        if (input.value.length === 0) return;

        // Si alguna palabra del mensaje es demasiado larga, cortarla
        let hasLargeWords = true;

        while (hasLargeWords) {
            hasLargeWords = false;
            const words = input.value.split(" ");
            for (let i = 0; i < words.length; i++) {
                if (words[i].length > 27) {
                    words[i] = words[i].substring(0, 27) + " " + words[i].substring(27);
                    hasLargeWords = true;
                }
            }
            input.value = words.join(" ");
        }

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

        input.value = "";
    }

    return (
        <div className="chat-panel">
            <div className="chat-messages">
                {chatMessages?.map((chatMessage, i) => (
                    <div key={i} className={"chat-message " + ((i % 2 === 0) ? "chat-message-even" : "chat-message-odd")}>
                        <span className="chat-username">{chatMessage.name}</span>:&nbsp;
                        <span className="chat-content">{chatMessage.message}</span>
                    </div>
                ))}
            </div>
            <div className="chat-input-container">
                <input type="text" id="chat-input" className="chat-input" onKeyDown={(event) => onInputChat(event)} placeholder="Escribe un mensaje..."/>
                <button className="chat-send" onClick={sendMessage}>Enviar</button>
            </div>
        </div>
    )
}

export default ChessboardChat