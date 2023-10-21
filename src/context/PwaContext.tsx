import { createContext, useEffect, useState } from "react";

type PwaPrompt = (() => Promise<{ outcome: "accepted" | "dismissed"; }>) | null;

export const PwaContext = createContext<{ pwaPrompt: PwaPrompt; isPwa: boolean; }>({ pwaPrompt: null, isPwa: false });

export function PwaContextProvider({ children }: { children: JSX.Element; }) {
    const [promptEvent, setPromptEvent] = useState<{ prompt: PwaPrompt; }>({ prompt: null });
    const [isPwa] = useState<boolean>(window.matchMedia('(display-mode: standalone)').matches);

    useEffect(() => {
        const catchEvent = (e: Event) => {
            e.preventDefault();
            setPromptEvent({ prompt: () => (e as any).prompt() });
        };

        window.addEventListener("beforeinstallprompt", catchEvent);
        return () => { window.removeEventListener("beforeinstallprompt", catchEvent); };
    }, []);

    return (
        <PwaContext.Provider value={{ pwaPrompt: promptEvent.prompt, isPwa }}>
            {children}
        </PwaContext.Provider>
    );
}