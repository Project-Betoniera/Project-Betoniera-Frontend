import { useContext } from "react";
import eventRequests from "./eventRequests";
import { TokenContext } from "../../../context/TokenContext";
import classroomRequests from "./classroomRequests";
import courseRequests from "./courseRequests";

export default function useRequests() {
    const token = useContext(TokenContext).tokenData.token;
    return {
        classroom: classroomRequests(token || ""),
        course: courseRequests(token || ""),
        event: eventRequests(token || ""),
    };
}
