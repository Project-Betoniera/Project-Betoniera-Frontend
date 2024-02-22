import { createContext, useEffect, useState } from "react";
import { CourseDto } from "../dto/CourseDto";
import UserDto from "../dto/UserDto";
import useRequests from "../libraries/requests/requests";

export type LoginResponse = {
  token: string;
  user: UserDto;
  course: CourseDto;
};

export type UserContextType = {
  data: LoginResponse | null;
  errorCode: number | null;
  setErrorCode: (error: number | null) => void;
  login(email: string, password: string, remember: boolean): Promise<void>;
  logout(): Promise<void>;
};

/**
 * The key to store the user data in the local or session storage.
 */
const STORAGE_KEY = "session";

export const UserContext = createContext<UserContextType>({
  data: null,
  errorCode: null,
  setErrorCode: (_a) => { },
  login: async (_a, _b, _c) => { },
  logout: async () => { },
});

function getUserDataFromStorage(): LoginResponse | null {
  const rawData = localStorage.getItem(STORAGE_KEY) || sessionStorage.getItem(STORAGE_KEY);
  if (!rawData) return null; // Not logged in

  const parsed = JSON.parse(rawData);
  return parsed;
}

export function UserContextProvider({ children }: { children: JSX.Element; }) {
  const requests = useRequests();

  const [data, setData] = useState<LoginResponse | null>(getUserDataFromStorage());
  const [errorCode, setErrorCode] = useState<number | null>(null);

  // Tries to retrieve an updated login response from backend.
  // If it fails, it will keep the current user data and silently fail.
  // If it fails with a 401, the login data is invalid and it will show the appropriate error message.
  useEffect(() => {
    if (!data) return;

    requests.user
      .loginWithToken(data.token)
      .then((response) => {
        setData(response);
        setErrorCode(null);
      }).catch((error) => {
        if (error.response?.status === 401) setErrorCode(401);
        else setErrorCode(null);
      });
  }, []);

  useEffect(() => {
    if (!data) return;

    try {
      // Check after setting data to avoid showing directly the login page
      if (typeof data.token === undefined ||
        typeof data.user === undefined ||
        typeof data.user.name === undefined ||
        typeof data.user.email === undefined ||
        typeof data.user.year === undefined ||
        typeof data.user.isAdmin === undefined ||
        typeof data.course === undefined ||
        typeof data.course.id === undefined ||
        typeof data.course.code === undefined ||
        typeof data.course.name === undefined ||
        typeof data.course.startYear === undefined ||
        typeof data.course.endYear === undefined) {
        console.error("Invalid user data");
        throw new Error("Invalid user data");
      }
    } catch (error) {
      console.error(error);
      setErrorCode(401);
    }
  }, [data]);

  /**
   * Login the user and store the user data in the session or local storage, based on the remember parameter.
   * @param email - The email of the user.
   * @param password - The password of the user.
   * @param remember- Whether to store the user data in the local storage (true) or the session storage (false).
  */
  async function login(email: string, password: string, remember: boolean) {
    const storage = remember ? localStorage : sessionStorage;

    requests.user
      .login(email, password)
      .then((response) => {
        setData(response);
        storage.setItem(STORAGE_KEY, JSON.stringify(response));
        setErrorCode(null);
      });
  }

  /**
   * Remove the user data from the local or session storage.
   */
  async function logout() {
    localStorage.removeItem(STORAGE_KEY);
    sessionStorage.removeItem(STORAGE_KEY);

    setData(null);
  }

  return (
    <UserContext.Provider
      value={{
        data: data,
        errorCode: errorCode,
        setErrorCode: setErrorCode,
        login,
        logout,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}
