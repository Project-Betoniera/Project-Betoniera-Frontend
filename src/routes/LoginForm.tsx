import { FormEvent, useContext, useState } from "react";
import { TokenContext } from "../context/TokenContext";
import axios from "axios";
import { apiUrl } from "../config";

export function LoginForm() {

    const { setToken } = useContext(TokenContext);

    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");

    const login = async (e: FormEvent) => {
        e.preventDefault();

        axios.post(new URL("login", apiUrl).toString(), {}, {
            headers: {
                Authorization: "Basic " + btoa(email + ":" + password)
            }
        }).then((response) => {
            if (response.status === 200) {
                setToken(response.data.accessToken);
                localStorage.setItem("token", response.data.accessToken);
            }
            else {
                alert("Login failed");
            }
        }).catch((error) => {
            alert("Login failed: " + error.message);
        });
    };

    return (
        <>
            <h1>Login</h1>
            <form onSubmit={login}>
                <input type="email" required placeholder="Email" onChange={(e) => { setEmail(e.target.value); }} />
                <input type="password" required placeholder="Password" onChange={(e) => { setPassword(e.target.value); }} />
                <button type="submit">Login</button>
            </form>
        </>
    );
}