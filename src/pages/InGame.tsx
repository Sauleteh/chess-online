import socket from "../WebSocket.tsx"
import { useParams } from "react-router-dom";
import * as Constants from "../Constants.ts"

function InGame() {
    const { id } = useParams();

    socket.onmessage = function (event) {
        const data = JSON.parse(event.data);
        console.log("Home");
        console.log(data);

        if (data.type === "login" && window.location.pathname !== "/login" && data.code !== 0) window.location.href = "/login"; // Si el usuario no es válido, redirigir a la página de login (mensaje recibido por comprobación de credenciales)
        else if (data.type === "login" && window.location.pathname !== "/login" && data.code === 0) requestGame(); // Si el usuario es válido, solicitar observar la partida
        else if (data.type === "game" && window.location.pathname !== "/login" && data.code === 0) { // Si se recibe la información de la partida, mostrarla
            console.log("Partida:");
            console.log(data.content);
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

    return (
        <div>
            <h1>InGame: Estás en la partida {id}</h1>
        </div>
    )
}

export default InGame