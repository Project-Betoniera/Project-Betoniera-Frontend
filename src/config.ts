if (typeof import.meta.env.VITE_API_URL !== "string") {
    console.error("VITE_API_URL environment variable is not set");
}

export const apiUrl = new URL(import.meta.env.VITE_API_URL);
