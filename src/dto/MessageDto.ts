export type MessageDto = {
    id: number;
    intent: "info" | "success" | "warning" | "error";
    matchPath: string;
    title: string;
    body?: string;
    link?: string;
    linkText?: string;
    isDismissable: boolean;
};