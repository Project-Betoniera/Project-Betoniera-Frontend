import axios, { AxiosError } from "axios";
import { apiUrl } from "../../config";
import { CourseDto } from "../../dto/CourseDto";
import { GradeDto, GradeGroupDto } from "../../dto/GradeDto";

export default function gradeRequests(token: string, setIsInvalid: (isInvalid: boolean) => void) {

    return {
        groups: async (): Promise<GradeGroupDto[]> => {
            return await axios({
                url: new URL("grade", apiUrl).toString(),
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`
                },
            }).then((response) => {
                return response.data;
            }).catch((error: AxiosError) => {
                if (error.response?.status === 401) setIsInvalid(true);
                return [] as CourseDto[];
            });
        },
        forGroup: async (code: string): Promise<GradeDto[]> => {
            return await axios({
                url: new URL(`grade/${encodeURIComponent(code)}`, apiUrl).toString(),
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`
                },
            }).then((response) => {
                return response.data;
            }).catch((error: AxiosError) => {
                if (error.response?.status === 401) setIsInvalid(true);
                return [] as CourseDto[];
            });
        },
    };
}