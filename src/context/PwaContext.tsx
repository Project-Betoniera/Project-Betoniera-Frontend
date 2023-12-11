import { createContext, useEffect, useState } from "react";

type PwaPrompt = (() => Promise<{ outcome: "accepted" | "dismissed"; }>) | null;

export const PwaContext = createContext<{
    pwaPrompt: PwaPrompt;
    isPwa: boolean;
    isInstalled: boolean;
    isAcknowledged: boolean;
    setAcknowledged: (value: boolean) => void;
}>({
    pwaPrompt: null,
    isPwa: false,
    isInstalled: false,
    isAcknowledged: false,
    setAcknowledged: (_value) => { }
});

export function PwaContextProvider({ children }: { children: JSX.Element; }) {
    const [promptEvent, setPromptEvent] = useState<{ prompt: PwaPrompt; }>({ prompt: null });
    const [isPwa, setPwa] = useState<boolean>(false);
    const [isInstalled, setInstalled] = useState<boolean>(false);
    const [isAcknowledged, setAcknowledged] = useState(window.localStorage.getItem("isPwaDialogAcknowledged") === "true"); // Check if PWA dialog has been acknowledged

    useEffect(() => {
        // Check if app is running in standalone mode (PWA)
        if (!window.matchMedia) return;
        const pwaQuery = window.matchMedia('(display-mode: standalone)');

        const updatePwa = () => { setPwa(pwaQuery.matches); };

        pwaQuery.addEventListener('change', updatePwa);
        updatePwa();

        return () => {
            pwaQuery.removeEventListener('change', updatePwa);
        };
    }, []);

    useEffect(() => {
        // Check if PWA is installed
        try {
            if (typeof (navigator as any).getInstalledRelatedApps !== "function") return;

            (navigator as any)
                .getInstalledRelatedApps()
                .then((result: { id?: string, platform: string, url?: string; }[]) => { if (result.length > 0) setInstalled(true); });
        } catch (error) {
            console.error(error);
        }
    }, []);

    useEffect(() => {
        // Catch install prompt event
        const catchEvent = (e: Event) => {
            e.preventDefault();
            setPromptEvent({ prompt: () => (e as any).prompt() });
        };
        window.addEventListener("beforeinstallprompt", catchEvent);

        return () => { window.removeEventListener("beforeinstallprompt", catchEvent); };
    }, []);

    useEffect(() => {
        if (isAcknowledged) {
            window.localStorage.setItem("isPwaDialogAcknowledged", "true");
        } else {
            window.localStorage.removeItem("isPwaDialogAcknowledged");
        }
    }, [isAcknowledged]);

    return (
        <PwaContext.Provider value={{ pwaPrompt: promptEvent.prompt, isPwa, isInstalled, isAcknowledged, setAcknowledged }}>
            {children}
        </PwaContext.Provider>
    );
}
