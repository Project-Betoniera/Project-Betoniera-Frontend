export function About() {
    return (
        <div className="container align-left">
            <div className="container align-left wide">
                <h1>About</h1>
            </div>

            <div className="container align-left">
                <h2>Project Betoniera? Che roba è??</h2>
                <p>Project Betoniera è un frontend alternativo al <a href="https://gestionale.fondazionejobsacademy.org" target="_blank">Gestionale della JAC</a> che permette in oltre di visualizzare lo stato della aule (libera/occupata) e di avere il calendario delle lezioni sulla tua app preferita! (<b>Google Calendar/Calendario di Apple/Outlook</b>)</p>

                <h2>Perché?</h2>
                <p>Il Gestionale attuale è macchinoso e lento! Sopratutto se lo si prova ad utilizzare da smartphone mentre si è in ritardo per una lezione...</p>

                <h2>Betoniera? Come mai questo nome?</h2>
                <p>Il nome Betoniera deriva dal fatto che estraiamo i dati dal gestionale e li rimescoliamo in modo da renderli utilizzabili! Come una betoniera!</p>

                <h2>Come funziona?</h2>
                <p>Estraiamo i dati del calendario dal Gestionale ufficiale, li parsiamo, li salviamo in una cache e li serviamo pronti per essere utilizzati!</p>

                <h2>Chi c'è dietro?</h2>
                <p>Il progetto è stato creato da <b>Michelangelo Camaioni</b> e da <b>Manuel Doneda</b>, due studenti della JAC.</p>

                <h2>Posso contattarvi?</h2>
                <p>Assolutamente! Scrivici su Telegram <a href="https://t.me/genio2003" target="_blank">Michelangelo Camaioni</a> o <a href="" target="_blank">Manuel Doneda</a>!</p>
            </div>
        </div>
    );
}
