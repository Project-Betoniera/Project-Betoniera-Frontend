import { FormEvent, useContext, useState } from "react";
import { TokenContext } from "../context/TokenContext";
import axios from "axios";
import { apiUrl } from "../config";
import { CourseContext } from "../context/CourseContext";
import { CourseDto } from "../dto/CourseDto";
import { Body1, Button, Card, CardHeader, Checkbox, Field, Input, Label, LargeTitle, Link, Spinner, Subtitle2, Toast, ToastBody, ToastTitle, Toaster, tokens, useId, useToastController } from "@fluentui/react-components";
import { makeStyles } from '@fluentui/react-components';
import { shorthands } from '@fluentui/react-components';
import { encode as toBase64 } from "base-64";

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
    },
    title: {
        textAlign: "center",
    },
    loginForm: {
        display: "flex",
        flexDirection: "column",
        rowGap: "1rem",
        ...shorthands.borderRadius(tokens.borderRadiusXLarge),

        "& h2": {
            textAlign: "center",
        }
    },
    loginMain: {
        display: "flex",
        flexDirection: "column",
        alignItems: "stretch",
        justifyContent: "center",
        flexGrow: 1,
    },
    loginContainer: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        ...shorthands.gap("2rem"),
    },
    footer: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        ...shorthands.margin("0.5rem"),
        ...shorthands.padding("1rem"),
        ...shorthands.borderRadius(tokens.borderRadiusXLarge),
    }
});

export function LoginForm() {
    const styles = useStyles();

    const { setTokenData } = useContext(TokenContext);
    const { setCourse } = useContext(CourseContext);

    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [remember, setRemember] = useState<boolean>(true);

    const toasterId = useId("toaster");
    const { dispatchToast } = useToastController(toasterId);
    const [loginError, setLoginError] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const login = async (e: FormEvent) => {
        e.preventDefault();

        setIsLoading(true);

        axios.post(new URL("login", apiUrl).toString(), {}, {
            headers: { Authorization: `Basic ${toBase64(`${email}:${password}`)}` }
        }).then((response) => {
            if (response.status === 200) {
                setTokenData({ token: response.data.token, remember: remember });
                setCourse(response.data.course as CourseDto);
            } else {
                throw new Error("Errore durante il login");
            }

            setIsLoading(false);
        }).catch((error) => {
            setLoginError(true);
            if (error.response?.status === 401) {
                dispatchToast(
                    <Toast>
                        <ToastTitle>Errore Login!</ToastTitle>
                        <ToastBody>
                            Le credenziali inserite non sono corrette.
                        </ToastBody>
                    </Toast>,
                    { intent: "error" }
                );
            } else {
                dispatchToast(
                    <Toast>
                        <ToastTitle>Errore Login!</ToastTitle>
                        <ToastBody>
                            Si è verificato un errore durante il login.
                        </ToastBody>
                    </Toast>,
                    { intent: "error" }
                );
            }

            setIsLoading(false);
        });
    };

    return (
        <>
            <main className={styles.loginMain}>
                <div className={styles.loginContainer}>
                    <LargeTitle className={styles.title}>Calendar Exporter<sup>BETA</sup></LargeTitle>
                    <Card className={styles.loginForm}>
                        <form onSubmit={login} className={styles.loginForm}>
                            <h2>🚀 Login</h2>
                            <Field validationState={loginError ? "error" : "none"}>
                                <Input disabled={isLoading} type="email" required placeholder="Email" onChange={(e) => { setEmail(e.target.value); }} />
                            </Field>
                            <Field validationState={loginError ? "error" : "none"}>
                                <Input disabled={isLoading} type="password" required placeholder="Password" onChange={(e) => { setPassword(e.target.value); }} />
                            </Field>
                            <Label>
                                <Checkbox disabled={isLoading} checked={remember} onChange={() => setRemember(!remember)} />
                                Ricordami
                            </Label>
                            {isLoading ? <Spinner size="huge" /> : <Button appearance="primary" type="submit">Login</Button>}
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
                                    Le credenziali verranno inviate al gestionale (passando per <Link href={window.location.toString()}>betoniera.org</Link>), verificate, dopodiché <strong>rimarranno salvate su questo dispositivo</strong>.
                                </Body1>
                            }
                        />
                    </Card>
                </div>
                <Toaster toasterId={toasterId} />
            </main>
            <footer>
                <Card className={styles.footer}>
                    <Body1>Questo progetto non è sponsorizzato e/o approvato da Fondazione JobsAcademy</Body1>
                </Card>
            </footer>
        </>
    );
}

