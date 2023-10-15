import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Home } from "./routes/Home";
import { Wrapper } from "./Wrapper";
import { Calendar } from "./routes/Calendar";
import { useContext } from "react";
import { LoginForm } from "./routes/LoginForm";
import { TokenContext } from "./context/TokenContext";
import { NotFound } from "./routes/NotFound";
import { Classroom } from "./routes/Classroom";
import { About } from "./routes/About";
import { FluentProvider, makeStyles, tokens } from "@fluentui/react-components";
import { ThemeContext } from "./context/ThemeContext";
import { PrivacyAlert } from "./components/PrivacyAlert";

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

  content = (
    <>
      <FluentProvider className={style.root} theme={theme}>
        <>
          <PrivacyAlert />
          {
            tokenData.token ? (
              <BrowserRouter>
                <Routes>
                  <Route path="/" element={<Wrapper />}>
                    <Route path="/" element={<Home />} />
                    <Route path="/classroom" element={<Classroom />} />
                    <Route path="/calendar" element={<Calendar />} />
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
