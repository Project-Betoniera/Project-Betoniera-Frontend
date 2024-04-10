import { Card, CardHeader, Display, Subtitle2, Title1, makeStyles, shorthands } from "@fluentui/react-components";
import { RouterButton } from "../components/router/RouterButton";

const useStyles = makeStyles({
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    flexGrow: 1,
  },
  card: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
    ...shorthands.gap("1rem"),
  },
});

export function NotFound() {
  const styles = useStyles();

  return (
    <div className={styles.container}>
      <Card className={styles.card}>
        <CardHeader className={styles.card} header={<Display>404</Display>} description={<Title1>Not Found</Title1>} />
        <Subtitle2>La pagina che stai cercando non esiste.</Subtitle2>
        <RouterButton as="a" appearance="primary" href="/">
          Torna alla home
        </RouterButton>
      </Card>
    </div>
  );
}
