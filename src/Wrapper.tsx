import { useContext } from "react";
import { Outlet } from "react-router";
import { Link } from "react-router-dom";
import { TokenContext } from "./context/TokenContext";

export function Wrapper() {

    const { setToken } = useContext(TokenContext);

    const logout = () => {
        setToken(null);
        localStorage.removeItem("token");
    };

    return (
        <>
            <nav>
                <h1>Betoniera</h1>
                <Link to="/">Home</Link>
                <Link to="/calendar">Calendario</Link>
                <button onClick={logout}>Logout</button>
            </nav>
            <Outlet />
            <footer>
                <label>Project Betoniera non è sponsorizzato e/o approvato da Fondazione JobsAcademy.</label>
            </footer>
        </>
    );
}