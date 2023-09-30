import { FormEvent, useContext, useState } from "react";
import { TokenContext } from "../context/TokenContext";
import axios from "axios";
import { apiUrl } from "../config";
import { CourseContext } from "../context/CourseContext";
import { CourseDto } from "../dto/CourseDto";
import { Body1, Button, Card, CardHeader, Checkbox, Input, Label, LargeTitle, Link, Subtitle2, tokens } from "@fluentui/react-components";
import { makeStyles } from '@fluentui/react-components';
import { shorthands } from '@fluentui/react-components';
import { useGlobalStyles } from "../globalStyle";

const useStyles = makeStyles({
    infoCard: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "left",
        alignItems: "left",
        ...shorthands.margin("1rem"),
        ...shorthands.padding("1rem"),
        ...shorthands.borderRadius(tokens.borderRadiusXLarge),
        ...shorthands.gap("0.5rem"),
        backgroundColor: tokens.colorNeutralBackground2,
    },
    loginForm: {
        display: "flex",
        flexDirection: "column",
        rowGap: "1rem",
        ...shorthands.borderRadius(tokens.borderRadiusXLarge),
        backgroundColor: tokens.colorNeutralBackground2,
        "& h2": {
            textAlign: "center",
        }
    },
    mainContainer: {
        ...shorthands.gap("1rem"),
        flexGrow: 1
    }
});

export function LoginForm() {
    const styles = useStyles();
    const globalStyles = useGlobalStyles();

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
            <main className={globalStyles.main}>
                <div className={globalStyles.container + styles.mainContainer}>
                    <LargeTitle>Calendar Exporter<sup>BETA</sup></LargeTitle>
                    <Card className={styles.loginForm}>
                        <form onSubmit={login} className={styles.loginForm}>
                            <h2>🚀 Login</h2>
                            <Input type="email" required placeholder="Email" onChange={(e) => { setEmail(e.target.value); }} />
                            <Input type="password" required placeholder="Password" onChange={(e) => { setPassword(e.target.value); }} />
                            <Label>
                                <Checkbox checked={remember} onChange={() => setRemember(!remember)} />
                                Ricordami
                            </Label>
                            <Button appearance="primary" type="submit">Login</Button>
                        </form>
                    </Card>
                    <Card className={styles.infoCard}>
                        <CardHeader
                            header={
                                <Subtitle2>ℹ️ Informazioni</Subtitle2>
                            }
                            description={
                                <Body1>
                                    Esegui il login con le stesse credenziali che utilizzi per accedere al <Link href="https://gestionale.fondazionejobsacademy.org" target="_blank">Gestionale JAC</Link>.
                                    <br />
                                    Le credenziali verranno inviate al gestionale (passando per <Link href={window.location.toString()}>calendar.zucchina.org</Link>), verificate, dopodiché <strong>rimarranno salvate su questo dispositivo</strong>.
                                </Body1>
                            }
                        />
                    </Card>
                </div>
            </main>
            <footer>
                <Card className={globalStyles.footer}>
                    <Body1>Questo progetto non è sponsorizzato e/o approvato da Fondazione JobsAcademy</Body1>
                </Card>
            </footer>
        </>
    );
}
