import React from "react";
import ReactDOM from "react-dom/client";
import { registerSW } from "virtual:pwa-register";
import App from "./App.tsx";
import "./main.css";
import { TokenContextProvider } from "./context/TokenContext.tsx";
import { CourseContextProvider } from "./context/CourseContext.tsx";
import { ThemeContextProvider } from "./context/ThemeContext.tsx";
import { ensurePlausible } from "./plausible.tsx";
import { PwaContextProvider } from "./context/PwaContext.tsx";
import { isBetaBuild } from "./config.ts";

ensurePlausible();
if (isBetaBuild) console.log("Beta build");

registerSW({ immediate: true });

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeContextProvider>
      <TokenContextProvider>
        <CourseContextProvider>
          <PwaContextProvider>
            <App />
          </PwaContextProvider>
        </CourseContextProvider>
      </TokenContextProvider>
    </ThemeContextProvider>
  </React.StrictMode>,
);
