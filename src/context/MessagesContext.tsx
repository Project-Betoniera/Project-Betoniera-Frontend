import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import { apiUrl } from "../config";
import { TokenContext } from "./TokenContext";

export type Message = {
    id: number;
    intent: "info" | "success" | "warning" | "error";
    matchPath: string;
    title: string;
    body?: string;
    link?: string;
    linkText?: string;
    isDismissable: boolean;
};

export const MessagesContext = createContext({ messages: [] as Message[], dismissMessage: (id: number) => { console.log(id); }, doNotShowAgain: (id: number) => { console.log(id); } });

export function MessagesContextProvider({ children }: { children: JSX.Element; }) {
    const [messages, setMessages] = useState<Message[]>([]);
    const { tokenData } = useContext(TokenContext);

    useEffect(() => {
        // Get dismissed messages from local storage
        const dismissedMessages: number[] = JSON.parse(localStorage.getItem("dismissedMessages") || "[]");

        // Get messages from API
        axios.get(new URL("message", apiUrl).toString(), {
            headers: {
                Authorization: `Bearer ${tokenData.token}`
            }
        }).then((response) => {
            setMessages((response.data as Message[]).filter((message) => !dismissedMessages.includes(message.id)));
        }).catch(() => {
            setMessages([]);
        });
    }, []);

    const dismissMessage = (id: number) => { setMessages((messages) => messages.filter((message) => message.id !== id)); };
    const doNotShowAgain = (id: number) => {
        dismissMessage(id);

        // Save dismissed messages to local storage
        const dismissedMessages: number[] = JSON.parse(localStorage.getItem("dismissedMessages") || "[]");
        if (!dismissedMessages.includes(id)) dismissedMessages.push(id);
        localStorage.setItem("dismissedMessages", JSON.stringify(dismissedMessages));
    };

    return (
        <MessagesContext.Provider value={{ messages, dismissMessage, doNotShowAgain }}>
            {children}
        </MessagesContext.Provider>
    );
}
