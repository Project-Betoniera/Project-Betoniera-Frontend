import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./main.css";
import { TokenContextProvider } from "./context/TokenContext.tsx";
import { CourseContextProvider } from "./context/CourseContext.tsx";
import { ThemeContextProvider } from "./context/ThemeContext.tsx";
import { ensurePlausible } from "./plausible.tsx";
import { PwaContextProvider } from "./context/PwaContext.tsx";
import { isBetaBuild } from "./config.ts";
import { MessagesContextProvider } from "./context/MessagesContext.tsx";
import { BrowserRouter } from "react-router-dom";
import { TimekeeperContextProvider } from './context/TimekeeperContext.tsx';

ensurePlausible();
if (isBetaBuild) console.log("Beta build");

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeContextProvider>
      <TokenContextProvider>
        <CourseContextProvider>
          <PwaContextProvider>
            <MessagesContextProvider>
              <TimekeeperContextProvider>
                <BrowserRouter>
                  <App />
                </BrowserRouter>
              </TimekeeperContextProvider>
            </MessagesContextProvider>
          </PwaContextProvider>
        </CourseContextProvider>
      </TokenContextProvider>
    </ThemeContextProvider>
  </React.StrictMode>,
);
