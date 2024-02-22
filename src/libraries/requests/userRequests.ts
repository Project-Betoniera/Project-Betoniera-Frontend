import axios, { AxiosError } from "axios";
import { apiUrl } from "../../config";
import { encode as toBase64 } from "base-64";
import { LoginResponse } from "../../context/UserContext";
import { CourseDto } from "../../dto/CourseDto";
import UserDto from "../../dto/UserDto";

export default function userRequests(setErrorCode: (errorCode: number) => void) {
    return {
        login: async (email: string, password: string) => {
            return await axios({
                url: new URL("login", apiUrl).toString(),
                method: "POST",
                headers: {
                    Authorization: `Basic ${toBase64(`${email}:${password}`)}`
                }
            }).then((response) => {
                const data = response.data;

                const user: UserDto = {
                    name: data.user.name,
                    email: data.user.email,
                    year: data.user.year,
                    isAdmin: data.user.isAdmin
                };
                const course: CourseDto = {
                    id: data.course.id,
                    name: data.course.name,
                    code: data.course.code,
                    startYear: data.course.startYear,
                    endYear: data.course.endYear
                };

                const result: LoginResponse = {
                    token: data.token,
                    user: user,
                    course: course
                };

                return result;
            }).catch((error: AxiosError) => {
                setErrorCode(error.response?.status || 0);
                throw error;
            });
        }
    };
}