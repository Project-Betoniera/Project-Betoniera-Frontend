import { Body1, Button, Dialog, DialogActions, DialogBody, DialogContent, DialogSurface, DialogTitle, DialogTrigger, Display, Subtitle2, Tab, TabList, makeStyles, shorthands } from "@fluentui/react-components";
import { useEffect, useState } from "react";

const useStyles = makeStyles({
    icon:{
        height: "1rem"
    },
    tabList:{
        marginBottom: "1rem"
    },
    instructions:{
        display: "flex",
        flexDirection: "column",
        ...shorthands.gap("0.5rem")
    },
    section:{
        display: "flex",
        flexDirection: "column",
    }
});

export default function InstallPWADialog() {
    const styles = useStyles();
    const [isPwa] = useState(window.matchMedia('(display-mode: standalone)').matches);
    const [acknowledged, setAcknowledgedState] = useState(window.localStorage.getItem("isPwaDialogAcknowledged") === "true");
    const [installPromptFailed, setInstallPromptFailed] = useState(false);
    const [browser, setBrowser] = useState("chrome");

    let beforeInstallPromptEvent: any;

    const setAcknowledged = (enabled: boolean) => {
        if (enabled) {
            window.localStorage.setItem("isPwaDialogAcknowledged", "true");
        } else {
            window.localStorage.removeItem("isPwaDialogAcknowledged");
        }
        setAcknowledgedState(enabled);
    }

    useEffect(() => {
        const catchBeforeInstallPrompt = (e: Event) => {
            e.preventDefault();
            beforeInstallPromptEvent = e;
        };

        const storedVersion = window.localStorage.getItem("isPwaDialogAcknowledged");
        setAcknowledgedState(storedVersion === "true");

        window.addEventListener("beforeinstallprompt", catchBeforeInstallPrompt);

        return () => {
            window.removeEventListener("beforeinstallprompt", catchBeforeInstallPrompt);
        };

    }, []);

    async function install() {
        try {
            await beforeInstallPromptEvent.prompt();
            setAcknowledged(true);
        } catch (error) {
            setInstallPromptFailed(true);
        }
    }

    function renderTutorial() {

        function renderContent() {
            switch (browser) {
                case "chrome":
                    return (
                        <div className={styles.instructions}>
                            <Subtitle2>Desktop</Subtitle2>
                            <div className={styles.section}>
                                <Body1>1. Apri il menu in alto a destra [TODO icon]</Body1>
                                <Body1>2. Seleziona <b>Installa Calendar Exporter</b></Body1>
                                <Body1>3. Seleziona <b>Installa</b> nel popup</Body1>
                            </div>
                            <Subtitle2>Android</Subtitle2>
                            <div className={styles.section}>
                                <Body1>1. Apri il menu in alto a destra [TODO icon]</Body1>
                                <Body1>2. Seleziona <b>Installa app</b></Body1>
                                <Body1>3. Seleziona <b>Installa</b> nel popup</Body1>
                            </div>
                        </div>
                    )
                case "safari":
                    return (
                        <div className={styles.instructions}>
                            <Subtitle2>iOS</Subtitle2>
                            <div className={styles.section}>
                                <Body1>1. Seleziona l'icona di condivisione <img alt="Icona di condivisione di Safari" className={styles.icon} src="data:image/png;base64,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"></img></Body1>
                                <Body1>2. Scorri verso il basso</Body1>
                                <Body1>3. Seleziona <b>Aggiungi alla schermata Home</b> [TODO icon]</Body1>
                                <Body1>4. Seleziona <b>Aggiungi</b> in alto a destra</Body1>
                            </div>
                            <Subtitle2>MacOS</Subtitle2>
                            <div className={styles.section}>
                                <Body1>1. Seleziona l'icona di condivisione <img alt="Icona di condivisione di Safari" className={styles.icon} src="data:image/png;base64,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"></img></Body1>
                                <Body1>2. Seleziona <b>Aggiungi al Dock</b> [TODO icon]</Body1>
                                <Body1>3. Seleziona <b>Aggiungi</b> in alto a destra</Body1>
                            </div>
                        </div>
                    )
                case "edge":
                    return (
                        <div className={styles.instructions}>
                            <Subtitle2>Desktop</Subtitle2>
                            <div className={styles.section}>
                                <Body1>1. Apri il menu in alto a destra [TODO icon]</Body1>
                                <Body1>2. Seleziona <b>App</b></Body1>
                                <Body1>3. Seleziona <b>Installa</b> nel popup</Body1>
                            </div>
                            <Subtitle2>Android</Subtitle2>
                            <div className={styles.section}>
                                <Body1>1. Apri il menu in basso a destra [TODO icon]</Body1>
                                <Body1>2. Scorri a destra</Body1>
                                <Body1>3. Seleziona <b>Aggiungi al telefono</b> [TODO icon]</Body1>
                            </div>
                        </div>
                    )
                case "firefox":
                    return (
                        <div className={styles.instructions}>
                            <Subtitle2>Android</Subtitle2>
                            <div className={styles.section}>
                                <Body1>1. Apri il menu in basso a destra [TODO icon]</Body1>
                                <Body1>2. Scorri a destra</Body1>
                                <Body1>3. Seleziona <b>Aggiungi al telefono</b> [TODO icon]</Body1>
                            </div>
                        </div>
                    )
            }
        }

        return (
            <>
                <TabList className={styles.tabList} defaultSelectedValue="chrome" appearance="transparent" onTabSelect={(_event, data) => { setBrowser(data.value as string) }}>
                    <Tab value="chrome">Chrome</Tab>
                    <Tab value="safari">Safari</Tab>
                    <Tab value="edge">Edge</Tab>
                    <Tab value="firefox">Firefox</Tab>
                </TabList>
                {renderContent()}
            </>
        )
    }

    return (
        <>
            <Dialog open={!acknowledged && !isPwa} modalType="modal">
                <DialogSurface>
                    <DialogBody>
                        <DialogTitle>📲 Installa la nostra App!</DialogTitle>
                        <DialogContent>
                            {installPromptFailed ? renderTutorial() : "Installa l'app per accedere più velocemente al sito!"}
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => { install() }} appearance="primary" disabled={installPromptFailed}>Installa</Button>
                            <DialogTrigger>
                                <Button onClick={() => { setAcknowledged(true) }} appearance={installPromptFailed ? "primary" : "secondary"}>Chiudi</Button>
                            </DialogTrigger>
                        </DialogActions>
                    </DialogBody>
                </DialogSurface>
            </Dialog>
        </>
    )
}
