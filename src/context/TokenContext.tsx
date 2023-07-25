import { createContext, useState } from "react";

export const TokenContext = createContext({ token: null as string | null, setToken: (data: string | null) => { console.log(data); } });

export function TokenContextProvider({ children }: { children: JSX.Element; }) {

    const [token, setToken] = useState<string | null>(localStorage.getItem("token"));

    return (
        <TokenContext.Provider value={{ token, setToken }}>
            {children}
        </TokenContext.Provider>
    );
}
