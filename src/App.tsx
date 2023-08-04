import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Home } from "./routes/Home";
import { Wrapper } from "./Wrapper";
import { Calendar } from "./routes/Calendar";
import { useContext } from "react";
import { LoginForm } from "./routes/LoginForm";
import { TokenContext } from "./context/TokenContext";
import { NotFound } from "./routes/NotFound";
import { Classroom } from "./routes/Classroom";

function App() {
  const { tokenData } = useContext(TokenContext);

  let content: JSX.Element;

  if (tokenData.token) {
    content = (
      <>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Wrapper />}>
              <Route path="/" element={<Home />} />
              <Route path="/classroom" element={<Classroom />} />
              <Route path="/calendar" element={<Calendar />} />
              <Route path='*' element={<NotFound />} />
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
