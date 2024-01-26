import { createContext, useEffect, useState } from "react";
import { MessageDto } from "../dto/MessageDto";
import useRequests from "../libraries/requests/requests";

export const MessagesContext = createContext({ messages: [] as MessageDto[], setMessages: (value: MessageDto[]) => { console.log(value); }, dismissMessage: (id: number) => { console.log(id); }, doNotShowAgain: (id: number) => { console.log(id); } });

export function MessagesContextProvider({ children }: { children: JSX.Element; }) {
    const [messages, setMessages] = useState<MessageDto[]>([]);
    const requests = useRequests();

    useEffect(() => {
        // Get dismissed messages from local storage
        const dismissedMessages: number[] = JSON.parse(localStorage.getItem("dismissedMessages") || "[]");

        // Get messages from API
        requests.message.all().then((response) => {
            setMessages(response.filter((message) => !dismissedMessages.includes(message.id)));
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
        <MessagesContext.Provider value={{ messages, setMessages, dismissMessage, doNotShowAgain }}>
            {children}
        </MessagesContext.Provider>
    );
}
