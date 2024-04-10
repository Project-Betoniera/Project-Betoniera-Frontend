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
import githubRequests from "./githubRequests";
import licenseRequests from "./licenseRequests";

export default function useRequests() {
  const { data, setErrorCode } = useContext(UserContext);
  const token = data?.token || "";

  return {
    classroom: classroomRequests(token, setErrorCode),
    course: courseRequests(token, setErrorCode),
    event: eventRequests(token, setErrorCode),
    teacher: teacherRequests(token, setErrorCode),
    grade: gradeRequests(token, setErrorCode),
    license: licenseRequests(setErrorCode),
    message: messageRequests(token, setErrorCode),
    administration: administrationRequests(token, setErrorCode),
    user: userRequests(),
    github: githubRequests(),
  };
}
