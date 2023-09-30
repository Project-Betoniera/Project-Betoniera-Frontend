import { useContext } from "react";
import { Outlet } from "react-router";
import { TokenContext } from "./context/TokenContext";
import { CourseContext } from "./context/CourseContext";
import { Body1, Button, Card, makeStyles, shorthands, tokens } from "@fluentui/react-components";
import { useGlobalStyles } from "./globalStyle";
import RouterMenu from "./components/RouterMenu";

const useStyles = makeStyles({
    header: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        ...shorthands.margin("0.5rem"),
        ...shorthands.padding("1rem", "1rem"),
        ...shorthands.borderRadius("1rem"),
        backgroundColor: tokens.colorNeutralBackground2
    },
    nav: {
        display: "flex",
        flexGrow: "1",
        justifyContent: "space-evenly",
        alignItems: "center",
    },
    title: {
        ...shorthands.margin("0"),
        ...shorthands.padding("0"),
    }
});

export function Wrapper() {
    const styles = useStyles();
    const globalStyles = useGlobalStyles();

    const { setTokenData } = useContext(TokenContext);
    const { setCourse } = useContext(CourseContext);

    const logout = () => {
        setTokenData({ token: null, remember: false });
        setCourse(null);
    };

    return (
        <>
            <header className={styles.header}>
                <h1 className={styles.title}>Calendar Exporter<sup>BETA</sup></h1>
                <nav className={styles.nav}>
                    <RouterMenu className={styles.nav} />
                    <Button appearance="primary" onClick={logout}>👋 Logout</Button>
                </nav>
            </header>
            <main className={globalStyles.main}>
                <Outlet />
            </main>
            <footer>
                <Card className={globalStyles.footer}>
                    <Body1>Questo progetto non è sponsorizzato e/o approvato da Fondazione JobsAcademy.</Body1>
                </Card>
            </footer>
        </>
    );
}
