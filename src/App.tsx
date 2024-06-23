import "./App.css"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import Home from "./pages/Home.tsx"
import NoPage from "./pages/NoPage.tsx"
import Login from "./pages/Login.tsx";
import InGame from "./pages/InGame.tsx";
import History from "./pages/History.tsx";
import socket from "./WebSocket.tsx";
import * as Constants from "./utils/Constants.ts";
import NavigationBar from "./components/NavigationBar.tsx";
import { BASE_URL } from "./utils/Constants.ts";

function App() {
    socket.onopen = function () {
        console.log("Connected to WebSocket server");

        if (window.location.pathname !== BASE_URL + "/login" &&
        (localStorage.getItem(Constants.STORAGE_KEYS.USERNAME) === null || localStorage.getItem(Constants.STORAGE_KEYS.PIN) === null ||
        localStorage.getItem(Constants.STORAGE_KEYS.USERNAME) === undefined || localStorage.getItem(Constants.STORAGE_KEYS.PIN) === undefined ||
        localStorage.getItem(Constants.STORAGE_KEYS.USERNAME) === "" || localStorage.getItem(Constants.STORAGE_KEYS.PIN) === "")) {
            // Si no hay usuario en el almacenamiento local estando en cualquier página que no sea la de login, redirigir a la página de login
            window.location.href = BASE_URL + "/login";
        }
        else if (localStorage.getItem(Constants.STORAGE_KEYS.USERNAME) !== null && localStorage.getItem(Constants.STORAGE_KEYS.PIN) !== null &&
        localStorage.getItem(Constants.STORAGE_KEYS.USERNAME) !== undefined && localStorage.getItem(Constants.STORAGE_KEYS.PIN) !== undefined &&
        localStorage.getItem(Constants.STORAGE_KEYS.USERNAME) !== "" && localStorage.getItem(Constants.STORAGE_KEYS.PIN) !== "") {
            // Si ya hay usuario en el almacenamiento local, comprobamos que sea válido
            const message = JSON.stringify({
                type: "login",
                name: localStorage.getItem(Constants.STORAGE_KEYS.USERNAME),
                pin: localStorage.getItem(Constants.STORAGE_KEYS.PIN),
                content: null
            });
            socket.send(message); // El mensaje que se reciba será procesado en la página en la que se esté en ese momento
        }
    };

    socket.onclose = function (event) {
        console.log(`Disconnected with event code: ${event.code}`);
    };

    return (
    <>
    { window.location.pathname !== BASE_URL + "/login" && <NavigationBar/> /* Solo aparece la barra de navegación si se está en el apartado de iniciar sesión */ }
    <BrowserRouter basename={BASE_URL}>
        <Routes>
            <Route path="/home" element={<Home/>} />
            <Route path="/login" element={<Login/>} />
            <Route path="/board/:id" element={<InGame/>} />
            <Route path="/history" element={<History/>} />
            <Route path="*" element={<NoPage/>} />
        </Routes>
    </BrowserRouter>
    </>
    )
}

export default App
