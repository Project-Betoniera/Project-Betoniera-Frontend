import axios, { AxiosError } from "axios";
import { apiUrl } from "../../config";
import { MessageDto } from "../../dto/MessageDto";

export default function messageRequests(token: string, setErrorCode: (errorCode: number) => void) {
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
                setErrorCode(error.response?.status || 0);
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
                setErrorCode(error.response?.status || 0);
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
                setErrorCode(error.response?.status || 0);
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
                setErrorCode(error.response?.status || 0);
                return false;
            });
        }
    };
}
