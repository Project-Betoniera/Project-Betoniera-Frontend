import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Home } from "./routes/Home";
import { Wrapper } from "./Wrapper";
import { Calendar } from "./routes/Calendar";
import { useContext } from "react";
import { LoginForm } from "./routes/LoginForm";
import { TokenContext } from "./context/TokenContext";

function App() {
  const { token } = useContext(TokenContext);

  let content: JSX.Element;

  if (token) {
    content = (
      <>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Wrapper />}>
              <Route path="/" element={<Home />} />
              <Route path="/calendar" element={<Calendar />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </>
    );
  } else {
    content = <LoginForm />;
  }

  return content;
}

export default App;
