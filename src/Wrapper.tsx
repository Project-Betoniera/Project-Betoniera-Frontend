import { Outlet } from "react-router";
import { Body1, Button, Card, Title1, makeStyles, shorthands, tokens } from "@fluentui/react-components";
import { useGlobalStyles } from "./globalStyles";
import RouterMenu from "./components/RouterMenu";
import { useContext, useEffect, useState } from "react";
import { PwaContext } from "./context/PwaContext";
import { ArrowDownloadFilled } from "@fluentui/react-icons";

const useStyles = makeStyles({
    header: {
        display: "flex",
        ...shorthands.margin("0.5rem"),
        ...shorthands.padding("1rem", "1rem"),
        ...shorthands.borderRadius(tokens.borderRadiusXLarge),
        "@media screen and (max-width: 578px)": {
            ...shorthands.padding("0.5rem"),
        }
    },
    sticky: {
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
        "@media screen and (max-width: 958px)": { display: "none" },
        ...shorthands.padding("0"),
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
                        <Title1 className={styles.title}>Calendar Exporter<sup>BETA</sup></Title1>
                        {RouterMenu({ className: styles.routerMenu }, iconsOnly)}
                    </nav>
                </Card>
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
