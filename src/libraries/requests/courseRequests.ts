import axios, { AxiosError } from "axios";
import { apiUrl } from "../../config";
import { CourseDto } from "../../dto/CourseDto";

export default function courseRequests(token: string, setIsInvalid: (isInvalid: boolean) => void) {
    function parseCourse(data: any) {
        const result: CourseDto = {
            id: data.id,
            code: data.code,
            name: data.name,
            startYear: data.startYear,
            endYear: data.endYear,
        }

        return result
    }

    function parseCourses(data: any) {
        const result: CourseDto[] = [];
        if (!Array.isArray(data)) return result;

        data.forEach((item: any) => { result.push(parseCourse(item)); });

        return result;
    }

    return {
        all: async () => {
            return await axios({
                url: new URL("course", apiUrl).toString(),
                method: "GET",
                params: { distinct: true },
                headers: {
                    Authorization: `Bearer ${token}`
                },
            }).then((response) => {
                return parseCourses(response.data);
            }).catch((error: AxiosError) => {
                if (error.response?.status === 401) setIsInvalid(true);
                return [] as CourseDto[];
            });
        },
        byId: async (id: number) => {
            return await axios({
                url: new URL(`course/${encodeURIComponent(id)}`, apiUrl).toString(),
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`
                },
            }).then((response) => {
                return parseCourse(response.data);
            }).catch((error: AxiosError) => {
                if (error.response?.status === 401) setIsInvalid(true);
                throw error;
            });
        },
    };
}