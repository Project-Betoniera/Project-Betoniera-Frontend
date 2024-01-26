import { useEffect, useState } from "react";

export function useMediaQuery(query: string, defaultValue: boolean = false): boolean {
    const [matches, setMatches] = useState(defaultValue);
    useEffect(() => {
        if (window.matchMedia) {
            const mediaQuery = window.matchMedia(query);
            const update = () => {
                setMatches(mediaQuery.matches);
            };
            mediaQuery.addEventListener("change", update);
            update();
            return () => {
                mediaQuery.removeEventListener("change", update);
            };
        }
    });
    return matches;
}
