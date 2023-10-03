import { Body1, Card, CardHeader, Link, Subtitle1, Title2, mergeClasses } from "@fluentui/react-components";
import { useGlobalStyles } from "../globalStyles";

export function About() {
    const globalStyles = useGlobalStyles();

    return (
        <div className={globalStyles.container}>
            <Card className={globalStyles.card}>
                <CardHeader
                    header={<Title2>🧐 Informazioni sul progetto</Title2>}
                />
            </Card>
            <div className={mergeClasses(globalStyles.container, globalStyles.list)}>
                <Card className={globalStyles.card}>
                    <Subtitle1>Come è nato?</Subtitle1>
                    <Body1>
                        Il progetto nasce perché il gestionale è macchinoso e lento!
                        <br />
                        Soprattutto se lo si prova ad utilizzare dal cellulare mentre si è in ritardo per una lezione...
                    </Body1>
                </Card>
                <Card className={globalStyles.card}>
                    <Subtitle1>Come funziona?</Subtitle1>
                    <Body1>
                        Vengono estratti (con molta fatica) i dati del calendario, corsi e aule dal gestionale ufficiale,
                        <br />
                        dopodiché vengono convertiti in un formato standard e salvati in una cache, pronti per essere utilizzati da <Link href={window.location.toString()}>betoniera.org</Link>.
                    </Body1>
                </Card>
                <Card className={globalStyles.card}>
                    <Subtitle1>Posso contattare l'autore?</Subtitle1>
                    <Body1>Certamente! Puoi contattarmi su <Link href="https://t.me/genio2003" target="_blank">Telegram</Link>!</Body1>
                </Card>
            </div>
        </div>
    );
}
