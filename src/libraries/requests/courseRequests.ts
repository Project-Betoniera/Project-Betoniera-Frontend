import axios from "axios";
import { apiUrl } from "../../config";
import { CourseDto } from "../../dto/CourseDto";

export default function courseRequests(token: string) {
    function parseCourses(data: any) {
        const result: CourseDto[] = [];
        if (!Array.isArray(data)) return result;

        data.forEach((item: any) => {
            result.push({
                id: item.id,
                code: item.code,
                name: item.name,
                startYear: item.startYear,
                endYear: item.endYear,
            });
        });

        return result;
    }

    return {
        all: async () => {
            const response = await axios({
                url: new URL("course", apiUrl).toString(),
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`
                },
            });

            return parseCourses(response.data);
        },
        byId: async (id: number) => {
            const response = await axios({
                url: new URL(`course/${encodeURIComponent(id)}`, apiUrl).toString(),
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`
                },
            });

            return parseCourses(response.data);
        },
    };
}