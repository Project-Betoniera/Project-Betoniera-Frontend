import {
  Body1,
  Button,
  Dialog,
  DialogActions,
  DialogBody,
  DialogContent,
  DialogSurface,
  DialogTitle,
} from "@fluentui/react-components";
import { ArrowExitFilled, ArrowRepeatAllFilled } from "@fluentui/react-icons";
import { FunctionComponent, useContext } from "react";
import { UserContext } from "../../context/UserContext";

type Error = {
  title: string;
  body: string;
  button: JSX.Element;
};

const NetworkErrorDialog: FunctionComponent = () => {
  const { logout, errorCode } = useContext(UserContext);

  const logoutButton = (
    <Button
      appearance="primary"
      style={{ alignSelf: "center" }}
      icon={<ArrowExitFilled />}
      onClick={() => {
        logout();
      }}
      aria-description="logout">
      Logout
    </Button>
  );

  const reloadButton = (
    <Button
      appearance="primary"
      style={{ alignSelf: "center" }}
      icon={<ArrowRepeatAllFilled />}
      onClick={() => {
        window.location.reload();
      }}
      aria-description="reload">
      Riprova
    </Button>
  );

  /**
   * Get the error message based on the http error code
   */
  function getError(code: number | null): Error {
    switch (code) {
      case 401:
        return {
          title: "\u{2757} Esegui di nuovo l'accesso",
          body: "Sembra che i dati di accesso non siano più validi. Per favore, esegui di nuovo il login.",
          button: logoutButton,
        };
      case 403:
        return {
          title: "\u{26D4} Accesso negato",
          body: "Non hai i permessi per accedere a questa risorsa. Se pensi sia un errore, contatta l'amministratore.",
          button: logoutButton,
        };
      default:
        return {
          title: "\u{26A0} Errore di rete",
          body: "Non è stato possibile contattare il server. Controlla la tua connessione e riprova.",
          button: reloadButton,
        };
    }
  }

  const error = getError(errorCode);

  return (
    errorCode !== null && (
      <Dialog open>
        <DialogSurface>
          <DialogBody>
            <DialogTitle>{error.title}</DialogTitle>
            <DialogContent>
              <Body1>{error.body}</Body1>
              <br />
            </DialogContent>
            <DialogActions>{error.button}</DialogActions>
          </DialogBody>
        </DialogSurface>
      </Dialog>
    )
  );
};

export default NetworkErrorDialog;
