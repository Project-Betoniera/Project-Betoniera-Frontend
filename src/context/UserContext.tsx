import { createContext, useState } from "react";
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
  login(email: string, password: string, remember: boolean): Promise<void>;
  logout(): Promise<void>;
};

export const UserContext = createContext<UserContextType>({
  data: null,
  login: async (_a, _b, _c) => {},
  logout: async () => {},
});

export function UserContextProvider({ children }: { children: JSX.Element }) {
  /**
   * The key to store the user data in the local or session storage.
   */
  const STORAGE_KEY = "user";
  const requests = useRequests();

  const [data, setData] = useState<LoginResponse | null>(null);

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
      })
      .catch((error) => {
        throw error;
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
        login,
        logout,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}
