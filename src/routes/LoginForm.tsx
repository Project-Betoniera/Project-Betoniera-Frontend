import { FormEvent, useContext, useState } from "react";
import { TokenContext } from "../context/TokenContext";
import axios from "axios";
import { apiUrl } from "../config";
import { CourseContext } from "../context/CourseContext";
import { CourseDto } from "../dto/CourseDto";
import { Button, Checkbox, Input, Link, tokens } from "@fluentui/react-components";
import { makeStyles } from '@fluentui/react-components';
import { shorthands } from '@fluentui/react-components';

const useStyles = makeStyles({
    main: {
        alignItems: "center",
        display: "flex",
        flexGrow: 1,
    },
    container: {
        display: "flex",
        flexGrow: 1,
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        ...shorthands.margin("1rem"),
        ...shorthands.padding("1rem"),
    },
    footer: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        ...shorthands.margin("1rem"),
        ...shorthands.padding("1rem"),
        color: tokens.colorNeutralForeground2,
        backgroundColor: tokens.colorNeutralBackground2
    },
    infoCard: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "left",
        alignItems: "left",
        ...shorthands.margin("1rem"),
        ...shorthands.padding("1rem"),
        ...shorthands.borderRadius("1rem"),
        color: tokens.colorNeutralForeground2,
        backgroundColor: tokens.colorNeutralBackground2,
    },
    loginForm: {
        display: "flex",
        flexDirection: "column",
        rowGap: "1rem",
        ...shorthands.margin("1rem"),
        ...shorthands.padding("1rem"),
        ...shorthands.borderRadius("1rem"),
        color: tokens.colorNeutralForeground2,
        backgroundColor: tokens.colorNeutralBackground2,
        "& h2": {
            textAlign: "center",
        }
    }
});

export function LoginForm() {
    const style = useStyles();

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
            } else {
                alert("Login Failed");
            }
        }).catch((error) => {
            if (error.response.status === 401) {
                alert("Login Failed: Credenziali Errate!");
            } else {
                alert("Login Failed: " + error.message);
            }
        });
    };

    return (
        <>
            <main className={style.main}>
                <div className={style.container}>
                    <h1>Calendar Exporter<sup>BETA</sup></h1>
                    <form onSubmit={login} className={style.loginForm}>
                        <h2>🚀 Login</h2>
                        <Input type="email" required placeholder="Email" onChange={(e) => { setEmail(e.target.value); }} />
                        <Input type="password" required placeholder="Password" onChange={(e) => { setPassword(e.target.value); }} />
                        <label>
                            <Checkbox checked={remember} onChange={() => setRemember(!remember)} />
                            Ricordami
                        </label>
                        <Button appearance="primary" type="submit">Login</Button>
                    </form>
                    <div className={style.infoCard}>
                        <h3>ℹ️ Informazioni</h3>
                        <span>Esegui il login con le stesse credenziali che utilizzi per accedere al <Link href="https://gestionale.fondazionejobsacademy.org" target="_blank">Gestionale JAC</Link>.</span>
                        <span><strong>Le credenziali verranno inviate al gestionale (passando per <Link>calendar.zucchina.org</Link>), verificate, dopodiché rimarranno salvate su questo dispositivo.</strong></span>
                    </div>
                </div>
            </main>
            <footer className={style.footer}>
                <span>Questo progetto non è sponsorizzato e/o approvato da Fondazione JobsAcademy</span>
            </footer>
        </>
    );
}
