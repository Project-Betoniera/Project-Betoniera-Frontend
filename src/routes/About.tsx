export function About() {
    return (
        <div className="main-container container align-left">
            <div className="container align-left wide">
                <h1>🧐 About</h1>
            </div>

            <div className="container align-left">
                <h2>Project Betoniera? Che roba è?</h2>
                <p>Project Betoniera è un frontend alternativo al <a href="https://gestionale.fondazionejobsacademy.org" target="_blank">Gestionale della JAC</a> che permette di visualizzare lo stato della aule (libera / occupata) e di esportare il calendario delle lezioni sulla tua app preferita! (<b>Google Calendar / Calendario di Apple / Outlook</b>)</p>

                <h2>Perché?</h2>
                <p>Il progetto è nato perché il gestionale è macchinoso e lento! Sopratutto se lo si prova ad utilizzare da smartphone mentre si è in ritardo per una lezione...</p>

                <h2>Perché si chiama <i>Project Betoniera</i>?</h2>
                <p>Il nome <i>Betoniera</i> deriva dal fatto che estraiamo i dati dal gestionale e li rimescoliamo in modo da renderli utilizzabili! Come una betoniera!</p>

                <h2>Come funziona?</h2>
                <p>Estraiamo (con molta fatica) i dati del calendario dal Gestionale ufficiale, li rendiamo utilizzabili, li salviamo in una cache e li forniamo tramite il nostro backend!</p>

                <h2>Posso contattare l'autore?</h2>
                <p>Certamente! Puoi contattarmi su <a href="https://t.me/genio2003" target="_blank">Telegram</a>!</p>
            </div>
        </div>
    );
}
