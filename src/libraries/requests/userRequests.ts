import axios from "axios";
import { apiUrl } from "../../config";
import { encode as toBase64 } from "base-64";

export default function userRequests() {
    return {
        login: async (email: string, password: string) => {
            return await axios({
                url: new URL("login", apiUrl).toString(),
                method: "POST",
                headers: {
                    Authorization: `Basic ${toBase64(`${email}:${password}`)}`
                }
            }).then((response) => {
                return response.data;
            });
        }
    };
}