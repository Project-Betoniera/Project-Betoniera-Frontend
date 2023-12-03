import { Outlet } from "react-router";
import { Body1, Button, Card, Link, MessageBar, MessageBarActions, MessageBarBody, MessageBarGroup, MessageBarTitle, Subtitle1, Title1, makeStyles, shorthands, tokens } from "@fluentui/react-components";
import { useGlobalStyles } from "./globalStyles";
import RouterMenu from "./components/RouterMenu";
import { useContext, useEffect, useState } from "react";
import { PwaContext } from "./context/PwaContext";
import { AlertOffRegular, ArrowDownloadFilled, DismissRegular } from "@fluentui/react-icons";
import { isBetaBuild } from "./config";
import { MessagesContext } from "./context/MessagesContext";

const useStyles = makeStyles({
    header: {
        display: "flex",
        ...shorthands.padding("0.5rem", "1rem"),
        ...shorthands.margin("0.5rem"),
        ...shorthands.borderRadius(tokens.borderRadiusXLarge),
        "@media screen and (max-width: 578px)": {
            ...shorthands.padding("0.5rem"),
        }
    },
    sticky: {
        display: "flex",
        flexDirection: "column",
        position: "sticky",
        top: 0,
        zIndex: 1,
        "@media screen and (max-width: 578px)": {
            position: "fixed",
            top: "unset",
            bottom: 0,
            left: 0,
            right: 0,
            marginBottom: "env(safe-area-inset-bottom, 0)",
            flexDirection: "column-reverse",
        }
    },
    nav: {
        display: "flex",
        justifyContent: "space-between",
        "@media screen and (min-width: 579px)": { ...shorthands.gap("2rem") },
    },
    routerMenu: {
        display: "flex",
        flexGrow: "1",
        justifyContent: "space-between",
    },
    title: {
        "@media screen and (max-width: 1000px)": { display: "none" },
        alignSelf: "center",
        ...shorthands.padding("0"),
    },
    messageBarGroup: {
        display: "flex",
        flexDirection: "column",
        ...shorthands.margin("0", "0.5rem", "0.5rem", "0.5rem"),
        ...shorthands.gap("0.5rem")
    },
    footer: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        ...shorthands.margin("0.5rem"),
        ...shorthands.padding("1rem"),
        ...shorthands.borderRadius(tokens.borderRadiusXLarge),
        "@media screen and (max-width: 578px)": {
            marginBottom: "6rem",
        }
    },
    installButton: {
        alignSelf: "end",
        flexGrow: "0 !important",
    }
});

export function Wrapper() {
    const styles = useStyles();
    const globalStyles = useGlobalStyles();

    const pwa = useContext(PwaContext);
    const { messages, dismissMessage, doNotShowAgain } = useContext(MessagesContext);
    const pageMessages = messages.filter((message) => window.location.pathname.match(message.matchPath) !== null);
    const [iconsOnly, setIconsOnly] = useState(false);

    useEffect(() => {
        if (!window.matchMedia) return;
        const darkThemeQuery = window.matchMedia('(max-width: 578px)');

        const updateIconsOnly = () => {
            setIconsOnly(darkThemeQuery.matches);
        };

        darkThemeQuery.addEventListener('change', updateIconsOnly);
        updateIconsOnly();

        return () => {
            darkThemeQuery.removeEventListener('change', updateIconsOnly);
        };
    }, []);

    const promptPwaInstall = async () => { pwa.setAcknowledged(false); };

    return (
        <>
            <header className={styles.sticky}>
                <Card className={styles.header}>
                    <nav className={styles.nav}>
                        <Title1 className={styles.title}>Calendar Exporter{isBetaBuild && <Subtitle1 className={globalStyles.betaBadge}>BETA</Subtitle1>}</Title1>
                        {RouterMenu({ className: styles.routerMenu }, iconsOnly)}
                    </nav>
                </Card>

                {pageMessages.length > 0 && <MessageBarGroup className={styles.messageBarGroup} animate="both">
                    {pageMessages.map((message) => (
                        <MessageBar key={message.id} intent={message.intent}>
                            <MessageBarBody>
                                <MessageBarTitle>{message.title}</MessageBarTitle>
                                {message.body && <Body1>{message.body} </Body1>}
                                {message.link && <Link href={message.link} target="blank">{message.linkText ? message.linkText : message.link}</Link>}
                            </MessageBarBody>
                            <MessageBarActions containerAction={
                                <>
                                    {message.isDismissable && <Button onClick={() => doNotShowAgain(message.id)} aria-label="do-not-show-again" appearance="transparent" size="medium" title="Non mostrare più" icon={<AlertOffRegular />} />}
                                    <Button onClick={() => dismissMessage(message.id)} aria-label="dismiss" appearance="transparent" icon={<DismissRegular />} />
                                </>
                            } />
                        </MessageBar>
                    ))}
                </MessageBarGroup>}
            </header>
            <main className={globalStyles.main}>
                <Outlet />
            </main>
            <footer>
                <Card className={styles.footer}>
                    <Body1>Questo progetto non è sponsorizzato e/o approvato da Fondazione JobsAcademy.</Body1>
                    {(!pwa.isInstalled && !pwa.isPwa) && <Button className={styles.installButton} as="a" href={`web+betoniera://${window.location.href.substring(window.location.origin.length)}`} appearance="primary" icon={<ArrowDownloadFilled />} onClick={promptPwaInstall}>Installa App</Button>}
                </Card>
            </footer>
        </>
    );
}
