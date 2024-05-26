import socket from "../WebSocket.tsx"
import * as Constants from "../utils/Constants.ts"
import ChessboardPreview from "../components/ChessboardPreview.tsx"
import { useState } from 'react';
import { BoardInfo } from "../types/BoardInfo.ts";

function Home() {
    const [chessboards, setChessboards] = useState<BoardInfo[]>([]);

    socket.onmessage = function (event) {
        const data = JSON.parse(event.data);
        console.log("Home");
        console.log(data);

        if (data.type === "login" && window.location.pathname !== "/login" && data.code !== 0) window.location.href = "/login"; // Si el usuario no es válido, redirigir a la página de login (mensaje recibido por comprobación de credenciales)
        else if (data.type === "login" && window.location.pathname !== "/login" && data.code === 0) requestBoards(); // Si el usuario es válido, solicitar la lista de tableros activos (mensaje recibido por comprobación de credenciales)
        else if (data.type === "seek" && window.location.pathname !== "/login" && data.code === 0) { // Si se recibe una lista de tableros activos, mostrarla
            console.log("Tableros activos:");
            console.log(data.content);
            setChessboards(data.content);
        }
        else if (data.type === "create" && window.location.pathname !== "/login" && data.code === 0) { // Si se recibe un mensaje satisfactorio de creación de tablero, redirigir a la página del tablero creado
            console.log("Tablero creado");
            window.location.href = "/board/" + data.content.id;
        }
    };

    function requestBoards() {
        const message = JSON.stringify({
            type: "seek",
            name: localStorage.getItem(Constants.STORAGE_KEYS.USERNAME),
            pin: localStorage.getItem(Constants.STORAGE_KEYS.PIN),
            content: null
        });
        socket.send(message);
    }

    function createNewBoard() {
        const message = JSON.stringify({
            type: "create",
            name: localStorage.getItem(Constants.STORAGE_KEYS.USERNAME),
            pin: localStorage.getItem(Constants.STORAGE_KEYS.PIN),
            content: null
        });
        socket.send(message);
    }

    return (
        <>
        <h1>Ajedrez Online</h1>
        <label>Tableros activos</label>
        <ul>
            {chessboards.map((chessboard) => (
                <li key={chessboard.id}>
                    <ChessboardPreview boardInfo={chessboard} />
                </li>
            ))}
        </ul>
        <button onClick={createNewBoard}>Crear nuevo tablero</button>
        </>
    )
}

export default Home