import axios, { AxiosError } from "axios";
import { apiUrl } from "../../config";
import { LicenseIndexDto } from "../../dto/LicenseIndexDto";

type Component = "frontend" | "backend";

export default function licenseRequests(setErrorCode: (errorCode: number) => void) {
  const textUrl = (component: Component, licenseHash: string): URL =>
    new URL(`licenses/${licenseHash}.txt`, component === "frontend" ? window.location.origin : apiUrl);
  return {
    index: async (component: Component): Promise<LicenseIndexDto> => {
      return await axios({
        url: new URL("licenses.json", component === "frontend" ? window.location.origin : apiUrl).toString(),
      })
        .then((response) => {
          return response.data as LicenseIndexDto;
        })
        .catch((error: AxiosError) => {
          setErrorCode(error.response?.status || 0);
          return {} as LicenseIndexDto;
        });
    },
    textUrl,
    text: async (component: Component, licenseHash: string): Promise<string> => {
      return await axios({
        url: textUrl(component, licenseHash).toString(),
        responseType: "text",
      })
        .then((response) => {
          return response.data;
        })
        .catch((error: AxiosError) => {
          setErrorCode(error.response?.status || 0);
          return "";
        });
    },
  };
}
