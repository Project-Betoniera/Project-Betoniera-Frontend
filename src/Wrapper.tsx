import { useContext } from "react";
import { Outlet } from "react-router";
import { Link } from "react-router-dom";
import { TokenContext } from "./context/TokenContext";
import { CourseContext } from "./context/CourseContext";

export function Wrapper() {

    const { setTokenData } = useContext(TokenContext);
    const { setCourse } = useContext(CourseContext);

    const logout = () => {
        setTokenData({ token: null, remember: false });
        setCourse(null);
    };

    return (
        <>
            <nav>
                <h1>Project Betoniera<sup>BETA</sup></h1>
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
                <button onClick={logout}>👋 Logout</button>
            </nav>
            <main>
                <Outlet />
            </main>
            <footer>
                <span>Project Betoniera non è sponsorizzato e/o approvato da Fondazione JobsAcademy.</span>
                <Link to="/about">About</Link>
            </footer>
        </>
    );
}
