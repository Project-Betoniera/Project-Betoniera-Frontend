import axios, { AxiosError } from "axios";
import { apiUrl } from "../../config";

export default function administrationRequests(token: string, setIsInvalid: (isInvalid: boolean) => void) {

    return {
        status: async (): Promise<Object> => {
            return await axios({
                url: new URL("admin/status", apiUrl).toString(),
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }).then((response) => {
                return response.data;
            }).catch((error: AxiosError) => {
                if (error.response?.status === 401) setIsInvalid(true);
                return {};
            });
        },
        update: async (): Promise<Boolean> => {
            return await axios({
                url: new URL("admin/update", apiUrl).toString(),
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }).then((response) => {
                return response.status === 200;
            }).catch((error: AxiosError) => {
                if (error.response?.status === 401) setIsInvalid(true);
                return false;
            });
        }
    }
}