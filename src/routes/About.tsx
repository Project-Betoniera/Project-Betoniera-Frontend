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
  tokens,
} from "@fluentui/react-components";
import { createFluentIcon } from "@fluentui/react-icons";
import { useEffect, useState } from "react";
import EasterEgg from "../components/EasterEgg";
import { useGlobalStyles } from "../globalStyles";
import useRequests from "../libraries/requests/requests";

export type GithubContributor = {
  id: number;
  login: string;
  avatar_url: string;
  html_url: string;
  contributions: number;
};

const GithubIcon = createFluentIcon("github", "98", [
  "M48.854 0C21.839 0 0 22 0 49.217c0 21.756 13.993 40.172 33.405 46.69 2.427.49 3.316-1.059 3.316-2.362 0-1.141-.08-5.052-.08-9.127-13.59 2.934-16.42-5.867-16.42-5.867-2.184-5.704-5.42-7.17-5.42-7.17-4.448-3.015.324-3.015.324-3.015 4.934.326 7.523 5.052 7.523 5.052 4.367 7.496 11.404 5.378 14.235 4.074.404-3.178 1.699-5.378 3.074-6.6-10.839-1.141-22.243-5.378-22.243-24.283 0-5.378 1.94-9.778 5.014-13.2-.485-1.222-2.184-6.275.486-13.038 0 0 4.125-1.304 13.426 5.052a46.97 46.97 0 0 1 12.214-1.63c4.125 0 8.33.571 12.213 1.63 9.302-6.356 13.427-5.052 13.427-5.052 2.67 6.763.97 11.816.485 13.038 3.155 3.422 5.015 7.822 5.015 13.2 0 18.905-11.404 23.06-22.324 24.283 1.78 1.548 3.316 4.481 3.316 9.126 0 6.6-.08 11.897-.08 13.526 0 1.304.89 2.853 3.316 2.364 19.412-6.52 33.405-24.935 33.405-46.691C97.707 22 75.788 0 48.854 0z",
]);

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
  commitText: {
    textAlign: "right",
    color: tokens.colorNeutralForegroundDisabled,
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
          action={
            __COMMIT_SHA_DISPLAY__ !== null && __COMMIT_SHA__ != null ?
              <Button
                appearance="transparent"
                href={`https://github.com/Project-Betoniera/Project-Betoniera-Frontend/tree/${__COMMIT_SHA__ ?? ""}`}
                target="blank"
                as="a"
                className={styles.commitText}>
                Commit: {__COMMIT_SHA_DISPLAY__}
              </Button>
              : undefined
          }
        />
      </Card>
      <div className={globalStyles.list}>
        <Card className={globalStyles.card}>
          <Subtitle1>Come è nato?</Subtitle1>
          <Body1>
            Il progetto è nato come project work di{" "}
            <Link href="https://www.linkedin.com/in/michelangelo-camaioni/" target="_blank">
              Michelangelo Camaioni
            </Link>{" "}
            durante il primo anno del corso di Business Software Development (BSD22).
          </Body1>
          <Body1>
            <Link href="https://github.com/Genio2003/JAC-AulaLibera-Frontend" target="blank">
              Inizialmente
            </Link>{" "}
            lo scopo era quello di visualizzare lo stato delle aule in tempo reale.
            <br />
            In seguito è stato ampliato aggiungendo la possibilità di avere il calendario delle lezioni sincronizzato su
            app di terze parti (Apple Calendar, Google Calendar, Outlook, etc...), fino ad arrivare a quello che è oggi:
            una piattaforma che permette di visualizzare il calendario delle lezioni, lo stato delle aule e i voti,
            tramite un'interfaccia web semplice e intuitiva, utilizzabile da qualsiasi dispositivo (anche sotto forma di{" "}
            <Link href="https://en.wikipedia.org/wiki/Progressive_web_app" target="_blank">
              PWA
            </Link>
            !).
          </Body1>
        </Card>
        <Card className={globalStyles.card}>
          <Subtitle1>Come funziona l'accesso?</Subtitle1>
          <Body1>
            Lo studente effettua il login con le proprie credenziali, che vengono criptate in un{" "}
            <Link href="https://en.wikipedia.org/wiki/JSON_Web_Encryption" target="_blank">
              token JWE
            </Link>
            . Questo token viene poi salvato nel dispositivo e, quando necessario, inviato al nostro server, che fa da
            intermediario con il gestionale ufficiale. Questo ci consente di:
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
            Se hai idee, suggerimenti, o hai riscontrato problemi con il sito, puoi contattarci tramite email
            all'indirizzo{" "}
            <Link href="mailto:feedback@betoniera.org" target="_blank">
              feedback@betoniera.org
            </Link>
          </Body1>
          <Body1>
            Se invece vuoi contribuire al progetto, puoi trovarlo su GitHub seguendo il link sottostante. Una mano in
            più è sempre gradita!
          </Body1>
        </Card>

        <CompoundButton
          as="a"
          href="https://github.com/Project-Betoniera/Project-Betoniera-Frontend"
          target="_blank"
          icon={<GithubIcon />}>
          Visualizza su GitHub
        </CompoundButton>
      </div>
      <div>
        <Card>
          <Title2>{"\u{1F9D1}\u{200D}\u{1F4BB}"} I nostri collaboratori</Title2>
        </Card>
        <div className={globalStyles.grid}>
          {contributors ?
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
            : new Array(5).fill(null).map((_, index) => (
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
      <EasterEgg />
    </div>
  );
}
