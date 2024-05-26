import socket from "../WebSocket.tsx"
import * as Constants from "../utils/Constants.ts"

function Login() {
    socket.onmessage = function (event) {
        const data = JSON.parse(event.data);
        console.log("Login");
        console.log(data);

        const status = document.getElementById("status") as HTMLLabelElement;

        if (data.type === "login") {
            if (data.code === 0) {
                if (data.content !== null) { // Si el usuario es válido (y no es un mensaje de comprobación de credenciales), guardamos el nombre y el PIN en el almacenamiento local
                    localStorage.setItem(Constants.STORAGE_KEYS.USERNAME, data.content.name);
                    localStorage.setItem(Constants.STORAGE_KEYS.PIN, data.content.pin);
                }
                window.location.href = "/";
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
        const username = document.getElementById("name") as HTMLInputElement;
        const pin = document.getElementById("pin") as HTMLInputElement;
        const status = document.getElementById("status") as HTMLLabelElement;

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

    return (
        <>
        <label>Nombre</label><input id="name"/><br/>
        <label>PIN</label><input id="pin"/><br/>
        <button onClick={sendUser}>Entrar</button><br/>
        <label id="status">Pulsa el botón para continuar...</label>
        <br/><br/>
        <label>Nota: Mientras existan tableros activos a tu nombre, tu cuenta se mantendrá en el servidor para que nadie toque tu partida pendiente.<br/>Cuando te vayas y no existan tableros en los que participes, tu cuenta se borrará.</label>
        </>
    )
}

export default Login