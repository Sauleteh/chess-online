import "./NavigationBar.css"
import * as Constants from "../Constants.ts"

function NavigationBar() {
    function handleLogout() {
        localStorage.removeItem(Constants.STORAGE_KEYS.USERNAME)
        localStorage.removeItem(Constants.STORAGE_KEYS.PIN)
        window.location.href = "/login"
    }

    return (
        <div className="topnav">
            <a className="active" href="/">Página principal</a>
            <a onClick={handleLogout}>Cerrar sesión</a>
        </div>
    )
}

export default NavigationBar