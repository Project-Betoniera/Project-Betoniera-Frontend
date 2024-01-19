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
                if (error.response?.status === 401) setIsInvalid(true);
                return {} as Status;
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