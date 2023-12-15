import axios from "axios"
import { apiUrl } from "../../config"

export default function teacherRequests(token: string, setIsInvalid: (isInvalid: boolean) => void) {
    return {
        all: async () => {
            return await axios({
                url: new URL("teacher", apiUrl).toString(),
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`
                },
            }).then((response) => {
                let teachers: { teacher: string; }[] = response.data;
                teachers = teachers.filter(item => item.teacher !== null && item.teacher !== " "); // Remove null or empty teachers
                return teachers;
            }).catch((error) => {
                if (error.response?.status === 401) setIsInvalid(true);
                return [] as { teacher: string; }[];
            });
        }
    }
}
