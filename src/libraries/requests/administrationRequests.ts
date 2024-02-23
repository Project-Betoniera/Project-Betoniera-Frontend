import axios, { AxiosError } from "axios";
import { apiUrl } from "../../config";
import { Status } from "../../dto/StatusDto";

export default function administrationRequests(token: string, setErrorCode: (errorCode: number) => void) {
    function parseStatus(data: any) {
        const result: Status = {
            lastRefresh: new Date(data.lastRefresh),
            lastRefreshError: data.lastRefreshError,
            isUpdating: data.isUpdating,
        };

        return result;
    }

    return {
        status: async (): Promise<Status> => {
            return await axios({
                url: new URL("admin/status", apiUrl).toString(),
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }).then((response) => {
                return parseStatus(response.data);
            }).catch((error: AxiosError) => {
                setErrorCode(error.response?.status || 0);
                throw error;
            });
        },
        update: async (): Promise<void> => {
            await axios({
                url: new URL("admin/update", apiUrl).toString(),
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }).catch((error: AxiosError) => {
                setErrorCode(error.response?.status || 0);
                throw error;
            });
        }
    };
}
