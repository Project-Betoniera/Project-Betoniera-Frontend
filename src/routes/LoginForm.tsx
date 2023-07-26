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
            <div className="flex-v flex-grow align-center">
                <div className="container">
                    <h1>Project Betoniera</h1>
                    <div className="container">
                        <h2>Login</h2>
                        <form onSubmit={login} className="flex-v">
                            <input type="email" required placeholder="Email" onChange={(e) => { setEmail(e.target.value); }} />
                            <input type="password" required placeholder="Password" onChange={(e) => { setPassword(e.target.value); }} />
                            <button type="submit">Login</button>
                        </form>
                    </div>
                    <div className="container align-left">
                        <label>Esegui il login con le stesse credenziali che utilizzi per accedere al gestionale JAC.</label>
                        <label><strong>Le credenziali rimarranno salvate solamente sul tuo dispositivo.</strong></label>
                    </div>
                </div>
            </div>
            <footer>
                <label>Project Betoniera non è sponsorizzato e/o approvato da Fondazione JobsAcademy</label>
            </footer>
        </>
    );
}