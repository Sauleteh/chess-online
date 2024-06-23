import "./css/NoPage.css"
import WhitePawn from "../assets/chess-pieces/white_pawn.png"
import { useEffect } from "react"

function NoPage() {
    function setButtonAction() {
        const button = document.querySelector(".nopage-button");
        if (button) {
            button.addEventListener("click", () => {
                window.location.href = "https://www.youtube.com/watch?v=dQw4w9WgXcQ";
            });
        }
    }

    useEffect(() => { setButtonAction(); }); // Al cargar el componente, se programa una acción para el botón

    return (
        <>
        <h1 className="nopage-title">Error 404</h1>
        <h2 className="nopage-explanation">Esta página no existe</h2>
        <p className="nopage-text">No es normal que estés en esta página, espero que no la estés liando ya. Toma anda, para que no te sientas tan solo te doy esta pieza especial que te dará suerte en tus próximas partidas:</p>
        <img className="nopage-image" src={WhitePawn} alt="Peón blanco"/>
        <div className="nopage-button-container">
            <button className="nopage-button">Recoger pieza de la suerte</button>
        </div>
        </>
    )
}

export default NoPage