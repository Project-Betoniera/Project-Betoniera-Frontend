import { Button, Card, CardHeader, Dialog, DialogActions, DialogBody, DialogContent, DialogSurface, Link, Spinner, Title2, makeStyles } from "@fluentui/react-components";
import { useGlobalStyles } from "../globalStyles";
import useRequests from '../libraries/requests/requests';
import { LicenseIndexDto } from '../dto/LicenseIndexDto';
import { useEffect, useState } from 'react';
import { DismissRegular } from '@fluentui/react-icons';

const useStyles = makeStyles({
  licenseList: {
    columnCount: 6,
    '@media screen and (max-width: 1200px) and (min-width: 1000px)': {
      columnCount: 4,
    },
    '@media screen and (max-width: 1000px) and (min-width: 578px)': {
      columnCount: 2,
    },
    '@media screen and (max-width: 578px)': {
      columnCount: 1,
    },
  },
  licenseTextSurface: {
    maxWidth: "800px",
    width: "fit-content",
  },
  licenseText: {
    whiteSpace: "pre-wrap",
    marginLeft: "auto",
    marginRight: "auto",
    overflowX: "auto",
  }
});

export function LicenseList({ showBackButton }: { showBackButton: boolean }) {
  const globalStyles = useGlobalStyles();
  const styles = useStyles();
  const { license: licenseRequests } = useRequests();
  
  const [frontendLicenseIndex, setFrontendLicenseIndex] = useState<LicenseIndexDto | undefined>(undefined);
  const [backendLicenseIndex, setBackendLicenseIndex] = useState<LicenseIndexDto | undefined>(undefined);

  const [licenseText, setLicenseText] = useState<string | undefined>(undefined);
  const [licenseTextVisible, setLicenseTextVisible] = useState<boolean>(false);
  const [licenseTextParameters, setLicenseTextParameters] = useState<Parameters<typeof licenseRequests.text> | undefined>(undefined);

  useEffect(() => {
    licenseRequests.index("frontend").then(setFrontendLicenseIndex);
    licenseRequests.index("backend").then(setBackendLicenseIndex);
  }, []);

  useEffect(() => {
    if (licenseTextParameters) {
      setLicenseText(undefined);
      setLicenseTextVisible(true);
      licenseRequests.text(...licenseTextParameters).then(setLicenseText);
    } else {
      setLicenseTextVisible(false);
    }
  }, [licenseTextParameters])

  function createLicenseList(component: Parameters<typeof licenseRequests.text>[0], index: LicenseIndexDto | undefined) {
    return (
      <Card className={globalStyles.card}>
        <Title2>{component.substring(0, 1).toUpperCase() + component.substring(1)}</Title2>
        {index ? (
          <ul className={styles.licenseList}>
            {Object.entries(index).map(([packageName, licenseHash]) => (
              <li key={packageName}><Link href={licenseRequests.textUrl(component, licenseHash).toString()} target="_blank" onClick={(e) => {
                e.preventDefault();
                setLicenseTextParameters([component, licenseHash]);
              }}>{packageName}</Link></li>
            ))}
          </ul>
        ) : (
          <Spinner size="extra-large" />
        )}
      </Card>
    )
  }

  return (
    <div className={globalStyles.container}>
      <Dialog modalType="modal" open={licenseTextVisible} onOpenChange={(_, d) => (d.open || licenseText !== undefined) && setLicenseTextVisible(d.open)}>
        <DialogSurface className={styles.licenseTextSurface}>
          <DialogBody>
            <DialogContent>
              {licenseText ? (
                <pre className={styles.licenseText}>{licenseText}</pre>
              ) : (
                <Spinner size="extra-large" />
              )}
            </DialogContent>
            <DialogActions>
              <Button appearance="primary" onClick={() => setLicenseTextVisible(false)} disabled={licenseText === undefined}>Chiudi</Button>
            </DialogActions>
          </DialogBody>
        </DialogSurface>
      </Dialog>
      <Card className={globalStyles.card}>
        <CardHeader
          header={<Title2>{"\u{1F4C3}"} Licenze open source</Title2>}
          action={showBackButton ? <Button appearance="subtle" icon={<DismissRegular />} onClick={() => window.history.back()} /> : undefined}
        />
      </Card>
      <div className={globalStyles.list}>
        {createLicenseList("frontend", frontendLicenseIndex)}
        {createLicenseList("backend", backendLicenseIndex)}
      </div>
    </div>
  );
}
