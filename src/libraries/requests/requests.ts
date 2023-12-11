import { useContext } from "react";
import eventRequests from "./eventRequests";
import { TokenContext } from "../../context/TokenContext";
import classroomRequests from "./classroomRequests";
import courseRequests from "./courseRequests";

export default function useRequests() {
    const {token, setIsInvalid} = useContext(TokenContext);
    return {
        classroom: classroomRequests(token || "", setIsInvalid),
        course: courseRequests(token || "", setIsInvalid),
        event: eventRequests(token || "", setIsInvalid),
    };
}
