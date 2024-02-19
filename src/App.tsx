import {
  FluentProvider,
  Toast,
  ToastBody,
  ToastTitle,
  Toaster,
  makeStyles,
  tokens,
  useId,
  useToastController,
} from "@fluentui/react-components";
import { useContext, useEffect } from "react";
import { Route, Routes, useLocation, useNavigate } from "react-router";
import { useRegisterSW } from "virtual:pwa-register/react";
import { Wrapper } from "./Wrapper";
import { ProtocolHandler } from "./components/ProtocolHandler";
import InstallPwaDialog from "./components/dialogs/InstallPwaDialog";
import InvalidTokenDialog from "./components/dialogs/InvalidTokenDialog";
import OfflineDialog from "./components/dialogs/OfflineDialog";
import { PrivacyAlert } from "./components/dialogs/PrivacyAlert";
import { ThemeContext } from "./context/ThemeContext";
import { About } from "./routes/About";
import { Calendar } from "./routes/Calendar";
import { CalendarExport } from "./routes/CalendarExport";
import { Classroom } from "./routes/Classroom";
import { Grade } from "./routes/Grade";
import { Home } from "./routes/Home";
import { LoginForm } from "./routes/LoginForm";
import { NotFound } from "./routes/NotFound";
import { UserContext } from "./context/UserContext";

const useStyles = makeStyles({
  root: {
    display: "flex",
    flexDirection: "column",
    backgroundColor: tokens.colorNeutralBackground3,
    paddingTop: "env(safe-area-inset-top, 0)",
    paddingBottom: "env(safe-area-inset-bottom, 0)",
    paddingLeft: "env(safe-area-inset-left, 0)",
    paddingRight: "env(safe-area-inset-right, 0)",
  },
});

function App() {
  const style = useStyles();
  const token = useContext(UserContext).data?.token;
  const { themeValue } = useContext(ThemeContext);

  const toasterId = useId("app-toaster");
  const { dispatchToast } = useToastController(toasterId);

  const {
    // offlineReady: [offlineReady, setOfflineReady],
    // needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onOfflineReady: () => {
      dispatchToast(
        <Toast>
          <ToastTitle>App pronta</ToastTitle>
          <ToastBody>La PWA è pronta per essere installata.</ToastBody>
        </Toast>,
        { intent: "success" },
      );
    },
    onNeedRefresh: () => {
      updateServiceWorker();
    },
  });

  const location = useLocation();
  const navigate = useNavigate();
  useEffect(() => {
    // Redirect to login if not logged in
    if (!token && location.pathname !== "/login") navigate("/login");
    // Redirect to home if logged in
    if (token && location.pathname === "/login") navigate("/");
  }, [location, token]);

  return (
    <FluentProvider
      className={style.root}
      theme={themeValue}
    >
      <Toaster toasterId={toasterId} />
      <PrivacyAlert />
      <OfflineDialog />
      {token && <InstallPwaDialog />}
      {token && <InvalidTokenDialog />}
      <ProtocolHandler />
      <Routes>
        <Route
          path="/login"
          element={<LoginForm />}
        />
        {token && <Route
          path="/"
          element={<Wrapper />}
        >
          <Route
            path="/"
            element={<Home />}
          />
          <Route
            path="/classroom"
            element={<Classroom />}
          />
          <Route
            path="/calendar"
            element={<Calendar />}
          />
          <Route
            path="/calendar-sync"
            element={<CalendarExport />}
          />
          <Route
            path="/grade"
            element={<Grade />}
          />
          <Route
            path="/about"
            element={<About />}
          />
          <Route
            path="*"
            element={<NotFound />}
          />
        </Route>}
      </Routes>
    </FluentProvider>
  );
}

export default App;
