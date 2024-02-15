import { useContext } from "react";
import administrationRequests from "./administrationRequests";
import classroomRequests from "./classroomRequests";
import courseRequests from "./courseRequests";
import eventRequests from "./eventRequests";
import gradeRequests from "./gradeRequests";
import messageRequests from "./messageRequests";
import teacherRequests from "./teacherRequests";
import userRequests from "./userRequests";
import { UserContext } from "../../context/UserContext";

export default function useRequests() {
    const { data, setError } = useContext(UserContext);
    const token = data?.token || "";

    return {
        classroom: classroomRequests(token, setError),
        course: courseRequests(token, setError),
        event: eventRequests(token, setError),
        teacher: teacherRequests(token, setError),
        grade: gradeRequests(token, setError),
        message: messageRequests(token, setError),
        administration: administrationRequests(token, setError),
        user: userRequests()
    };
}
