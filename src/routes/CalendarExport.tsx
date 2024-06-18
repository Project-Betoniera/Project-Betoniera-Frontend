import {
  Body1,
  Card,
  CardHeader,
  Link,
  Subtitle2,
  Title2,
  makeStyles,
  mergeClasses,
  tokens,
} from "@fluentui/react-components";
import { CalendarExporter } from "../components/calendar/CalendarExporter";
import { useGlobalStyles } from "../globalStyles";
import { RouterButton } from "../components/router/RouterButton.tsx";

const useStyles = makeStyles({
  warning: {
    backgroundColor: tokens.colorStatusWarningBackground1,
  },
});

export function CalendarExport() {
  const styles = useStyles();
  const globalStyles = useGlobalStyles();

  return (
    <>
      <div className={globalStyles.container}>
        <Card className={globalStyles.card}>
          <CardHeader
            header={<Title2>📆 Sincronizza calendario</Title2>}
            description={<Subtitle2>Sincronizzazione con app calendari di terze parti</Subtitle2>}
          />
        </Card>
        <div className={mergeClasses(globalStyles.container, globalStyles.list)}>
          <Body1>
            Consigliamo di sincronizzare il calendario sull'app Calendario del tuo telefono. Cerchi il calendario in
            app? Puoi trovarlo qui:
          </Body1>
          <RouterButton as="a" appearance="primary" href="/calendar">
            Visualizza calendario su {window.location.hostname}
          </RouterButton>
          <Card className={mergeClasses(globalStyles.card, styles.warning)}>
            <Subtitle2>⚠️ Attenzione!</Subtitle2>
            <Body1>
              Il calendario si aggiornerà automaticamente, ma la frequenza di aggiornamento varia a seconda
              dell'applicazione. Si consiglia, per sicurezza, di controllare anche il sito!
            </Body1>
          </Card>
          <Body1>
            Da questa pagina è possibile creare un link al calendario per un determinato corso, aula o docente, ed
            aggiungerlo ad un'app di terze parti (ad esempio{" "}
            <Link href="https://calendar.google.com" target="_blank">
              Google Calendar
            </Link>
            ).
          </Body1>

          <CalendarExporter />

          <Card className={globalStyles.card}>
            <Subtitle2>ℹ️ Informazioni</Subtitle2>
            <Body1>
              Se hai un dispositivo Apple, e vuoi aggiungere il calendario su Apple Calendar, seleziona{" "}
              <i>Link diretto</i>, poi scansiona il codice QR.
            </Body1>
            <Body1>
              Se da Google calendar non visualizzi il calendario sul cellulare, attiva la sincronizzazione del
              calendario (Impostazioni &gt; JAC [Codice corso] &gt; Sincronizzazione)
            </Body1>
          </Card>
          <Card className={mergeClasses(globalStyles.card, styles.warning)}>
            <Subtitle2>⚠️ Attenzione!</Subtitle2>
            <Body1>
              <strong>I link generati contengono informazioni personali. Non condividerli con nessuno.</strong>
            </Body1>
          </Card>
        </div>
      </div>
    </>
  );
}
