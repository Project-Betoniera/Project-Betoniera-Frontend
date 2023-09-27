import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Home } from "./routes/Home";
import { Wrapper } from "./Wrapper";
import { Calendar } from "./routes/Calendar";
import { useContext, useEffect, useState } from "react";
import { LoginForm } from "./routes/LoginForm";
import { TokenContext } from "./context/TokenContext";
import { NotFound } from "./routes/NotFound";
import { Classroom } from "./routes/Classroom";
import { About } from "./routes/About";
import { FluentProvider, Theme, makeStyles, webDarkTheme, webLightTheme } from "@fluentui/react-components";

const useStyles = makeStyles({
  root: {
    display: "flex",
    flexDirection: "column",
    minHeight: "100vh",
  }
});

function App() {
  const style = useStyles();
  const { tokenData } = useContext(TokenContext);
  const [theme, setTheme] = useState<Theme>(webLightTheme);

  useEffect(() => {
    if (window.matchMedia) {
      const darkThemeQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const updateTheme = () => {
        setTheme(darkThemeQuery.matches ? webDarkTheme : webLightTheme);
      };
      darkThemeQuery.addEventListener('change', updateTheme);
      updateTheme();
      return () => {
        darkThemeQuery.removeEventListener('change', updateTheme);
      };
    }
  }, []);

  let content: JSX.Element;

  content = (
    <>
      <FluentProvider className={style.root} theme={theme}>
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
      </FluentProvider>
    </>
  );

  return content;
}

export default App;
