import { useContext } from "react";
import { TokenContext } from "../context/TokenContext";

export function LoginForm() {

    const { token, setToken } = useContext(TokenContext);

    const login = () => {
        setToken("123");
    };

    return (
        <>
            <h1>Login</h1>
            <button onClick={login}>Login</button>
            <label>Token: {token}</label>
        </>
    );
}