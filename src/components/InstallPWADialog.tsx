import { Body1, Button, Dialog, DialogActions, DialogBody, DialogContent, DialogSurface, DialogTitle, DialogTrigger, Subtitle2, Tab, TabList, makeStyles, shorthands } from "@fluentui/react-components";
import { useEffect, useState } from "react";
import { createFluentIcon } from "@fluentui/react-icons";

const chromePath: string[] = [
    "M 24.203382,11.267795 H 44.7812 a 23.759075,22.529868 0 0 0 -41.1571203,0.0027 l 10.2889083,16.898974 0.0092,-0.0023 A 11.867903,11.253901 0 0 1 24.203382,11.267795 Z",
    "M 33.5,24 A 9.5,9.5 0 0 1 24,33.5 9.5,9.5 0 0 1 14.5,24 9.5,9.5 0 0 1 24,14.5 9.5,9.5 0 0 1 33.5,24 Z",
    "M 35.198423,30.0029 25.424173,48 A 22.570722,23.994 0 0 0 44.970886,12.0031 H 25.42248 l -0.0023,0.0093 a 11.274073,11.985 0 0 1 9.778294,17.9905 z",
    "M 13.6086,30.0031 3.218,12.006 A 23.994,23.994 0 0 0 24.0025,48 L 34.3931,30.0029 34.3864,29.9961 a 11.9852,11.9852 0 0 1 -20.7778,0.007 z"
];
const safariPath: string[] = [
    "m12.71 11.96v.016c0 .225-.084.431-.222.588l.001-.001c-.13.156-.325.255-.542.255-.005 0-.01 0-.015 0h.001c-.005 0-.01 0-.016 0-.225 0-.431-.084-.588-.222l.001.001c-.156-.13-.255-.325-.255-.542 0-.005 0-.01 0-.015v.001c0-.004 0-.009 0-.014 0-.227.087-.434.229-.589l-.001.001c.134-.156.331-.254.551-.254h.009.01c.223 0 .427.084.581.222l-.001-.001c.157.13.256.325.256.544v.013-.001zm.2.777 4.69-7.782q-.121.107-.904.837t-1.68 1.56-1.828 1.701-1.567 1.48c-.242.216-.463.441-.668.68l-.008.009-4.674 7.768q.094-.094.898-.83t1.687-1.56q.88-.824 1.822-1.701t1.563-1.486q.63-.613.67-.676zm8.666-.737v.061c0 1.817-.519 3.513-1.416 4.947l.023-.039-.228-.147q-.187-.121-.355-.221c-.063-.046-.137-.081-.217-.1l-.004-.001c-.007-.001-.015-.002-.022-.002-.085 0-.154.069-.154.154 0 .008.001.016.002.023v-.001q0 .134.79.59c-.671 1.007-1.492 1.854-2.442 2.531l-.029.02c-.921.664-2.002 1.175-3.17 1.466l-.065.014-.214-.895q-.014-.134-.201-.134c-.048.001-.089.031-.107.073v.001c-.018.028-.029.061-.029.098 0 .01.001.021.003.031v-.001l.214.91c-.583.126-1.252.198-1.938.198-.006 0-.013 0-.019 0h.001c-.008 0-.017 0-.026 0-1.835 0-3.547-.524-4.996-1.43l.04.023q.014-.026.174-.274t.288-.449c.056-.072.099-.157.126-.249l.001-.005c.001-.007.002-.015.002-.022 0-.085-.069-.154-.154-.154-.008 0-.016.001-.023.002h.001q-.08 0-.228.194c-.1.133-.2.284-.29.441l-.011.021q-.154.268-.181.308c-1.016-.681-1.87-1.515-2.55-2.481l-.02-.03c-.666-.932-1.176-2.028-1.461-3.21l-.013-.064.922-.202c.079-.023.135-.094.135-.179 0-.008 0-.016-.001-.023v.001c-.001-.048-.031-.089-.073-.107h-.001c-.03-.018-.067-.029-.106-.029-.012 0-.024.001-.036.003h.001l-.91.201c-.116-.559-.183-1.202-.185-1.86v-.002c0-.019 0-.041 0-.063 0-1.861.544-3.594 1.482-5.05l-.022.037q.026.014.248.16t.4.254c.067.048.145.085.23.106l.005.001q.174 0 .174-.16 0-.08-.167-.207c-.124-.093-.266-.188-.413-.276l-.022-.012-.268-.16c.691-1 1.532-1.841 2.5-2.511l.032-.021c.932-.651 2.026-1.147 3.205-1.42l.063-.012.201.898q.026.134.201.134c.048-.001.089-.031.107-.073v-.001c.018-.03.029-.067.029-.106 0-.012-.001-.024-.003-.036v.001l-.201-.88c.537-.108 1.157-.173 1.791-.178h.005.037c1.869 0 3.611.544 5.076 1.483l-.038-.023c-.206.251-.381.538-.514.847l-.009.023q0 .174.16.174.147 0 .64-.857c1.95 1.336 3.366 3.328 3.938 5.652l.014.066-.75.16q-.134.026-.134.214c.001.048.031.089.073.107h.001c.028.018.061.029.098.029.01 0 .021-.001.031-.003h-.001l.763-.174c.118.563.187 1.21.19 1.873v.003zm1.138 0c0-.01 0-.022 0-.035 0-1.493-.313-2.913-.877-4.197l.026.067c-1.093-2.588-3.111-4.606-5.63-5.673l-.069-.026c-1.229-.538-2.66-.85-4.165-.85s-2.937.313-4.234.877l.069-.027c-2.588 1.093-4.605 3.111-5.672 5.63l-.026.069c-.538 1.229-.85 2.66-.85 4.165s.313 2.937.877 4.234l-.027-.069c1.093 2.588 3.111 4.605 5.63 5.672l.069.026c1.229.538 2.66.85 4.165.85s2.937-.313 4.234-.877l-.069.027c2.588-1.093 4.605-3.111 5.672-5.629l.026-.069c.538-1.218.85-2.637.85-4.13 0-.012 0-.025 0-.037v.002zm1.286 0v.033c0 1.672-.35 3.263-.981 4.703l.029-.075c-1.222 2.903-3.485 5.166-6.311 6.359l-.077.029c-1.375.601-2.977.951-4.661.951s-3.286-.35-4.738-.981l.077.03c-2.903-1.222-5.166-3.485-6.359-6.311l-.029-.077c-.601-1.375-.951-2.977-.951-4.661s.35-3.286.981-4.738l-.03.077c1.222-2.903 3.485-5.166 6.311-6.359l.077-.029c1.375-.601 2.977-.951 4.661-.951s3.286.35 4.738.981l-.077-.03c2.903 1.222 5.166 3.485 6.359 6.311l.029.077c.601 1.364.951 2.955.951 4.627v.035-.002z"
];
const edgePath: string[] = [
    "M15.95 1.079c0.007 0 0.014 0 0.022 0 1.469 0 2.896 0.178 4.261 0.513l-0.122-0.025c1.453 0.341 2.732 0.835 3.919 1.478l-0.082-0.041c1.251 0.682 2.327 1.484 3.276 2.414l-0.002-0.002c0.975 0.964 1.8 2.076 2.439 3.301l0.035 0.073c0.375 0.7 0.699 1.514 0.931 2.366l0.019 0.083c0.222 0.77 0.35 1.654 0.35 2.568 0 0.011-0 0.022-0 0.033v-0.002c0 0.010 0 0.022 0 0.034 0 0.744-0.105 1.464-0.301 2.145l0.013-0.055c-0.412 1.363-1.192 2.511-2.225 3.365l-0.012 0.009c-0.522 0.432-1.119 0.801-1.764 1.081l-0.048 0.019c-0.396 0.182-0.859 0.337-1.342 0.442l-0.046 0.008c-0.435 0.103-0.935 0.162-1.449 0.162h-0q-0.525 0-1.212-0.037c-0.515-0.030-0.988-0.083-1.452-0.161l0.078 0.011c-0.504-0.092-0.945-0.213-1.369-0.368l0.057 0.018c-0.405-0.149-0.754-0.361-1.053-0.628l0.003 0.003c-0.11-0.086-0.205-0.185-0.285-0.296l-0.003-0.004c-0.077-0.116-0.123-0.259-0.125-0.412v-0c0.018-0.171 0.091-0.322 0.2-0.438l-0 0c0.143-0.18 0.287-0.384 0.42-0.596l0.017-0.029c0.172-0.245 0.323-0.525 0.44-0.822l0.010-0.027c0.127-0.331 0.201-0.714 0.201-1.114 0-0.026-0-0.051-0.001-0.077l0 0.004c0-0.018 0-0.038 0-0.059 0-0.865-0.184-1.687-0.515-2.428l0.015 0.038c-0.349-0.787-0.794-1.464-1.33-2.056l0.006 0.006c-0.549-0.613-1.174-1.142-1.863-1.578l-0.036-0.021c-0.642-0.419-1.38-0.794-2.158-1.086l-0.079-0.026c-0.61-0.227-1.334-0.418-2.080-0.54l-0.069-0.009c-0.659-0.111-1.418-0.175-2.192-0.175-0.003 0-0.005 0-0.008 0h0c-1.364 0.001-2.68 0.206-3.918 0.587l0.094-0.025c-1.315 0.395-2.458 0.988-3.462 1.756l0.026-0.019c0.61-1.495 1.37-2.785 2.287-3.945l-0.026 0.034c0.902-1.131 1.94-2.102 3.101-2.905l0.048-0.031c1.113-0.772 2.398-1.406 3.774-1.835l0.1-0.027c1.316-0.412 2.83-0.65 4.399-0.65 0.026 0 0.053 0 0.079 0l-0.004-0zM8.952 21.736c0 0.004 0 0.010 0 0.015 0 0.949 0.123 1.87 0.354 2.747l-0.017-0.075c0.249 0.966 0.583 1.81 1.005 2.599l-0.030-0.062c0.451 0.841 0.966 1.567 1.558 2.221l-0.008-0.009c0.602 0.668 1.284 1.246 2.035 1.726l0.040 0.024c-1.305-0.178-2.485-0.501-3.595-0.96l0.096 0.035c-1.184-0.493-2.204-1.067-3.146-1.744l0.046 0.032c-0.976-0.708-1.828-1.489-2.584-2.356l-0.016-0.018c-0.734-0.85-1.39-1.805-1.934-2.828l-0.041-0.083c-0.511-0.953-0.943-2.060-1.24-3.22l-0.022-0.104c-0.286-1.072-0.45-2.302-0.45-3.57 0-0.010 0-0.020 0-0.030v0.002c-0-0.014-0-0.030-0-0.047 0-0.659 0.148-1.283 0.411-1.842l-0.011 0.026c0.273-0.592 0.621-1.1 1.039-1.539l-0.002 0.002c0.438-0.453 0.93-0.85 1.467-1.181l0.032-0.019c0.48-0.298 1.036-0.576 1.618-0.801l0.069-0.024c0.534-0.203 1.165-0.373 1.817-0.48l0.058-0.008c0.582-0.095 1.253-0.149 1.936-0.15h0.001c0.627 0.001 1.242 0.046 1.844 0.133l-0.069-0.008c0.671 0.113 1.26 0.265 1.828 0.461l-0.079-0.024c0.643 0.22 1.188 0.46 1.708 0.741l-0.059-0.029c0.55 0.308 1.025 0.652 1.456 1.043l-0.006-0.006c-0.31 0-0.612 0.032-0.904 0.092l0.029-0.005c-0.307 0.067-0.579 0.166-0.831 0.296l0.019-0.009v-0.025c-0.572 0.26-1.066 0.569-1.511 0.934l0.012-0.009c-0.485 0.394-0.915 0.82-1.3 1.284l-0.012 0.015c-0.384 0.462-0.743 0.977-1.058 1.521l-0.029 0.054c-0.283 0.487-0.556 1.059-0.784 1.653l-0.028 0.084c-0.199 0.5-0.38 1.103-0.511 1.723l-0.014 0.076c-0.116 0.517-0.184 1.112-0.187 1.722v0.003zM28.321 23.323c0.126 0.002 0.237 0.060 0.312 0.149l0.001 0.001c0.073 0.084 0.119 0.192 0.125 0.311l0 0.001c-0.016 0.154-0.065 0.294-0.14 0.417l0.002-0.004-0.4 0.575-0.537 0.662-0.55 0.625q-0.262 0.312-0.475 0.525l-0.275 0.287c-0.5 0.453-1.047 0.881-1.623 1.267l-0.051 0.032c-0.568 0.387-1.223 0.766-1.906 1.096l-0.093 0.041c-0.608 0.293-1.33 0.566-2.078 0.777l-0.096 0.023c-0.624 0.184-1.341 0.293-2.083 0.3l-0.004 0c-0.013 0-0.029 0-0.045 0-0.74 0-1.451-0.128-2.111-0.364l0.044 0.014c-0.706-0.25-1.318-0.58-1.868-0.988l0.019 0.013c-0.577-0.428-1.078-0.909-1.512-1.447l-0.012-0.015c-0.423-0.524-0.805-1.114-1.123-1.742l-0.026-0.057c-0.29-0.572-0.539-1.238-0.711-1.934l-0.014-0.066c-0.158-0.627-0.25-1.346-0.25-2.087v-0c0-0 0-0 0-0.001 0-0.876 0.146-1.718 0.416-2.503l-0.016 0.054c0.293-0.859 0.661-1.602 1.111-2.288l-0.023 0.038c0.12 0.825 0.361 1.57 0.706 2.254l-0.019-0.042c0.361 0.715 0.786 1.331 1.281 1.882l-0.007-0.008c0.506 0.569 1.072 1.068 1.693 1.492l0.032 0.020c0.591 0.416 1.265 0.792 1.977 1.097l0.073 0.028c0.622 0.27 1.361 0.511 2.126 0.683l0.086 0.016c0.675 0.156 1.451 0.247 2.247 0.25h0.002c0.007 0 0.016 0 0.024 0 0.957 0 1.889-0.109 2.783-0.316l-0.083 0.016c0.975-0.216 1.835-0.526 2.639-0.929l-0.065 0.029 0.25-0.125z"
];
const firefoxPath: string[] = [
    "M 50.785817 0.0067603932 C 41.055409 5.7040712 37.748566 16.244814 37.445879 21.52728 C 37.894542 21.496408 38.339748 21.459656 38.796381 21.459656 A 19.56 19.56 0 0 1 55.776111 31.376597 A 13.38 13.38 0 0 0 46.431989 29.107197 C 60.372975 36.07719 56.632599 60.082255 37.312619 59.176256 A 17.24 17.24 0 0 1 32.270612 58.203656 C 31.891279 58.060989 31.512261 57.906239 31.132928 57.73824 C 30.913928 57.63924 30.694561 57.537973 30.478561 57.425973 C 25.749566 54.985976 21.837246 50.360364 21.349246 44.74637 C 21.349246 44.74637 23.138143 38.079384 34.158132 38.079384 C 35.349131 38.079384 38.756248 34.753202 38.820248 33.789203 L 38.818259 33.781247 C 38.803259 33.466247 32.058389 30.783274 29.428391 28.192277 C 28.029791 26.813585 27.364133 26.145668 26.775122 25.646411 A 11.59 11.59 0 0 0 26.765177 25.638455 A 11.59 11.59 0 0 0 25.776665 24.888618 A 17.97 17.97 0 0 1 25.667273 15.415214 A 28.7 28.7 0 0 0 16.337073 22.625185 L 16.319173 22.625185 C 14.783174 20.678187 14.892604 14.258082 14.980604 12.917083 A 6.928 6.928 0 0 0 13.685793 13.605263 A 28.22 28.22 0 0 0 9.898818 16.849252 A 33.84 33.84 0 0 0 6.2749375 21.197113 A 32.73 32.73 0 0 0 1.0758027 32.93594 L 1.0221008 33.192516 C 0.94910091 33.533515 0.68720992 35.240088 0.64220996 35.611088 C 0.64220996 35.640088 0.63526517 35.667613 0.63226517 35.696613 A 36.94 36.94 0 0 0 0.0037546171 41.040942 L 0.0037546171 41.239838 A 38.76 38.76 0 0 0 76.95453 47.793452 C 77.01953 47.293453 77.071558 46.798778 77.129558 46.293778 A 39.86 39.86 0 0 0 74.615516 26.823874 C 72.930583 22.773671 69.518249 18.402574 66.844659 17.020303 A 40.27 40.27 0 0 1 70.770861 28.779019 L 70.776828 28.844655 C 66.394832 17.924666 58.966094 13.514997 52.8961 3.9250066 C 52.589101 3.4400071 52.282169 2.9542438 51.983169 2.4412443 C 51.812169 2.1482446 51.676532 1.8846832 51.557532 1.6416834 A 7.053 7.053 0 0 1 50.978745 0.10620827 A 0.1 0.1 0 0 0 50.891231 0.0067603932 A 0.138 0.138 0 0 0 50.81764 0.0067603932 C 50.81264 0.0067603932 50.805739 0.014705183 50.799739 0.016705181 C 50.793739 0.018705179 50.780894 0.028616844 50.771894 0.03261684 L 50.785817 0.0067603932 z M 33.921446 22.135901 A 19.39 19.39 0 0 0 33.18951 22.356675 A 19.39 19.39 0 0 1 33.921446 22.135901 z M 30.478561 23.400878 A 19.39 19.39 0 0 0 29.786404 23.729056 A 19.39 19.39 0 0 1 30.478561 23.400878 z M 70.778817 28.818798 L 70.784784 28.860566 L 70.778817 28.856588 L 70.778817 28.818798 z M 29.949498 57.169398 C 30.130498 57.256398 30.300517 57.350929 30.486517 57.433929 L 30.514362 57.45183 C 30.326362 57.36183 30.137498 57.266731 29.949498 57.169398 z "
];

const Chrome = createFluentIcon("chrome", "48", chromePath);
const Safari = createFluentIcon("safari", "24", safariPath);
const Edge = createFluentIcon("edge", "32", edgePath);
const Firefox = createFluentIcon("edge", "80", firefoxPath);

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
                    <Tab icon={<Chrome />} value="chrome">Chrome</Tab>
                    <Tab icon={<Safari />} value="safari">Safari</Tab>
                    <Tab icon={<Edge />} value="edge">Edge</Tab>
                    <Tab icon={<Firefox />} value="firefox">Firefox</Tab>
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
