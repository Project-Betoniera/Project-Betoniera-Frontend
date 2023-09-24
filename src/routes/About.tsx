export function About() {
    return (
        <div className="main-container container align-left">
            <div className="container align-left wide">
                <h1>🧐 About</h1>
            </div>

            <div className="container align-left">
                <h2>Perché?</h2>
                <p>Il progetto è nato perché il gestionale è macchinoso e lento! Sopratutto se lo si prova ad utilizzare da smartphone mentre si è in ritardo per una lezione...</p>

                <h2>Come funziona?</h2>
                <p>Estraiamo (con molta fatica) i dati del calendario dal Gestionale ufficiale, li rendiamo utilizzabili, li salviamo in una cache e li forniamo tramite il nostro backend!</p>

                <h2>Posso contattare l'autore?</h2>
                <p>Certamente! Puoi contattarmi su <a href="https://t.me/genio2003" target="_blank">Telegram</a>!</p>
            </div>
        </div>
    );
}
