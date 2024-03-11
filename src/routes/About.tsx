import {
  Avatar,
  Body1,
  Button,
  Card,
  CardHeader,
  CompoundButton,
  Link,
  Skeleton,
  SkeletonItem,
  Subtitle1,
  Title2,
  makeStyles,
} from "@fluentui/react-components";
import { BranchRegular } from "@fluentui/react-icons";
import { useGlobalStyles } from "../globalStyles";
import { useEffect, useState } from "react";
import useRequests from "../libraries/requests/requests";

export type GithubContributor = {
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
    alignItems: "center",
    flexGrow: 1,
    rowGap: "1rem",
    columnGap: "1rem",
  },
  profileDetails: {
    display: "flex",
    flexGrow: 1,
    rowGap: "0.5rem",
    flexDirection: "column",
  },
});

export function About() {
  const styles = useStyles();
  const globalStyles = useGlobalStyles();
  const requests = useRequests();

  const [contributors, setContributors] = useState<GithubContributor[] | null>(null);

  useEffect(() => {
    const contributorsCache = sessionStorage.getItem("githubContributors");

    if (contributorsCache !== null) {
      setContributors(JSON.parse(contributorsCache));
    } else {
      requests.github.contributors().then((result) => {
        setContributors(result);
        sessionStorage.setItem("githubContributors", JSON.stringify(result));
      });
    }
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
          <Subtitle1>Come posso aiutarvi?</Subtitle1>
          <Body1>
            Se hai idee, suggerimenti, o hai riscontrato problemi con il sito,
            puoi contattarci tramite email all'indirizzo{" "}
            <Link href="mailto:feedback@betoniera.org" target="_blank">
              feedback@betoniera.org
            </Link>
          </Body1>
          <Body1>
            Se invece vuoi contribuire al progetto, puoi trovarlo su GitHub seguendo il link sottostante. Una mano in più è sempre gradita!
          </Body1>
        </Card>

        <CompoundButton
          as="a"
          href="https://github.com/Project-Betoniera/Project-Betoniera-Frontend"
          target="_blank"
          // TODO Use GitHub logo
          icon={<BranchRegular />}
        >
          View on GitHub
        </CompoundButton>
      </div>
      <div>
        <Card>
          <Title2>{"\u{1F9D1}\u{200D}\u{1F4BB}"} I nostri collaboratori</Title2>
        </Card>
        <div className={globalStyles.grid}>
          {contributors ? (
            contributors.map((contributor) => (
              <Button as="a" href={contributor.html_url} target="_blank" key={contributor.id}>
                <div className={styles.profileCard}>
                  <Avatar
                    name={contributor.login}
                    shape="square"
                    size={56}
                    image={{
                      src: contributor.avatar_url,
                      alt: `${contributor.login}'s profile picture`,
                    }}
                  />

                  <div className={styles.profileDetails}>
                    <Subtitle1>{contributor.login}</Subtitle1>
                    <Body1>{contributor.contributions} contribuzioni</Body1>
                  </div>
                </div>
              </Button>
            ))
          ) :
            new Array(5).fill(null).map((_, index) => (
              <Card key={index}>
                <Skeleton className={styles.profileCard}>
                  <SkeletonItem shape="square" size={56} />
                  <Skeleton className={styles.profileDetails}>
                    <SkeletonItem size={24} />
                    <SkeletonItem size={16} />
                  </Skeleton>
                </Skeleton>
              </Card>
            ))
          }
        </div>
      </div>
    </div>
  );
}
