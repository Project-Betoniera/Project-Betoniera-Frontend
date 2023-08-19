import { FormEvent, useContext, useState } from "react";
import { TokenContext } from "../context/TokenContext";
import axios from "axios";
import { apiUrl } from "../config";
import { CourseContext } from "../context/CourseContext";
import { CourseDto } from "../dto/CourseDto";

export function LoginForm() {

    const { setTokenData } = useContext(TokenContext);
    const { setCourse } = useContext(CourseContext);

    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [remember, setRemember] = useState<boolean>(false);

    const login = async (e: FormEvent) => {
        e.preventDefault();

        axios.post(new URL("login", apiUrl).toString(), {}, {
            headers: {
                Authorization: "Basic " + btoa(email + ":" + password)
            }
        }).then((response) => {
            if (response.status === 200) {
                setTokenData({ token: response.data.token, remember: remember });
                setCourse(response.data.course as CourseDto);
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
                    <h1>Project Betoniera<sup>BETA</sup></h1>
                    <div className="container">
                        <h2>🚀 Login</h2>
                        <form onSubmit={login} className="flex-v">
                            <input type="email" required placeholder="Email" onChange={(e) => { setEmail(e.target.value); }} />
                            <input type="password" required placeholder="Password" onChange={(e) => { setPassword(e.target.value); }} />
                            <label>
                                <input type="checkbox" checked={remember} onChange={() => setRemember(!remember)} />
                                Ricordami
                            </label>
                            <button type="submit">Login</button>
                        </form>
                    </div>
                    <div className="container align-left container-info">
                        <h3>ℹ️ Informazioni</h3>
                        <span>Esegui il login con le stesse credenziali che utilizzi per accedere al <a href="https://gestionale.fondazionejobsacademy.org" target="_blank">Gestionale JAC</a>.</span>
                        <span><strong>Le credenziali verranno inviate al <a href="https://gestionale.fondazionejobsacademy.org" target="_blank">gestionale</a> (passando per <a>calendar.zucchina.org</a>), verificate, dopodiché rimarranno salvate su questo dispositivo.</strong></span>
                    </div>
                </div>
            </div>
            <footer>
                <span>Project Betoniera non è sponsorizzato e/o approvato da Fondazione JobsAcademy</span>
            </footer>
        </>
    );
}
