import { Badge, Body1, Button, Checkbox, Dialog, DialogActions, DialogBody, DialogContent, DialogSurface, DialogTitle, DialogTrigger, Divider, Field, Input, Label, Link, MessageBar, MessageBarActions, MessageBarBody, MessageBarGroup, MessageBarTitle, Select, Subtitle2, makeStyles, shorthands, tokens } from "@fluentui/react-components";
import { ArrowSyncCircleFilled, HandRightRegular, CommentNoteFilled, CommentEditFilled, DismissRegular } from "@fluentui/react-icons";
import { useContext, useEffect, useState } from "react";
import useRequests from "../libraries/requests/requests";
import { Status } from "../dto/StatusDto";
import { MessagesContext } from "../context/MessagesContext";
import { useGlobalStyles } from "../globalStyles";
import { MessageDto } from "../dto/MessageDto";

const useStyles = makeStyles({
    container: {
        display: "flex",
        flexDirection: "column",
        rowGap: "0.5rem",
    },
    blinkAnimation: {
        animationDuration: "1s",
        animationIterationCount: "infinite",
        animationDirection: "alternate",
        animationName: [
            {
                from: {
                    opacity: 0,
                },
                to: {
                    opacity: 1,
                },
            }
        ],
    },
    messageBarGroup: {
        display: "flex",
        flexDirection: "column",
        ...shorthands.margin("0", "0.5rem", "0.5rem", "0.5rem"),
        ...shorthands.gap("0.5rem")
    },
    form: {
        display: "flex",
        flexDirection: "column",
        rowGap: "0.3rem",
        ...shorthands.borderRadius(tokens.borderRadiusXLarge)
    }
});

export default function AdminPanel() {
    const globalStyles = useGlobalStyles();
    const styles = useStyles();
    const requests = useRequests();

    const [status, setStatus] = useState<Status>();
    const [isUpdating, setIsUpdating] = useState(false);
    const [isMessagesDialogOpen, setIsMessagesDialogOpen] = useState(false);

    useEffect(() => {
        getStatus();
    }, []);

    async function getStatus() {
        await requests.administration.status().then((response) => {
            setStatus(response);
        }).catch((error) => {
            console.error(error);
        });
    }

    function updateCache() {
        setIsUpdating(true);
        requests.administration.update().then((response) => {
            if (response) {
                // Wait for the cache to be updated...
                async function checkStatus() {
                    const result = await requests.administration.status();
                    console.log("Waiting for cache update...")

                    if (result.isUpdating === true) {
                        setTimeout(checkStatus, 1000);
                    } else {
                        getStatus();
                        setIsUpdating(false);
                    }
                }
                checkStatus();
            } else {
                setIsUpdating(false);
            }
        }).catch((error) => {
            console.error(error);
        });
    };

    function messagesDialog() {

        const { messages, setMessages } = useContext(MessagesContext);
        const [formError, setFormError] = useState<boolean>(false);
        const [requestInProgress, setRequestInProgress] = useState<boolean>(false);

        const [messageId, setMessageId] = useState<number>();
        const [title, setTitle] = useState<string>("");
        const [body, setBody] = useState<string>("");
        const [intent, setIntent] = useState<"info" | "success" | "warning" | "error">("info");
        const [matchPath, setMatchPath] = useState<string>("");
        const [isDismissable, setIsDismissable] = useState<boolean>(false);
        const [link, setLink] = useState<string>("");
        const [linkText, setLinkText] = useState<string>("");

        function setMessageInForm(message: MessageDto) {
            setMessageId(message.id);
            setTitle(message.title);
            setBody(message.body ? message.body : "");
            setIntent(message.intent);
            setMatchPath(message.matchPath);
            setLink(message.link ? message.link : "");
            setLinkText(message.linkText ? message.linkText : "");
            setIsDismissable(message.isDismissable);
        }

        function resetForm() {
            setMessageId(undefined);
            setTitle("");
            setBody("");
            setIntent("info");
            setMatchPath("");
            setLink("");
            setLinkText("");
            setIsDismissable(false);
        }

        function getMessages() {
            requests.message.all().then((response) => {
                setMessages(response);
            }).catch((error) => {
                console.error(error);
            });
        }

        function removeMessage(message: MessageDto) {
            setRequestInProgress(true);
            requests.message.delete(message.id).then((response) => {
                if (response) {
                    console.log("Message", message.id, "deleted");
                    getMessages();
                } else {
                    console.error("Error while deleting message", message.id, "from database", response);
                }
                setRequestInProgress(false);
            }).catch((error) => {
                console.error(error);
            });
        }

        function addMessage() {
            if (!title || !matchPath || !intent) return setFormError(true);
            setRequestInProgress(true);

            requests.message.create({ id: 999, title, body: body === "" ? undefined : body, intent, matchPath, isDismissable, link: link === "" ? undefined : link, linkText: linkText === "" ? undefined : linkText }).then((response) => {
                if (response) {
                    console.log("Message added");
                    getMessages();
                } else {
                    console.error("Error while adding message to database", response);
                }
                setRequestInProgress(false);
            }).catch((error) => {
                console.error(error);
            });
        }

        function modifyMessage() {
            setRequestInProgress(true);
            if (!messageId || !title || !matchPath || !intent) return setFormError(true);

            requests.message.update({ id: messageId, title, body: body === "" ? undefined : body, intent, matchPath, isDismissable, link: link === "" ? undefined : link, linkText: linkText === "" ? undefined : linkText }).then((response) => {
                if (response) {
                    console.log("Message", messageId, "modified");
                    getMessages();
                } else {
                    console.error("Error while modifying message", messageId, "from database", response);
                }
                setRequestInProgress(false);
            }).catch((error) => {
                console.error(error);
            });
        }

        return (
            <Dialog modalType="alert" open={isMessagesDialogOpen} onOpenChange={(_event, data) => { setIsMessagesDialogOpen(data.open) }}>
                <DialogSurface>
                    <DialogBody>
                        <DialogTitle>Gestisci Messaggi</DialogTitle>
                        <DialogContent className={globalStyles.list}>

                            {messages.length > 0 && <MessageBarGroup className={styles.messageBarGroup} animate="both">
                                {messages.map((message) => (
                                    <MessageBar key={message.id} intent={message.intent}>
                                        <MessageBarBody>
                                            <MessageBarTitle>{message.title}</MessageBarTitle>
                                            {message.body && <Body1>{message.body} </Body1>}
                                            {message.link && <Link href={message.link} target="blank">{message.linkText ? message.linkText : message.link}</Link>}
                                        </MessageBarBody>
                                        <MessageBarActions containerAction={
                                            <>
                                                <Button onClick={() => setMessageInForm(message)} aria-label="modify" appearance="transparent" icon={<CommentEditFilled />} />
                                                <Button onClick={() => removeMessage(message)} aria-label="remove" appearance="transparent" icon={<DismissRegular />} />
                                            </>
                                        } />
                                    </MessageBar>
                                ))}
                            </MessageBarGroup>}

                            <Divider />

                            <Subtitle2>{!messageId ? "Aggiungi Messaggio" : "Modifica Messaggio N." + messageId}</Subtitle2>
                            <form onSubmit={!messageId ? addMessage : modifyMessage} className={styles.form}>
                                <Field label="Titolo" required validationState={formError ? "error" : "none"}>
                                    <Input type="text" required placeholder="Titolo" value={title} onChange={(e) => { setTitle(e.target.value); }} />
                                </Field>
                                <Field label="Corpo" validationState={formError ? "error" : "none"}>
                                    <Input type="text" placeholder="Corpo" value={body} onChange={(e) => { setBody(e.target.value); }} />
                                </Field>
                                <Field label="Percorso" required validationState={formError ? "error" : "none"}>
                                    <Input type="text" placeholder="Percorso" value={matchPath} onChange={(e) => { setMatchPath(e.target.value); }} />
                                </Field>
                                <Field label="Intento" required validationState={formError ? "error" : "none"}>
                                    <Select placeholder="Intento" value={intent} onChange={(e) => { setIntent(e.target.value as any); }}>
                                        <option value="info">Informazione</option>
                                        <option value="success">Successo</option>
                                        <option value="warning">Attenzione</option>
                                        <option value="error">Errore</option>
                                    </Select>
                                </Field>
                                <Field label="Link" validationState={formError ? "error" : "none"}>
                                    <Input type="text" placeholder="Link" value={link} onChange={(e) => { setLink(e.target.value); }} />
                                </Field>
                                <Field label="Testo Link" validationState={formError ? "error" : "none"}>
                                    <Input type="text" placeholder="Testo Link" value={linkText} onChange={(e) => { setLinkText(e.target.value); }} />
                                </Field>
                                <Label>
                                    <Checkbox checked={isDismissable} onChange={() => setIsDismissable(!isDismissable)} />
                                    Dismissable
                                </Label>
                                <Button appearance="primary" disabled={requestInProgress} type="submit">{!messageId ? "Aggiungi" : "Modifica"}</Button>
                                <Button appearance="secondary" disabled={requestInProgress} onClick={resetForm}>Rimuovi Selezioni</Button>
                            </form>

                        </DialogContent>
                        <DialogActions>
                            <DialogTrigger>
                                <Button appearance="secondary">Chiudi</Button>
                            </DialogTrigger>
                        </DialogActions>
                    </DialogBody>
                </DialogSurface>
            </Dialog>
        );
    }

    return (
        <>
            <div className={styles.container}>
                <Subtitle2>Admin Panel</Subtitle2>
                {status?.lastRefreshError && <Badge appearance="filled" color="severe">Errore durante l'ultimo aggiornamento!</Badge>}
                <Body1>Ultimo aggiornamento: {status?.lastRefresh.toLocaleDateString([], { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit", second: "2-digit" })}</Body1>
                <Button appearance="secondary" icon={<CommentNoteFilled />} onClick={() => setIsMessagesDialogOpen(true)}>Gestisci Messaggi</Button>
                {messagesDialog()}
                <Button appearance="primary" icon={!isUpdating ? <ArrowSyncCircleFilled /> : <HandRightRegular className={styles.blinkAnimation} />} disabled={isUpdating} onClick={updateCache}>{!isUpdating ? "Aggiorna ORA!" : "Aggiornamento in corso..."}</Button>
            </div>
        </>
    );
}