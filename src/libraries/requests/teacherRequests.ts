import axios from "axios";
import { apiUrl } from "../../config";

export default function teacherRequests(token: string, setErrorCode: (errorCode: number) => void) {
    return {
        all: async () => {
            return await axios({
                url: new URL("teacher", apiUrl).toString(),
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`
                },
            }).then((response) => {
                let teachers: { name: string; }[] = response.data;
                teachers = teachers.filter(item => item.name !== null && item.name !== " "); // Remove null or empty teachers
                return teachers;
            }).catch((error) => {
                setErrorCode(error.response?.status || 0);
                return [] as { name: string; }[];
            });
        }
    };
}
