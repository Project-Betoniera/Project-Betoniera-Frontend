import { useContext } from "react";
import { Outlet } from "react-router";
import { TokenContext } from "./context/TokenContext";
import { CourseContext } from "./context/CourseContext";
import { Body1, Button, Card, Title1, makeStyles, shorthands, tokens } from "@fluentui/react-components";
import { useGlobalStyles } from "./globalStyles";
import RouterMenu from "./components/RouterMenu";

const useStyles = makeStyles({
    header: {
        display: "flex",
        flexDirection: "row",
        ...shorthands.margin("0.5rem"),
        ...shorthands.padding("1rem", "1rem"),
        ...shorthands.borderRadius(tokens.borderRadiusXLarge),
    },
    nav: {
        display: "flex",
        alignItems: "center",
    },
    routerMenu: {
        display: "flex",
        flexGrow: "1",
        justifyContent: "space-evenly",

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
            <header>
                <Card className={styles.header}>
                    <nav className={styles.nav}>
                        <Title1 className={styles.title}>Calendar Exporter<sup>BETA</sup></Title1>
                        <RouterMenu className={styles.routerMenu} />
                        <Button appearance="primary" onClick={logout}>👋 Logout</Button>
                    </nav>
                </Card>
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
