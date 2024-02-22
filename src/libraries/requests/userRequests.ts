import axios, { AxiosError } from "axios";
import { apiUrl } from "../../config";
import { encode as toBase64 } from "base-64";
import { LoginResponse } from "../../context/UserContext";
import { CourseDto } from "../../dto/CourseDto";
import UserDto from "../../dto/UserDto";

export default function userRequests(setErrorCode: (errorCode: number) => void) {
    function parseLoginResponse(rawData: any) {
        const user: UserDto = {
            name: rawData.user.name,
            email: rawData.user.email,
            year: rawData.user.year,
            isAdmin: rawData.user.isAdmin
        };
        const course: CourseDto = {
            id: rawData.course.id,
            name: rawData.course.name,
            code: rawData.course.code,
            startYear: rawData.course.startYear,
            endYear: rawData.course.endYear
        };

        const result: LoginResponse = {
            token: rawData.token,
            user: user,
            course: course
        };

        return result;
    }

    return {
        login: async (email: string, password: string) => {
            return await axios({
                url: new URL("login", apiUrl).toString(),
                method: "POST",
                headers: {
                    Authorization: `Basic ${toBase64(`${email}:${password}`)}`
                }
            }).then((response) => {
                return parseLoginResponse(response.data);
            }).catch((error: AxiosError) => {
                setErrorCode(error.response?.status || 0);
                throw error;
            });
        },
        loginWithToken: async (token: string) => {
            return await axios({
                url: new URL("login", apiUrl).toString(),
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }).then((response) => {
                return parseLoginResponse(response.data);
            }).catch((error: AxiosError) => {
                setErrorCode(error.response?.status || 0);
                throw error;
            });
        },
    };
}