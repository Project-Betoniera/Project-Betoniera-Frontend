import { useContext } from "react";
import { Outlet } from "react-router";
import { TokenContext } from "./context/TokenContext";
import { CourseContext } from "./context/CourseContext";
import { Button, CompoundButton, Label, Link, makeStyles, shorthands, tokens } from "@fluentui/react-components";
import { Home20Filled, ConferenceRoom20Filled, Calendar20Filled, Info20Filled } from "@fluentui/react-icons";
import { useGlobalStyles } from "./globalStyle";

const useStyles = makeStyles({
    header: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        ...shorthands.margin("1rem"),
        ...shorthands.padding("0.5rem", "1rem"),
        ...shorthands.borderRadius("1rem"),
        backgroundColor: tokens.colorNeutralBackground2
    },
    nav: {
        display: "flex",
        flexGrow: "1",
        justifyContent: "space-around",
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
                    <CompoundButton icon={<Home20Filled />} appearance="subtle" size="small" as="a" href="/">
                        Home
                    </CompoundButton>
                    <CompoundButton icon={<ConferenceRoom20Filled />} appearance="subtle" size="small" as="a" href="/classroom">
                        Aule
                    </CompoundButton>
                    <CompoundButton icon={<Calendar20Filled />} appearance="subtle" size="small" as="a" href="/calendar">
                        Calendario
                    </CompoundButton>
                    <CompoundButton icon={<Info20Filled />} appearance="subtle" size="small" as="a" href="/about">
                        About
                    </CompoundButton>
                </nav>
                <Button appearance="primary" onClick={logout}>👋 Logout</Button>
            </header>
            <main className={globalStyles.main}>
                <Outlet />
            </main>
            <footer className={globalStyles.footer}>
                <Label>Questo progetto non è sponsorizzato e/o approvato da Fondazione JobsAcademy. </Label>
                <Link href="/about">About</Link>
            </footer>
        </>
    );
}
