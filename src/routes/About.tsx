export function About() {
    return (
        <>
            <h1>About</h1>
            <br></br>
            
            <h2>Project Betoniera? Che roba è??</h2>
            <p>Project Betoniera è un frontend alternativo al <a href="https://gestionale.fondazionejobsacademy.org" target="_blank">Gestionale della JAC</a> che permette in oltre di visualizzare lo stato della aule (libera/occupata) e di avere il calendario delle lezioni sulla tua app preferita! (<b>Google Calendar/Calendario di Apple/Outlook</b>)</p>

            <h2>Perché?</h2>
            <p>Il Gestionale attuale è macchinoso e lento! 🥱 Sopratutto se lo si prova ad utilizzare da smartphone metre si è in ritardo per una lezione...😅</p>

            <h2>Betoniera? Come mai questo nome? 🧐</h2>
            <p>Il nome Betoniera deriva dal fatto che estraiamo i dati dal gestionale e li rimescoliamo in modo da renderli utilizzabili! Come una betoniera!</p>

            <h2>Come funziona?</h2>
            <p>Estraiamo i dati del calendario dal Gestionale ufficiale, li parsiamo, li salviamo in una cache e li serviamo pronti per essere utilizzati!</p>
        </>
    );
}