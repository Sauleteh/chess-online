import "./css/NavigationBar.css"
import * as Constants from "../utils/Constants.ts"

function NavigationBar() {
    function handleLogout() {
        localStorage.removeItem(Constants.STORAGE_KEYS.USERNAME)
        localStorage.removeItem(Constants.STORAGE_KEYS.PIN)
        window.location.href = "/login"
    }

    return (
        <div className="topnav">
            <a className="active" href="/">Inicio</a>
            <a onClick={handleLogout}>Cerrar sesión</a>
        </div>
    )
}

export default NavigationBar