import axios, { AxiosError } from "axios";
import { MessageDto } from "../../dto/MessageDto";
import { apiUrl } from "../../config";

export default function messageRequests(token: string, setIsInvalid: (isInvalid: boolean) => void) {

    return {
        all: async (): Promise<MessageDto[]> => {
            return await axios({
                url: new URL("message", apiUrl).toString(),
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }).then((response) => {
                return response.data as MessageDto[];
            }).catch((error: AxiosError) => {
                if (error.response?.status === 401) setIsInvalid(true);
                console.error(error);
                return [] as MessageDto[];
            });
        },
        create: async (message: MessageDto): Promise<MessageDto> => {
            return await axios({
                url: new URL("message", apiUrl).toString(),
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                data: message,
            }).then((response) => {
                return response.data as MessageDto;
            }).catch((error: AxiosError) => {
                if (error.response?.status === 401) setIsInvalid(true);
                console.error(error);
                return {} as MessageDto;
            });
        },
        update: async (message: MessageDto): Promise<boolean> => {
            return await axios({
                url: new URL(`message/${message.id}`, apiUrl).toString(),
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                data: message,
            }).then((response) => {
                return response.status === 200;
            }).catch((error: AxiosError) => {
                if (error.response?.status === 401) setIsInvalid(true);
                console.error(error.isAxiosError);
                return false;
            });
        },
        delete: async (id: number): Promise<boolean> => {
            return await axios({
                url: new URL(`message/${id}`, apiUrl).toString(),
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`
                },
            }).then((response) => {
                return response.status === 200;
            }).catch((error: AxiosError) => {
                if (error.response?.status === 401) setIsInvalid(true);
                console.error(error);
                return false;
            });
        }
    }

}