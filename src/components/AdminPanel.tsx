import { Badge, Body1, Button, Dialog, DialogActions, DialogBody, DialogContent, DialogSurface, DialogTitle, DialogTrigger, Subtitle2, makeStyles } from "@fluentui/react-components";
import { ArrowSyncCircleFilled, HandRightRegular, CommentNoteFilled } from "@fluentui/react-icons";
import { useEffect, useState } from "react";
import useRequests from "../libraries/requests/requests";
import { Status } from "../dto/StatusDto";

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
    }
});

export default function AdminPanel() {
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
        return (
            <Dialog modalType="alert" open={isMessagesDialogOpen} onOpenChange={(_event, data) => { setIsMessagesDialogOpen(data.open) }}>
                <DialogSurface>
                    <DialogBody>
                        <DialogTitle>Gestisci Messaggi</DialogTitle>
                        <DialogContent>
                            <Body1>TODO</Body1>
                        </DialogContent>
                    </DialogBody>
                    <DialogActions>
                        <DialogTrigger>
                            <Button appearance="primary">Chiudi</Button>
                        </DialogTrigger>
                    </DialogActions>
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