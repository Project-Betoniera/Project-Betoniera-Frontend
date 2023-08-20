import { Link } from "react-router-dom";

export function NotFound() {
    function randomImage() {
        const num = Math.round(Math.random() * 5) + 1; // 1-5

        return (
            <>
                <video autoPlay loop muted playsInline>
                    <source src={`404gifs/cement_mixer_${num}.webm`} type="video/webm"/>
                </video>
            </>
        );
    }

    return (
        <div className="container">
            <div className="container wide">
                <h1>404 Not Found</h1>
                <p>La pagina che stai cercando non esiste.</p>
                <p>Ti sei perso? <Link to="/">Torna alla home</Link></p>
            </div>
            {randomImage()}
        </div>
    );
}
