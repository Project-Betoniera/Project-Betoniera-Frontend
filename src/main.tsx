import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.tsx";
import { isBetaBuild } from "./config.ts";
import { MessagesContextProvider } from "./context/MessagesContext.tsx";
import { PwaContextProvider } from "./context/PwaContext.tsx";
import { ThemeContextProvider } from "./context/ThemeContext.tsx";
import { TimekeeperContextProvider } from "./context/TimekeeperContext.tsx";
import { UserContextProvider } from "./context/UserContext.tsx";
import "./main.css";
import { ensurePlausible } from "./plausible.tsx";

ensurePlausible();
if (isBetaBuild) console.log("Beta build");

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeContextProvider>
      <UserContextProvider>
        <PwaContextProvider>
          <MessagesContextProvider>
            <TimekeeperContextProvider>
              <BrowserRouter>
                <App />
              </BrowserRouter>
            </TimekeeperContextProvider>
          </MessagesContextProvider>
        </PwaContextProvider>
      </UserContextProvider>
    </ThemeContextProvider>
  </React.StrictMode>,
);
