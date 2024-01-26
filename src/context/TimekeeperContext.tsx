import { createContext, useEffect, useState } from "react";
import Timekeeper from "../libraries/timekeeper/timekeeper";

export const TimekeeperContext = createContext({ timekeeper: new Timekeeper() });

export function TimekeeperContextProvider({ children }: { children: JSX.Element; }) {
    const [timekeeper] = useState(() => new Timekeeper());

    useEffect(() => {
        timekeeper.start();
        return () => timekeeper.stop();
    }, []);

    return (
        <TimekeeperContext.Provider value={{ timekeeper }}>
            {children}
        </TimekeeperContext.Provider>
    );
}
