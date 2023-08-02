import { createContext, useEffect, useState } from "react";

export type TokenData = {
    token: string | null;
    remember: boolean;
};

export const TokenContext = createContext({ tokenData: { token: null, remember: false } as TokenData, setTokenData: (data: TokenData) => { console.log(data); } });

export function TokenContextProvider({ children }: { children: JSX.Element; }) {

    const [tokenData, setTokenData] = useState<TokenData>({ token: localStorage.getItem("token"), remember: true });

    useEffect(() => {
        if (typeof tokenData.token === "string" && tokenData.remember)
            localStorage.setItem("token", tokenData.token);
        else
            localStorage.removeItem("token");
    }, [tokenData]);

    return (
        <TokenContext.Provider value={{ tokenData, setTokenData }}>
            {children}
        </TokenContext.Provider>
    );
}
