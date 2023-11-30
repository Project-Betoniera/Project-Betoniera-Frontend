import axios from "axios";
import { apiUrl } from "../../../config";
import { CourseDto } from "../../../dto/CourseDto";

export default function courseRequests(token: string) {
    function parseCourses(courses: any) {
        const result: CourseDto[] = [];
        if (!Array.isArray(courses)) return result;

        courses.forEach((course: any) => {
            result.push({
                id: course.id,
                code: course.code,
                name: course.name,
                startYear: course.startYear,
                endYear: course.endYear,
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