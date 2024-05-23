import "./NavigationBar.css"

function NavigationBar() {
    return (
        <div className="topnav">
            <a className="active" href="/">Página principal</a>
            <a href="#news">News</a>
            <a href="#contact">Contact</a>
            <a href="#about">About</a>
        </div>
    )
}

export default NavigationBar