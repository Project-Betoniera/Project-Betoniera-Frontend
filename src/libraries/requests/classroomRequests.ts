import axios, { AxiosError } from "axios";
import { apiUrl } from "../../config";
import { ClassroomDto } from "../../dto/ClassroomDto";
import { ClassroomStatus } from "../../dto/ClassroomStatus";

export default function classroomRequests(token: string, setIsInvalid: (isInvalid: boolean) => void) {
    const excludedClassrooms = [5, 19, 26, 31, 33]; // TODO Get this from the API

    function parseClassrooms(data: any) {
        const result: ClassroomDto[] = [];
        if (!Array.isArray(data)) return result;

        data.forEach((item: any) => {
            !excludedClassrooms.includes(item.id) && result.push({
                id: item.id,
                name: item.name,
                color: item.color,
            });
        });

        return result;
    }

    function parseClassroomStatus(data: any) {
        const result: ClassroomStatus[] = [];

        if (!Array.isArray(data)) return result;

        data.forEach((item: any) => {
            !excludedClassrooms.includes(item.classroom.id) && result.push({
                status: {
                    isFree: item.status.isFree,
                    statusChangeAt: item.status.statusChangeAt ? new Date(item.status.statusChangeAt) : null,
                    currentOrNextEvent: item.status.currentOrNextEvent ? {
                        id: item.status.currentOrNextEvent?.id,
                        course: {
                            id: item.status.currentOrNextEvent?.course.id,
                            code: item.status.currentOrNextEvent?.course.code,
                            name: item.status.currentOrNextEvent?.course.name,
                            startYear: item.status.currentOrNextEvent?.course.startYear,
                            endYear: item.status.currentOrNextEvent?.course.endYear,
                        },
                        // TODO Uncomment when classroom is returned in the response
                        // classroom: {
                        //     id: item.status.currentOrNextEvent?.classroom.id,
                        //     name: item.status.currentOrNextEvent?.classroom.name,
                        //     color: item.status.currentOrNextEvent?.classroom.color,
                        // },
                        start: new Date(item.status.currentOrNextEvent?.start),
                        end: new Date(item.status.currentOrNextEvent?.end),
                        subject: item.status.currentOrNextEvent?.subject,
                        teacher: item.status.currentOrNextEvent?.teacher,
                    } : null,
                },
                classroom: {
                    id: item.classroom.id,
                    name: item.classroom.name,
                    color: item.classroom.color,
                }
            });
        });

        return result;
    }

    return {
        all: async () => {
            return await axios({
                url: new URL("classroom", apiUrl).toString(),
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`
                },
            }).then((response) => {
                return parseClassrooms(response.data);
            }).catch((error: AxiosError) => {
                if (error.response?.status === 401) setIsInvalid(true);
                return [] as ClassroomDto[];
            });
        },
        byId: async (id: number) => {
            return await axios({
                url: new URL(`classroom/${encodeURIComponent(id)}`, apiUrl).toString(),
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`
                },
            }).then((response) => {
                return parseClassrooms(new Array(response.data));
            }).catch((error: AxiosError) => {
                if (error.response?.status === 401) setIsInvalid(true);
                return [] as ClassroomDto[];
            });
        },
        busy: async (start: Date, end: Date) => {
            return await axios({
                url: new URL("classroom/occupied", apiUrl).toString(),
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`
                },
                params: {
                    start: start.toISOString(),
                    end: end.toISOString(),
                }
            }).then((response) => {
                return parseClassrooms(response.data);
            }).catch((error: AxiosError) => {
                if (error.response?.status === 401) setIsInvalid(true);
                return [] as ClassroomDto[];
            });
        },
        free: async (start: Date, end: Date) => {
            return await axios({
                url: new URL("classroom/free", apiUrl).toString(),
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`
                },
                params: {
                    start: start.toISOString(),
                    end: end.toISOString(),
                }
            }).then((response) => {
                return parseClassrooms(response.data);
            }).catch((error: AxiosError) => {
                if (error.response?.status === 401) setIsInvalid(true);
                return [] as ClassroomDto[];
            });
        },
        status: async (time?: Date) => {
            return await axios({
                url: new URL("classroom/status", apiUrl).toString(),
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`
                },
                params: {
                    time: time?.toISOString(),
                }
            }).then((response) => {
                return parseClassroomStatus(response.data);
            }).catch((error: AxiosError) => {
                if (error.response?.status === 401) setIsInvalid(true);
                return [] as ClassroomStatus[];
            });
        }
    };
}