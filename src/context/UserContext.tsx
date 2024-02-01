import { createContext, useEffect, useState } from "react";
import { CourseDto } from "../dto/CourseDto";
import axios from "axios";

import { apiUrl } from "../config";
import useRequests from "../libraries/requests/requests";

type UserData = {
    course: CourseDto;
    email: string;
    isAdmin: boolean;
    name: string;
    remember: boolean;
    token: string;
    year: number;
};

type UserContextType = {
    data: UserData;
    login(email: string, password: string, remember: boolean): Promise<void>;
    logout(): Promise<void>;
};

const defaultCourse: CourseDto = {
    id: 0,
    code: "",
    name: "",
    startYear: 0,
    endYear: 0,
};

export const UserContext = createContext<UserContextType | null>(null);

export function UserContextProvider({ children }: { children: JSX.Element; }) {
    const [token, setToken] = useState<string>("");
    const [name, setName] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [year, setYear] = useState<number>(1);
    const [isAdmin, setIsAdmin] = useState<boolean>(false);
    const [remember, setRemember] = useState<boolean>(true);
    const [course, setCourse] = useState<CourseDto>(typeof localStorage.getItem("course") === "string" ? JSON.parse(localStorage.getItem("course") as string) : null);

    const requests = useRequests();

    // Update saved data when one of the values changes or if 'remember' property changes
    useEffect(() => {
        if (remember) {
            localStorage.setItem("user", JSON.stringify({
                course,
                email,
                isAdmin,
                name,
                token,
                year,
            }));
        } else {
            localStorage.removeItem("user");
        }
    }, [remember, course, email, isAdmin, name, token, year]);

    async function login(email: string, password: string, remember: boolean) {

    }

    async function logout() {

    }

    return (
        <UserContext.Provider value={{
            data: {
                course,
                email,
                isAdmin,
                name,
                remember,
                token,
                year,
            },
            login,
            logout,
        }}>
            {children}
        </UserContext.Provider>
    );
}
