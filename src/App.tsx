import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Home } from "./routes/Home";
import { Wrapper } from "./Wrapper";
import { CalendarExport } from "./routes/CalendarExport";
import { useContext } from "react";
import { LoginForm } from "./routes/LoginForm";
import { TokenContext } from "./context/TokenContext";
import { NotFound } from "./routes/NotFound";
import { Classroom } from "./routes/Classroom";
import { About } from "./routes/About";
import { FluentProvider, Toast, ToastBody, ToastTitle, Toaster, makeStyles, tokens, useId, useToastController } from "@fluentui/react-components";
import { ThemeContext } from "./context/ThemeContext";
import { PrivacyAlert } from "./components/PrivacyAlert";
import OfflineDialog from "./components/OfflineDialog";
import InstallPwaDialog from "./components/InstallPwaDialog";
import { ProtocolHandler } from "./components/ProtocolHandler";
import { useRegisterSW } from "virtual:pwa-register/react";
import { Calendar } from "./routes/Calendar";

const useStyles = makeStyles({
  root: {
    display: "flex",
    flexDirection: "column",
    backgroundColor: tokens.colorNeutralBackground3,
    paddingTop: "env(safe-area-inset-top, 0)",
    paddingBottom: "env(safe-area-inset-bottom, 0)",
    paddingLeft: "env(safe-area-inset-left, 0)",
    paddingRight: "env(safe-area-inset-right, 0)",
  }
});

function App() {
  const style = useStyles();
  const { tokenData } = useContext(TokenContext);
  const { theme } = useContext(ThemeContext);

  let content: JSX.Element;

  const toasterId = useId("app-toaster");
  const { dispatchToast } = useToastController(toasterId);

  const {
    // offlineReady: [offlineReady, setOfflineReady],
    // needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker
  } = useRegisterSW({
    onOfflineReady: () => {
      dispatchToast(
        <Toast>
          <ToastTitle>App pronta</ToastTitle>
          <ToastBody>La PWA è stata installata correttamente.</ToastBody>
        </Toast>,
        { intent: "info" }
      );
    },
    onNeedRefresh: () => {
      updateServiceWorker();
    }
  });

  content = (
    <>
      <FluentProvider className={style.root} theme={theme}>
        <>
          <Toaster toasterId={toasterId} />
          <PrivacyAlert />
          <OfflineDialog />
          {
            tokenData.token ? (
              <BrowserRouter>
                <ProtocolHandler />
                <InstallPwaDialog />
                <Routes>
                  <Route path="/" element={<Wrapper />}>
                    <Route path="/" element={<Home />} />
                    <Route path="/classroom" element={<Classroom />} />
                    <Route path="/calendar" element={<Calendar />} />
                    <Route path="/calendar-export" element={<CalendarExport />} />
                    <Route path="/about" element={<About />} />
                    <Route path='*' element={<NotFound />} />
                  </Route>
                </Routes>
              </BrowserRouter>
            ) : (
              content = <LoginForm />
            )
          }
        </>
      </FluentProvider>
    </>
  );

  return content;
}

export default App;
