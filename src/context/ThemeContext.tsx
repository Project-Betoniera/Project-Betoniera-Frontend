import { Theme, webDarkTheme, webLightTheme } from "@fluentui/react-components";
import { createContext, useEffect, useState } from "react";

export const ThemeContext = createContext({ theme: webLightTheme, setTheme: (theme: Theme) => { console.log(theme); } });

export function ThemeContextProvider({ children }: { children: JSX.Element; }) {

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

    return (
        <ThemeContext.Provider value={{ theme, setTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}