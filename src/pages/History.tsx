import "./css/History.css";
import socket from "../WebSocket.tsx";
import { useState } from 'react';
import * as Constants from "../utils/Constants.ts";
import { HistoryInfo } from "../types/HistoryInfo.ts";

function History() {
    const [history, setHistory] = useState<HistoryInfo[]>([]);
    socket.onmessage = function (event) {
        const data = JSON.parse(event.data);
        console.log("History");
        console.log(data);

        if (data.type === "login" && window.location.pathname !== Constants.BASE_URL + "/login" && data.code !== 0) window.location.href = Constants.BASE_URL + "/login"; // Si el usuario no es válido, redirigir a la página de login (mensaje recibido por comprobación de credenciales)
        else if (data.type === "login" && window.location.pathname !== Constants.BASE_URL + "/login" && data.code === 0) requestHistory(); // Si el usuario es válido, solicitar el historial de partidas (mensaje recibido por comprobación de credenciales)
        else if (data.type === "history" && window.location.pathname !== Constants.BASE_URL + "/login" && data.code === 0) { // Si se recibe el historial, se muestra
            console.log("Historial:");
            console.log(data.content);
            setHistory(data.content);
        }
    };

    function requestHistory() {
        const message = JSON.stringify({
            type: "history",
            name: localStorage.getItem(Constants.STORAGE_KEYS.USERNAME),
            pin: localStorage.getItem(Constants.STORAGE_KEYS.PIN),
            content: null
        });
        socket.send(message);
    }

    return (
        <div>
            <h1>Historial de partidas</h1>
            <ul>
                <li>
                    <span>
                        <span>Jugador blancas</span>
                        &nbsp;vs&nbsp;
                        <span>Jugador negras</span>
                    </span>
                </li>
                {history.map((game, index) => (
                    <li key={index}>
                        <span>
                            <span>{game.date}</span>&nbsp;
                            <span className={game.winner === game.white ? "history-winner" : "history-loser"}>{game.white}</span>
                            &nbsp;vs&nbsp;
                            <span className={game.winner === game.black ? "history-winner" : "history-loser"}>{game.black}</span>
                        </span>
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default History