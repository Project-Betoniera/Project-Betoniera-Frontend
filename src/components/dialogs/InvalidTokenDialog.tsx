import { Body1, Button, Dialog, DialogActions, DialogBody, DialogContent, DialogSurface, DialogTitle } from "@fluentui/react-components";
import { ArrowExitFilled } from "@fluentui/react-icons";
import { useContext } from "react";
import { UserContext } from "../../context/UserContext";

export default function InvalidTokenDialog() {
    const { logout, hasError } = useContext(UserContext);

    return (
        <Dialog open={hasError}>
            <DialogSurface>
                <DialogBody>
                    <DialogTitle>🛂 Esegui di nuovo l'accesso</DialogTitle>
                    <DialogContent>
                        <Body1>Sembra che il tuo token non sia più valido. Per favore, esegui di nuovo il login.</Body1><br />
                        <Body1>Se hai dei calendari sincronizzati, rimuovili e sincronizzali di nuovo.</Body1><br />
                        <Body1>Ci scusiamo per il disagio.</Body1>
                    </DialogContent>
                    <DialogActions>
                        <Button appearance="primary" style={{ alignSelf: "center" }} icon={<ArrowExitFilled />} onClick={() => { logout(); }} aria-description="logout">Logout</Button>
                    </DialogActions>
                </DialogBody>
            </DialogSurface>
        </Dialog>
    );
}
