import {
  Avatar,
  Body1,
  Button,
  Card,
  CardHeader,
  Link,
  Spinner,
  Subtitle1,
  Subtitle2,
  Title2,
  Title3,
  makeStyles,
} from "@fluentui/react-components";
import { useGlobalStyles } from "../globalStyles";
import { useEffect, useState } from "react";
import axios from "axios";

type User = {
  id: number;
  login: string;
  avatar_url: string;
  html_url: string;
  contributions: number;
};

const useStyles = makeStyles({
  profileCard: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-evenly",
    flexGrow: 1,
    rowGap: "1rem",
    columnGap: "1rem",
  },
  profileDetails: {
    display: "flex",
    flexDirection: "column",
  },
});
export function About() {
  const styles = useStyles();
  const globalStyles = useGlobalStyles();

  const [users, setUsers] = useState<User[] | null>(null);

  useEffect(() => {
    const result: User[] = [];

    axios({
      method: "GET",
      url: new URL(
        "https://api.github.com/repos/Genio2003/Project-Betoniera-Frontend/contributors"
      ).toString(),
      headers: {
        // Only for testing, will be removed once the project is public
        Authorization:
          "Bearer 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",
      },
    })
      .then((response) => {
        response.data.forEach((contributor: any) => {
          const user: User = {
            id: contributor.id,
            login: contributor.login,
            avatar_url: contributor.avatar_url,
            html_url: contributor.html_url,
            contributions: contributor.contributions,
          };

          result.push(user);
          setUsers(result);
        });
      })
      .catch(() => {
        if (!users) setUsers([]);
      });
  }, []);

  return (
    <div className={globalStyles.container}>
      <Card className={globalStyles.card}>
        <CardHeader
          header={<Title2>{"\u{1F9D0}"} Informazioni sul progetto</Title2>}
        />
      </Card>
      <div className={globalStyles.list}>
        <Card className={globalStyles.card}>
          <Subtitle1>Come è nato?</Subtitle1>
          <Body1>
            Il progetto è nato come project work di{" "}
            <Link
              href="https://www.linkedin.com/in/michelangelo-camaioni/"
              target="_blank"
            >
              Michelangelo Camaioni
            </Link>{" "}
            durante il primo anno del corso di Business Software Development
            (BSD22).
          </Body1>
          <Body1>
            <Link
              href="https://github.com/Genio2003/JAC-AulaLibera-Frontend"
              target="blank"
            >
              Inizialmente
            </Link>{" "}
            lo scopo era quello di visualizzare lo stato delle aule in tempo
            reale.
            <br />
            In seguito è stato ampliato aggiungendo la possibilità di avere il
            calendario delle lezioni sincronizzato su app di terze parti (Apple
            Calendar, Google Calendar, Outlook, etc...), fino ad arrivare a
            quello che è oggi: una piattaforma che permette di visualizzare il
            calendario delle lezioni, lo stato delle aule e i voti, tramite
            un'interfaccia web semplice e intuitiva, utilizzabile da qualsiasi
            dispositivo (anche sotto forma di{" "}
            <Link
              href="https://en.wikipedia.org/wiki/Progressive_web_app"
              target="_blank"
            >
              PWA
            </Link>
            !).
          </Body1>
        </Card>
        <Card className={globalStyles.card}>
          <Subtitle1>Come funziona l'accesso?</Subtitle1>
          <Body1>
            Lo studente effettua il login con le proprie credenziali, che
            vengono criptate in un{" "}
            <Link
              href="https://en.wikipedia.org/wiki/JSON_Web_Encryption"
              target="_blank"
            >
              token JWE
            </Link>
            . Questo token viene poi salvato nel dispositivo e, quando
            necessario, inviato al nostro server, che fa da intermediario con il
            gestionale ufficiale. Questo ci consente di:
            <ul>
              <li>Non richiedere le credenziali ad ogni avvio dell'app</li>
              <li>Non salvare nessun tipo di credenziali sul nostro server</li>
              <li>Ridurre i tempi di risposta, grazie a una cache.</li>
            </ul>
          </Body1>
        </Card>
        <Card className={globalStyles.card}>
          <Subtitle1>Come posso contattarvi?</Subtitle1>
          <Body1>
            Se hai idee, suggerimenti, o hai riscontrato problemi con il sito,
            puoi contattarci tramite email all'indirizzo{" "}
            <Link href="mailto:feedback@betoniera.org" target="_blank">
              feedback@betoniera.org
            </Link>
          </Body1>
        </Card>
      </div>
      <div>
        <Card>
          <Title2>{"\u{1F9D1}\u{200D}\u{1F4BB}"} I nostri collaboratori</Title2>
        </Card>
        <div className={globalStyles.grid}>
          {users ? (
            users.map((user) => (
              <Button as="a" href={user.html_url} target="_blank" key={user.id}>
                <div className={styles.profileCard}>
                  <Avatar
                    name={user.login}
                    shape="square"
                    size={56}
                    image={{
                      src: user.avatar_url,
                      alt: `${user.login}'s profile picture`,
                    }}
                  />

                  <div className={styles.profileDetails}>
                    <Title3>{user.login}</Title3>
                    <Subtitle2>{user.contributions} contribuzioni</Subtitle2>
                  </div>
                </div>
              </Button>
            ))
          ) : (
            <Spinner />
          )}
        </div>
      </div>
    </div>
  );
}
