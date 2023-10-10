import { Button, Dialog, DialogActions, DialogBody, DialogContent, DialogSurface, DialogTitle, Link } from "@fluentui/react-components";
import { useEffect, useState } from "react";
import { hasPlausible } from "../plausible";

// This value should be updated when the content of the information dialog is updated
const VERSION = 1;

const VERSION_STORAGE_KEY = 'privacy-version';

export function PrivacyAlert() {
  const [acknowledged, setAcknowledgedState] = useState(false);

  // This updates both the component state and the value in localStorage
  // to persist the popup closure across reloads.
  const setAcknowledged = (enabled: boolean) => {
    if (enabled) {
      window.localStorage.setItem(VERSION_STORAGE_KEY, `${VERSION}`);
    } else {
      window.localStorage.removeItem(VERSION_STORAGE_KEY);
    }
    setAcknowledgedState(enabled);
  }

  // This useEffect sets the enabled state based on the value of a value in
  // localStorage with the key defined in the VERSION_STORAGE_KEY constant when
  // this component is initially mounted.
  useEffect(() => {
    const storedVersion = window.localStorage.getItem(VERSION_STORAGE_KEY);
    setAcknowledgedState(storedVersion === `${VERSION}`);
  }, []);

  if (!hasPlausible()) {
    // plausible not configured
    return null;
  }

  return (
    <Dialog
      open={!acknowledged}
    >
      <DialogSurface>
        <DialogBody>
          <DialogTitle>Benvenuto!</DialogTitle>
          <DialogContent>
            Questo sito web usa <Link href="https://plausible.io" target="_blank">Plausible Analytics</Link> per raccogliere dati anonimi sulle visite.
            <br/>
            Plausible Analytics <Link href="https://plausible.io/privacy" target="_blank">non raccoglie dati personali</Link> e non usa cookie di alcun tipo.
          </DialogContent>
          <DialogActions>
            <Button appearance="primary" onClick={() => {
              setAcknowledged(true);
            }}>Accetta e continua</Button>
          </DialogActions>
        </DialogBody>
      </DialogSurface>
    </Dialog>
  );
}
