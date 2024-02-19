import axios, { AxiosError } from "axios";
import { apiUrl } from "../../config";
import { Status } from "../../dto/StatusDto";

export default function administrationRequests(token: string, setIsInvalid: (isInvalid: boolean) => void) {
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
                const status = error.response?.status;
                if (status === 401 || status === 403) setIsInvalid(true);
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
                const status = error.response?.status;
                if (status === 401 || status === 403) setIsInvalid(true);
                throw error;
            });
        }
    };
}
