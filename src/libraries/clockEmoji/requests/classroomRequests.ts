import axios from "axios";
import { apiUrl } from "../../../config";
import { ClassroomDto } from "../../../dto/ClassroomDto";

export default function classroomRequests(token: string) {
    function parseClassrooms(classrooms: any) {
        const result: ClassroomDto[] = [];
        if (!Array.isArray(classrooms)) return result;

        classrooms.forEach((classroom: any) => {
            result.push({
                id: classroom.id,
                name: classroom.name,
                color: classroom.color,
            });
        });

        return result;
    }

    return {
        all: async () => {
            const response = await axios({
                url: new URL("classroom", apiUrl).toString(),
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`
                },
            });

            return parseClassrooms(response.data);
        },
        byId: async (id: number) => {
            const response = await axios({
                url: new URL(`classroom/${encodeURIComponent(id)}`, apiUrl).toString(),
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`
                },
            });

            return parseClassrooms(response.data);
        },
        busy: async (start: Date, end: Date) => {
            const response = await axios({
                url: new URL("classroom/occupied", apiUrl).toString(),
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`
                },
                params: {
                    start: start.toISOString(),
                    end: end.toISOString(),
                }
            });

            return parseClassrooms(response.data);
        },
        free: async (start: Date, end: Date) => {
            const response = await axios({
                url: new URL("classroom/free", apiUrl).toString(),
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`
                },
                params: {
                    start: start.toISOString(),
                    end: end.toISOString(),
                }
            });

            return parseClassrooms(response.data);
        },
        status: async (time?: Date) => {
            const response = await axios({
                url: new URL("classroom/status", apiUrl).toString(),
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`
                },
                params: {
                    time: time?.toISOString(),
                }
            });

            return parseClassrooms(response.data);
        }
    };
}