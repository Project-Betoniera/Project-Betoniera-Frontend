import axios, { AxiosError } from "axios";
import { apiUrl } from "../../config";
import { EventDto } from "../../dto/EventDto";

export default function eventRequests(token: string, setIsInvalid: (isInvalid: boolean) => void) {
    function parseEvents(data: any) {
        const result: EventDto[] = [];
        if (!Array.isArray(data)) return result;

        data.forEach((item: any) => {
            result.push({
                id: item.id,
                start: new Date(item.start),
                end: new Date(item.end),
                classroom: {
                    id: item.classroom.id,
                    name: item.classroom.name,
                    color: item.classroom.color,
                },
                course: {
                    id: item.course.id,
                    code: item.course.code,
                    name: item.course.name,
                    startYear: item.course.startYear,
                    endYear: item.course.endYear,
                },
                teacher: item.teacher,
                subject: item.subject,
            });
        });

        return result;
    }

    return {
        byClassroom: async (start: Date, end: Date, classroomId: number, includeOngoing: boolean = false) => {
            return await axios({
                url: new URL(`event/classroom/${encodeURIComponent(classroomId)}`, apiUrl).toString(),
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`
                },
                params: {
                    start: start.toISOString(),
                    end: end.toISOString(),
                    includeOngoing: includeOngoing
                }
            }).then((response) => {
                return parseEvents(response.data);
            }).catch((error: AxiosError) => {
                if (error.response?.status === 401) setIsInvalid(true);
                return [] as EventDto[];
            });
        },
        byCourse: async (start: Date, end: Date, courseId: number, includeOngoing: boolean = false) => {
            return await axios({
                url: new URL(`event/${encodeURIComponent(courseId)}`, apiUrl).toString(),
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`
                },
                params: {
                    start: start.toISOString(),
                    end: end.toISOString(),
                    includeOngoing: includeOngoing
                }
            }).then((response) => {
                return parseEvents(response.data);
            }).catch((error: AxiosError) => {
                if (error.response?.status === 401) setIsInvalid(true);
                return [] as EventDto[];
            });
        },
        byTeacher: async (start: Date, end: Date, teacher: string, includeOngoing: boolean = false) => {
            return await axios({
                url: new URL(`event/teacher/${encodeURIComponent(teacher)}`, apiUrl).toString(),
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`
                },
                params: {
                    start: start.toISOString(),
                    end: end.toISOString(),
                    includeOngoing: includeOngoing
                }
            }).then((response) => {
                return parseEvents(response.data);
            }).catch((error: AxiosError) => {
                if (error.response?.status === 401) setIsInvalid(true);
                return [] as EventDto[];
            });
        }
    };
}
