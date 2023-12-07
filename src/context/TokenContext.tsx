import { createContext, useEffect, useState } from "react";

export type TokenData = {
    token: string | null;
    remember: boolean;
    isInvalid: boolean;
};

export const TokenContext = createContext({
    token: null as string | null,
    remember: false as boolean,
    isInvalid: false as boolean,
    setToken: (value: string | null) => { console.log(value); },
    setRemember: (value: boolean) => { console.log(value); },
    setIsInvalid: (value: boolean) => { console.log(value); },
});

export function TokenContextProvider({ children }: { children: JSX.Element; }) {

    //const [tokenData, setTokenData] = useState<TokenData>({ token: localStorage.getItem("token"), remember: true, isInvalid: false });
    const [token, setToken] = useState<string | null>(localStorage.getItem("token"));
    const [remember, setRemember] = useState<boolean>(true);
    const [isInvalid, setIsInvalid] = useState<boolean>(false);

    useEffect(() => {
        if (typeof token === "string" && remember)
            localStorage.setItem("token", token);
        else
            localStorage.removeItem("token");
    }, [token]);

    return (
        <TokenContext.Provider value={{ token, setToken, remember, setRemember, isInvalid, setIsInvalid }}>
            {children}
        </TokenContext.Provider>
    );
}
