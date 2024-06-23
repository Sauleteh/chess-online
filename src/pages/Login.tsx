import { useEffect } from "react";
import socket from "../WebSocket.tsx"
import * as Constants from "../utils/Constants.ts"
import "./css/Login.css"

function Login() {
    socket.onmessage = function (event) {
        const data = JSON.parse(event.data);
        console.log("Login");
        console.log(data);

        const status = document.getElementById("login-status") as HTMLLabelElement;

        if (data.type === "login") {
            if (data.code === 0) {
                if (data.content !== null) { // Si el usuario es válido (y no es un mensaje de comprobación de credenciales), guardamos el nombre y el PIN en el almacenamiento local
                    localStorage.setItem(Constants.STORAGE_KEYS.USERNAME, data.content.name);
                    localStorage.setItem(Constants.STORAGE_KEYS.PIN, data.content.pin);
                }
                window.location.href = Constants.BASE_URL + "/";
            }
            else {
                status.innerText = "Error: " + data.content;
                status.style.color = "red";
            }
        }
        else {
            status.innerText = "Error al iniciar sesión, inténtalo de nuevo";
            status.style.color = "orange";
        }
    };
    
    function sendUser() {
        const username = document.getElementById("login-name") as HTMLInputElement;
        const pin = document.getElementById("login-pin") as HTMLInputElement;
        const status = document.getElementById("login-status") as HTMLLabelElement;

        if (username.value === "" || pin.value === "") {
            status.innerText = "Por favor, rellena todos los campos";
            status.style.color = "royalblue";
            return;
        }

        const message = JSON.stringify({
            type: "login",
            name: username.value,
            pin: pin.value,
            content: null
        });
        socket.send(message);

        status.innerText = "Comprobando credenciales...";
        status.style.color = "inherit";
    }

    useEffect(() => {
        const username = document.getElementById("login-name") as HTMLInputElement;
        const pin = document.getElementById("login-pin") as HTMLInputElement;

        username.addEventListener("input", function() {
            username.value = username.value.replace(/\W/g, ""); // \W = [^a-zA-Z0-9_]
        });

        pin.addEventListener("input", function() {
            pin.value = pin.value.replace(/\D/g, ""); // \D = [^0-9]
        });
    });

    return (
        <>
        <div className="login-panel">
            <label className="login-name-text">Nombre</label>
            <input id="login-name" type="text" size={18} maxLength={12} />
            <label className="login-pin-text">PIN</label>
            <input id="login-pin" type="password" size={18} maxLength={24} />
            <button onClick={sendUser} className="login-button">Entrar</button>
            <label id="login-status" className="login-status-text">Pulsa el botón para continuar...</label>
        </div>
        <label className="login-note"><b>Nota</b>: Mientras existan tableros activos a tu nombre, tu cuenta se mantendrá en el servidor para que nadie toque tu partida pendiente. Cuando te vayas y no existan tableros en los que participes, <b>tu cuenta se borrará</b>.</label>
        </>
    )
}

export default Login