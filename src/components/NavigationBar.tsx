import "./css/NavigationBar.css"
import * as Constants from "../utils/Constants.ts"
import { useEffect } from "react"

function NavigationBar() {
    function handleLogout() {
        localStorage.removeItem(Constants.STORAGE_KEYS.USERNAME)
        localStorage.removeItem(Constants.STORAGE_KEYS.PIN)
        window.location.href = Constants.BASE_URL + "/login"
    }

    function setActiveWindow() {
        const links = document.querySelector(".topnav")?.getElementsByTagName("a");

        if (links !== undefined && links !== null) {
            for (let i = 0; i < links.length; i++) {
                if (links[i].pathname === document.location.pathname) {
                    links[i].classList.add("active");
                } else {
                    links[i].classList.remove("active");
                }
            }
        }
    }

    useEffect(() => { setActiveWindow(); }); // Al cargar el componente, se marca la pestaña activa

    return (
        <div className="topnav">
            <a href={Constants.BASE_URL}>Inicio</a>
            <a href={Constants.BASE_URL + "/history"}>Historial</a>
            <a className="nav-logout" onClick={handleLogout}>Cerrar sesión</a>
        </div>
    )
}

export default NavigationBar