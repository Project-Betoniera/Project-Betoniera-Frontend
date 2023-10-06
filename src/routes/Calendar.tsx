
import { Body1, Card, CardHeader, Subtitle2, Title2, mergeClasses, makeStyles, tokens } from "@fluentui/react-components";
import { useGlobalStyles } from "../globalStyles";
import { CalendarExporter } from "../components/CalendarExporter";

const useStyles = makeStyles({
    warning: {
        backgroundColor: tokens.colorStatusWarningBackground1,
    }
});

export function Calendar() {
    const styles = useStyles();
    const globalStyles = useGlobalStyles();

    return (
        <>
            <div className={globalStyles.container}>
                <Card className={globalStyles.card}>
                    <CardHeader
                        header={<Title2>📆 Esporta calendario</Title2>}
                        description={<Subtitle2>Integrazione con calendari di terze parti</Subtitle2>}
                    />
                </Card>
                <div className={mergeClasses(globalStyles.container, globalStyles.list)}>
                    <CalendarExporter />

                    <Card className={globalStyles.card}>
                        <Subtitle2>ℹ️ Informazioni</Subtitle2>
                        <Body1>Se hai un dispositivo Apple, e vuoi aggiungere il calendario su Apple Calendar, seleziona <i>Link diretto</i>, poi scansiona il codice QR.</Body1>
                        <Body1>Se da Google calendar non visualizzi il calendario sul cellulare, attiva la sincronizzazione del calendario (Impostazioni &gt; JAC [Codice corso] &gt; Sincronizzazione)</Body1>
                    </Card>
                    <Card className={mergeClasses(globalStyles.card, styles.warning)}>
                        <Subtitle2>⚠️ Attenzione!</Subtitle2>
                        <Body1><strong>I link generati contengono informazioni personali. Non condividerli con nessuno.</strong></Body1>
                    </Card>
                </div>
            </div>
        </>
    );
}
