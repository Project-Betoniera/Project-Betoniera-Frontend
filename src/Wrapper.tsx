import { useContext } from "react";
import { Outlet } from "react-router";
import { Link } from "react-router-dom";
import { TokenContext } from "./context/TokenContext";

export function Wrapper() {

    const { token, setToken } = useContext(TokenContext);
    const logout = () => {
        setToken(null);
    };

    return (
        <>
            <h1>Betoniera</h1>
            <div>
                <Link to="/">Home</Link>
                <Link to="/calendar">Calendar</Link>
                <button onClick={logout}>Logout</button>
                <label>Token: {token}</label>
            </div>
            <Outlet />
        </>
    );
}