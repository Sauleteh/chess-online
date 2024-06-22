import socket from "../WebSocket.tsx"
import * as Constants from "../utils/Constants.ts"
import ChessboardPreview from "../components/ChessboardPreview.tsx"
import { useState } from 'react';
import { BoardInfo } from "../types/BoardInfo.ts";
import "./css/Home.css";
import PlusIcon from "../assets/plus-solid.svg";

function Home() {
    const [chessboards, setChessboards] = useState<BoardInfo[]>([]);

    socket.onmessage = function (event) {
        const data = JSON.parse(event.data);
        console.log("Home");
        console.log(data);

        if (data.type === "login" && window.location.pathname !== Constants.BASE_URL + "/login" && data.code !== 0) window.location.href = Constants.BASE_URL + "/login"; // Si el usuario no es válido, redirigir a la página de login (mensaje recibido por comprobación de credenciales)
        else if (data.type === "login" && window.location.pathname !== Constants.BASE_URL + "/login" && data.code === 0) requestBoards(); // Si el usuario es válido, solicitar la lista de tableros activos (mensaje recibido por comprobación de credenciales)
        else if (data.type === "seek" && window.location.pathname !== Constants.BASE_URL + "/login" && data.code === 0) { // Si se recibe una lista de tableros activos, mostrarla
            console.log("Tableros activos:");
            console.log(data.content);
            setChessboards(data.content);
        }
        else if (data.type === "create" && window.location.pathname !== Constants.BASE_URL + "/login" && data.code === 0) { // Si se recibe un mensaje satisfactorio de creación de tablero, redirigir a la página del tablero creado
            console.log("Tablero creado");
            window.location.href = Constants.BASE_URL + "/board/" + data.content.id;
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

    function joinGame(boardId: number) {
        if (mouseMoving) { // Si se ha movido el ratón al hacer click, no realizar ninguna acción
            mouseMoving = false;
            return;
        }

        console.log("Unirse a la partida " + boardId);
        window.location.href = Constants.BASE_URL + "/board/" + boardId;
    }

    /* Div scrollable con el ratón: https://stackoverflow.com/questions/28576636/mouse-click-and-drag-instead-of-horizontal-scroll-bar-to-view-full-content-of-c */
    let mouseDown = false;
    let mouseMoving = false;
    let startX: number, scrollLeft: number;

    function startDragging(event: React.MouseEvent<HTMLDivElement>) {
        mouseDown = true;
        startX = event.pageX - event.currentTarget.offsetLeft;
        scrollLeft = event.currentTarget.scrollLeft;
    }

    function stopDragging() {
        mouseDown = false;
    }

    function move(event: React.MouseEvent<HTMLDivElement>) {
        event.preventDefault();
        if(!mouseDown) return;

        mouseMoving = true;
        const x = event.pageX - event.currentTarget.offsetLeft;
        const scroll = x - startX;
        event.currentTarget.scrollLeft = scrollLeft - scroll;
    }
    /* Fin de la función de scroll */

    return (
        <>
        <h1 className="home-title">¡Hola {localStorage.getItem(Constants.STORAGE_KEYS.USERNAME)}! Estos son los tableros actualmente activos:</h1>
        <div className="home-chessboard-list-container"
            onMouseMove={(event) => move(event)}
            onMouseDown={(event) => startDragging(event)}
            onMouseUp={() => stopDragging()}
            onMouseLeave={() => stopDragging()}>
            <ul className="home-chessboard-list">
                {chessboards.map((chessboard) => (
                    <li key={chessboard.id} className="home-chessboard-list-item">
                        <div className="home-chessboard-board" onClick={() => joinGame(chessboard.id)}><ChessboardPreview boardInfo={chessboard} /></div>
                        <div className="home-chessboard-info">
                            <span className="home-white-player">{chessboard.white === null ? "(...)" : chessboard.white}</span>
                            &nbsp;vs.&nbsp;
                            <span className="home-black-player">{chessboard.black === null ? "(...)" : chessboard.black}</span>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
        <p className="home-explaining-text">Para entrar en un tablero, haz click sobre él. Si la lista es muy larga, arrastra el ratón para moverla.</p>
        <div className="home-new-board-button-container">
            <button className="home-new-board-button" onClick={createNewBoard}>
                <img src={PlusIcon} className="home-new-board-button-icon"/>
                <span className="home-new-board-button-text">Nuevo tablero</span>
            </button>
        </div>
        </>
    )
}

export default Home