import { Dialog, DialogBody, DialogContent, DialogSurface, DialogTitle } from "@fluentui/react-components";
import { useEffect, useState } from "react";

export default function OfflineDialog() {
    const [isOffline, setOffline] = useState(!navigator.onLine);

    useEffect(() => {
        const goOnline = () => setOffline(false);
        const goOffline = () => setOffline(true);

        window.addEventListener("online", goOnline);
        window.addEventListener("offline", goOffline);

        return () => {
            window.removeEventListener("online", goOnline);
            window.removeEventListener("offline", goOffline);
        };
    }, []);

    return (
    <Dialog open={isOffline}>
        <DialogSurface>
            <DialogBody>
                <DialogTitle>🚫 Sei offline</DialogTitle>
                <DialogContent>
                    Connettiti ad una rete per utilizzare l'applicazione.
                </DialogContent>
            </DialogBody>
        </DialogSurface>
    </Dialog>
    )
}
