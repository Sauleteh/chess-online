import socket from "../WebSocket.tsx"
import { useParams } from "react-router-dom";
import { useState } from 'react';
import * as Constants from "../utils/Constants.ts"
import ChessboardGame from "../components/ChessboardGame.tsx";
import ChessboardChat from "../components/ChessboardChat.tsx";
import { ChatMessage } from "../types/ChatMessage.ts";
import { BoardInfo } from "../types/BoardInfo.ts";
import "./css/InGame.css";

function InGame() {
    const { id } = useParams();
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [boardInfo, setBoardInfo] = useState<BoardInfo>();

    socket.onmessage = function (event) {
        const data = JSON.parse(event.data);
        console.log("Home");
        console.log(data);

        if (data.type === "login" && window.location.pathname !== Constants.BASE_URL + "/login" && data.code !== 0) window.location.href = Constants.BASE_URL + "/login"; // Si el usuario no es válido, redirigir a la página de login (mensaje recibido por comprobación de credenciales)
        else if (data.type === "login" && window.location.pathname !== Constants.BASE_URL + "/login" && data.code === 0) { // Si el usuario es válido, solicitar observar la partida y el chat
            requestGame();
            requestChat();
        }
        else if (data.type === "game" && window.location.pathname !== Constants.BASE_URL + "/login" && data.code === 0) { // Si se recibe la información de la partida, mostrarla
            console.log("Partida:");
            console.log(data.content);
            setBoardInfo(data.content);

            const whitePlayerName = document.getElementById("ingame-white-player-name") as HTMLSpanElement;
            const blackPlayerName = document.getElementById("ingame-black-player-name") as HTMLSpanElement;
            const whiteButton = document.getElementById("ingame-white-button") as HTMLSpanElement;
            const blackButton = document.getElementById("ingame-black-button") as HTMLSpanElement;

            whitePlayerName.innerText = data.content.white;
            blackPlayerName.innerText = data.content.black;

            if (data.content.white === null) {
                whitePlayerName.innerText = "Esperando jugador...";
                whiteButton.style.display = "flex";

                if (data.content.black === localStorage.getItem(Constants.STORAGE_KEYS.USERNAME)) whiteButton.innerHTML = "Cambiar a blancas"; // Si el jugador es negras y no hay jugador en blancas...
                else whiteButton.innerHTML = "Unirse a partida"; // Si el usuario es solo observador, mostrar botón para unirse a la partida
            }
            else whiteButton.style.display = "none";

            if (data.content.black === null) {
                blackPlayerName.innerText = "Esperando jugador...";
                blackButton.style.display = "flex";

                if (data.content.white === localStorage.getItem(Constants.STORAGE_KEYS.USERNAME)) blackButton.innerHTML = "Cambiar a negras"; // Si el jugador es blancas y no hay jugador en negras...
                else blackButton.innerHTML = "Unirse a partida"; // Si el usuario es solo observador, mostrar botón para unirse a la partida
            }
            else blackButton.style.display = "none";

            if (data.content.turn === data.content.white) {
                whitePlayerName.style.fontWeight = "bold";
                blackPlayerName.style.fontWeight = "normal";
            }
            else if (data.content.turn === data.content.black) {
                whitePlayerName.style.fontWeight = "normal";
                blackPlayerName.style.fontWeight = "bold";
            }
            else {
                whitePlayerName.style.fontWeight = "normal";
                blackPlayerName.style.fontWeight = "normal";
            }
        }
        else if (data.type === "chat" && window.location.pathname !== Constants.BASE_URL + "/login" && data.code === 0) { // Si se recibe un mensaje de chat, mostrarlo
            console.log("Mensaje de chat:");
            console.log(data.content);
            setMessages(data.content.messages);
        }
        else if (data.type === "game" && window.location.pathname !== Constants.BASE_URL + "/login" && data.code === 1001) { // Si se recibe la confirmación de que se ha borrado la partida, redirigir a la página de inicio
            window.location.href = Constants.BASE_URL + "/home";
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
            <h1 className="ingame-title">Te encuentras en la sala Nº {id}</h1>
            <div className="ingame-content">
                <div className="ingame-game-container" style={{display: "flex", flexDirection: boardInfo?.black === localStorage.getItem(Constants.STORAGE_KEYS.USERNAME) ? "column-reverse" : "column"}}>
                    <div className="ingame-black-player-container">
                        <span id="ingame-black-player-name"></span>
                        <button id="ingame-black-button" onClick={() => requestJoin("black")}></button>
                    </div>
                    <div className="ingame-chessboard"><ChessboardGame boardInfo={boardInfo}/></div>
                    <div className="ingame-white-player-container">
                        <span id="ingame-white-player-name"></span>
                        <button id="ingame-white-button" onClick={() => requestJoin("white")}></button>
                    </div>
                </div>
                <div className="ingame-chat"><ChessboardChat chatMessages={messages} boardId={parseInt(id!)}/></div>
            </div>
        </div>
    )
}

export default InGame