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
                <h1>Project Betoniera</h1>
                <Link to="/">Home</Link>
                <Link to="/classroom">Aule</Link>
                <Link to="/calendar">Calendario</Link>
                <Link to="/about">About</Link>
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
