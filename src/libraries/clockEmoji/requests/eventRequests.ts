import axios from "axios";
import { useContext } from "react";
import { TokenContext } from "../../../context/TokenContext";
import { apiUrl } from "../../../config";
import { EventDto } from "../../../dto/EventDto";

export default function useEventRequests() {
    const token = useContext(TokenContext).tokenData.token;

    return {
        eventsByCourse: async (start: Date, end: Date, courseId: number, includeOngoing: boolean = false) => {
            const response = await axios({
                url: new URL(`events/${encodeURIComponent(courseId)}`, apiUrl).toString(),
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`
                },
                params: {
                    start,
                    end,
                    includeOngoing
                }
            });

            if (!Array.isArray(response.data)) return [] as EventDto[];
            // elaborate response
        },
        eventsByClassroom: (start: Date, end: Date, classroomId: number, includeOngoing: boolean = false) => {

        },
        eventsByTeacher: (start: Date, end: Date, teacher: string, includeOngoing: boolean = false) => {

        }
    };
}
