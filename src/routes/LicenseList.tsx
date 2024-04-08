import { Button, Card, CardHeader, Dialog, DialogActions, DialogBody, DialogContent, DialogSurface, DialogTitle, Link, Spinner, Title2, makeStyles, tokens } from "@fluentui/react-components";
import { useGlobalStyles } from "../globalStyles";
import useRequests from '../libraries/requests/requests';
import { LicenseIndexDto } from '../dto/LicenseIndexDto';
import { useEffect, useState } from 'react';
import { DismissRegular, createFluentIcon } from '@fluentui/react-icons';
import { RouterButton } from "../components/router/RouterButton";

const NpmIcon = createFluentIcon("npm", "33", ["M7.415 7.656l17.291 0.024-0.011 17.29h-4.329l0.012-12.974h-4.319l-0.010 12.964h-8.656zM3.207 1.004c-0.002 0-0.003 0-0.005 0-1.214 0-2.198 0.984-2.198 2.198 0 0.002 0 0.004 0 0.006v-0 25.585c0 0.002 0 0.003 0 0.005 0 1.214 0.984 2.198 2.198 2.198 0.002 0 0.004 0 0.006 0h25.585c0.002 0 0.003 0 0.005 0 1.214 0 2.198-0.984 2.198-2.198 0-0.002 0-0.004 0-0.006v0-25.585c0-0.002 0-0.003 0-0.005 0-1.214-0.984-2.198-2.198-2.198-0.002 0-0.004 0-0.006 0h0z"])

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
  },
  redBackground: {
    color: "white",
    backgroundColor: tokens.colorPaletteRedBackground3,
  }
});

export function LicenseList({ showBackButton }: { showBackButton: boolean }) {
  const globalStyles = useGlobalStyles();
  const styles = useStyles();
  const { license: licenseRequests } = useRequests();
  
  const [frontendLicenseIndex, setFrontendLicenseIndex] = useState<LicenseIndexDto | undefined>(undefined);
  const [backendLicenseIndex, setBackendLicenseIndex] = useState<LicenseIndexDto | undefined>(undefined);

  const [packageName, setPackageName] = useState<string | undefined>(undefined);
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
                setPackageName(packageName);
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
            <DialogTitle>{packageName}</DialogTitle>
            <DialogContent>
              {licenseText ? (
                <pre className={styles.licenseText}>{licenseText}</pre>
              ) : (
                <Spinner size="extra-large" />
              )}
            </DialogContent>
            <DialogActions>
              {packageName && <RouterButton as="a" appearance="secondary" icon={<NpmIcon />} className={styles.redBackground} href={"https://www.npmjs.com/package/" + packageName.slice(0, packageName?.indexOf('@', 1))} target="_blank">View on npmjs.com</RouterButton>}
              <Button appearance="primary" onClick={() => setLicenseTextVisible(false)} disabled={licenseText === undefined}>Chiudi</Button>
            </DialogActions>
          </DialogBody>
        </DialogSurface>
      </Dialog>
      <Card className={globalStyles.card}>
        <CardHeader
          header={<Title2>{"\u{1F4C3}"} Licenze Open Source</Title2>}
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
