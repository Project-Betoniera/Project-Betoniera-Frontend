import axios from "axios";
import { apiUrl } from "../../../config";
import { EventDto } from "../../../dto/EventDto";

export default function eventRequests(token: string) {
    function parseEvents(events: any) {
        const result: EventDto[] = [];
        if (!Array.isArray(events)) return result;

        events.forEach((event: any) => {
            result.push({
                id: event.id,
                start: new Date(event.start),
                end: new Date(event.end),
                classroom: {
                    id: event.classroom.id,
                    name: event.classroom.name,
                    color: event.classroom.color,
                },
                course: {
                    id: event.course.id,
                    code: event.course.code,
                    name: event.course.name,
                    startYear: event.course.startYear,
                    endYear: event.course.endYear,
                },
                teacher: event.teacher,
                subject: event.subject,
            });
        });

        return result;
    }

    return {
        byClassroom: async (start: Date, end: Date, classroomId: number, includeOngoing: boolean = false) => {
            const response = await axios({
                url: new URL(`events/classroom/${encodeURIComponent(classroomId)}`, apiUrl).toString(),
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`
                },
                params: {
                    start: start.toISOString(),
                    end: end.toISOString(),
                    includeOngoing: includeOngoing
                }
            });

            return parseEvents(response.data);
        },
        byCourse: async (start: Date, end: Date, courseId: number, includeOngoing: boolean = false) => {
            const response = await axios({
                url: new URL(`events/${encodeURIComponent(courseId)}`, apiUrl).toString(),
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`
                },
                params: {
                    start: start.toISOString(),
                    end: end.toISOString(),
                    includeOngoing: includeOngoing
                }
            });

            return parseEvents(response.data);
        },
        byTeacher: async (start: Date, end: Date, teacher: string, includeOngoing: boolean = false) => {
            const response = await axios({
                url: new URL(`events/teacher/${encodeURIComponent(teacher)}`, apiUrl).toString(),
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`
                },
                params: {
                    start: start.toISOString(),
                    end: end.toISOString(),
                    includeOngoing: includeOngoing
                }
            });

            return parseEvents(response.data);
        }
    };
}
