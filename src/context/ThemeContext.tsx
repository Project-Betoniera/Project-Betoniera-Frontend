import { Theme, webDarkTheme, webLightTheme } from "@fluentui/react-components";
import { createContext, useEffect, useState } from "react";

export type AppTheme = "auto" | "light" | "dark";

export const ThemeContext = createContext({
    theme: "auto" as AppTheme,
    setTheme: (value: AppTheme) => { console.log(value); },
    themeValue: webLightTheme as Theme
});

export function ThemeContextProvider({ children }: { children: JSX.Element; }) {

    const getTheme = () => {
        const savedTheme = localStorage.getItem("theme") || "auto";

        if (savedTheme === "auto" || savedTheme === "light" || savedTheme === "dark") return savedTheme;
        else return "auto";
    }

    const [theme, setTheme] = useState<"auto" | "light" | "dark">(getTheme());
    const [themeValue, setThemeValue] = useState<Theme>(webLightTheme);

    useEffect(() => {
        localStorage.setItem("theme", theme);

        switch (theme) {
            case "light":
                setThemeValue(webLightTheme);
                break;
            case "dark":
                setThemeValue(webDarkTheme);
                break;
            case "auto":
                const darkThemeQuery = window.matchMedia("(prefers-color-scheme: dark)");
        
                const updateTheme = () => setThemeValue(darkThemeQuery.matches ? webDarkTheme : webLightTheme);
                updateTheme();
        
                darkThemeQuery.addEventListener("change", updateTheme);
                return () => darkThemeQuery.removeEventListener("change", updateTheme);
            default:
                setThemeValue(webLightTheme);
                break;
        }

    }, [theme]);

    return (
        <ThemeContext.Provider value={{ theme, setTheme, themeValue }}>
            {children}
        </ThemeContext.Provider>
    );
}