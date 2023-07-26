import { useContext } from "react";
import { Outlet } from "react-router";
import { Link } from "react-router-dom";
import { TokenContext } from "./context/TokenContext";
import { CourseContext } from "./context/CourseContext";

export function Wrapper() {

    const { setToken } = useContext(TokenContext);
    const { setCourse } = useContext(CourseContext);

    const logout = () => {
        setToken(null);
        setCourse(null);
    };

    return (
        <>
            <nav>
                <h1>Betoniera</h1>
                <Link to="/">Home</Link>
                <Link to="/calendar">Calendario</Link>
                <button onClick={logout}>Logout</button>
            </nav>
            <main>
                <Outlet />
            </main>
            <footer>
                <label>Project Betoniera non è sponsorizzato e/o approvato da Fondazione JobsAcademy.</label>
            </footer>
        </>
    );
}