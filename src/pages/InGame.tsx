import socket from "../WebSocket.tsx"
import { useParams } from "react-router-dom";
import { useState } from 'react';
import * as Constants from "../Constants.ts"
import ChessboardGame from "../components/ChessboardGame.tsx";
import ChessboardChat from "../components/ChessboardChat.tsx";
import { ChatMessage } from "../types/ChatMessage.ts";

function InGame() {
    const { id } = useParams();
    const [messages, setMessages] = useState<ChatMessage[]>([]);

    socket.onmessage = function (event) {
        const data = JSON.parse(event.data);
        console.log("Home");
        console.log(data);

        if (data.type === "login" && window.location.pathname !== "/login" && data.code !== 0) window.location.href = "/login"; // Si el usuario no es válido, redirigir a la página de login (mensaje recibido por comprobación de credenciales)
        else if (data.type === "login" && window.location.pathname !== "/login" && data.code === 0) { // Si el usuario es válido, solicitar observar la partida y el chat
            requestGame();
            requestChat();
        }
        else if (data.type === "game" && window.location.pathname !== "/login" && data.code === 0) { // Si se recibe la información de la partida, mostrarla
            console.log("Partida:");
            console.log(data.content);

            // TODO: Mostrar la partida

            const whitePlayerName = document.getElementById("whitePlayerName") as HTMLSpanElement;
            const blackPlayerName = document.getElementById("blackPlayerName") as HTMLSpanElement;
            const whiteButton = document.getElementById("whiteButton") as HTMLSpanElement;
            const blackButton = document.getElementById("blackButton") as HTMLSpanElement;

            whitePlayerName.innerText = data.content.white;
            blackPlayerName.innerText = data.content.black;

            if (data.content.white === null) {
                whitePlayerName.innerText = "Esperando jugador...";
                whiteButton.style.display = "block";

                if (data.content.black === localStorage.getItem(Constants.STORAGE_KEYS.USERNAME)) whiteButton.innerHTML = "Cambiar a blancas"; // Si el jugador es negras y no hay jugador en blancas...
                else whiteButton.innerHTML = "Unirse a partida"; // Si el usuario es solo observador, mostrar botón para unirse a la partida
            }
            else whiteButton.style.display = "none";

            if (data.content.black === null) {
                blackPlayerName.innerText = "Esperando jugador...";
                blackButton.style.display = "block";

                if (data.content.white === localStorage.getItem(Constants.STORAGE_KEYS.USERNAME)) blackButton.innerHTML = "Cambiar a negras"; // Si el jugador es blancas y no hay jugador en negras...
                else blackButton.innerHTML = "Unirse a partida"; // Si el usuario es solo observador, mostrar botón para unirse a la partida
            }
            else blackButton.style.display = "none";
        }
        else if (data.type === "chat" && window.location.pathname !== "/login" && data.code === 0) { // Si se recibe un mensaje de chat, mostrarlo
            console.log("Mensaje de chat:");
            console.log(data.content);
            setMessages(data.content.messages);
        }
    };

    function requestGame() {
        const message = JSON.stringify({
            type: "game",
            name: localStorage.getItem(Constants.STORAGE_KEYS.USERNAME),
            pin: localStorage.getItem(Constants.STORAGE_KEYS.PIN),
            content: {
                id: parseInt(id!),
                from: null,
                to: null
            }
        });
        socket.send(message);
    }

    function requestJoin(color: string) {
        const message = JSON.stringify({
            type: "join",
            name: localStorage.getItem(Constants.STORAGE_KEYS.USERNAME),
            pin: localStorage.getItem(Constants.STORAGE_KEYS.PIN),
            content: {
                id: parseInt(id!),
                color: color
            }
        });
        socket.send(message);
    }

    function requestChat() {
        const message = JSON.stringify({
            type: "chat",
            name: localStorage.getItem(Constants.STORAGE_KEYS.USERNAME),
            pin: localStorage.getItem(Constants.STORAGE_KEYS.PIN),
            content: {
                id: parseInt(id!),
                message: null
            }
        });
        socket.send(message);
    }

    return (
        <div>
            <h1>InGame: Estás en la partida {id}</h1>
            <ChessboardGame/>
            <label>Blancas: <span id="whitePlayerName"></span></label><button style={{display: 'none'}} id="whiteButton" onClick={() => requestJoin("white")}></button><br/>
            <label>Negras: <span id="blackPlayerName"></span></label><button style={{display: 'none'}} id="blackButton" onClick={() => requestJoin("black")}></button>
            <ChessboardChat chatMessages={messages} boardId={parseInt(id!)}/>
        </div>
    )
}

export default InGame