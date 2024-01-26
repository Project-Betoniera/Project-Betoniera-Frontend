import { useContext } from "react";
import { TokenContext } from "../../context/TokenContext";
import classroomRequests from "./classroomRequests";
import courseRequests from "./courseRequests";
import eventRequests from "./eventRequests";
import teacherRequests from "./teacherRequests";
import gradeRequests from "./gradeRequests";
import messageRequests from "./messageRequests";
import administrationRequests from "./administrationRequests";

export default function useRequests() {
        const { token, setIsInvalid } = useContext(TokenContext);
        return {
                classroom: classroomRequests(token || "", setIsInvalid),
                course: courseRequests(token || "", setIsInvalid),
                event: eventRequests(token || "", setIsInvalid),
                teacher: teacherRequests(token || "", setIsInvalid),
                grade: gradeRequests(token || "", setIsInvalid),
                message: messageRequests(token || "", setIsInvalid),
                administration: administrationRequests(token || "", setIsInvalid)
        };
}
