import { useContext } from "react";
import { Outlet } from "react-router";
import { Link } from "react-router-dom";
import { TokenContext } from "./context/TokenContext";
import { CourseContext } from "./context/CourseContext";
import { Button } from "@fluentui/react-components";

export function Wrapper() {

    const { setTokenData } = useContext(TokenContext);
    const { setCourse } = useContext(CourseContext);

    const logout = () => {
        setTokenData({ token: null, remember: false });
        setCourse(null);
    };

    return (
        <>
            <header>
                <h1>Calendar Exporter<sup>BETA</sup></h1>
                <nav>
                    <Link to="/">
                        <img src="Home.svg" alt="Home.svg"></img>
                        <span>Home</span>
                    </Link>
                    <Link to="/classroom">
                        <img src="School.svg" alt="School.svg"></img>
                        <span>Aule</span>
                    </Link>
                    <Link to="/calendar">
                        <img src="Calendar.svg" alt="Calendar.svg"></img>
                        <span>Calendario</span>
                    </Link>
                    <Link to="/about">
                        <img src="Info.svg" alt="Info.svg"></img>
                        <span>About</span>
                    </Link>
                    <Button appearance="primary" onClick={logout}>👋 Logout</Button>
                </nav>
            </header>
            <main>
                <Outlet />
            </main>
            <footer>
                <span>Questo progetto non è sponsorizzato e/o approvato da Fondazione JobsAcademy.</span>
                <Link to="/about">About</Link>
            </footer>
        </>
    );
}
