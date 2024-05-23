import socket from "../WebSocket.tsx"

function Home() {
    socket.onmessage = function (event) {
        const data = JSON.parse(event.data);
        console.log("Home");
        console.log(data);

        // Si el usuario no es válido, redirigir a la página de login (mensaje recibido por comprobación de credenciales)
        if (data.type === "login" && window.location.pathname !== "/login" && data.code !== 0) window.location.href = "/login";

        
    };

    return (
        <>
        <h1>Ajedrez Online</h1>
        <div className="activeBoards">
            <label>Tableros activos</label>
            
        </div>
        </>
    )
}

export default Home