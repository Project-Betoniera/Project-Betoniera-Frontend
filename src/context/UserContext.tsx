import { createContext, useContext, useEffect, useState } from "react";
import { CourseDto } from "../dto/CourseDto";
import { TokenContext } from "./TokenContext";

export const UserContext = createContext({
    user: {
        name: null as string | null,
        setName: (value: string | null) => { console.log(value); },
        email: null as string | null,
        setEmail: (value: string | null) => { console.log(value); },
        year: null as number | null,
        setYear: (value: number | null) => { console.log(value); },
        isAdmin: false as boolean | null,
        setIsAdmin: (value: boolean | null) => { console.log(value); }
    },
    course: {
        course: null as CourseDto | null,
        setCourse: (data: CourseDto | null) => { console.log(data); }
    }
});

export function UserContextProvider({ children }: { children: JSX.Element; }) {
    const [name, setName] = useState<string | null>(localStorage.getItem("name"));
    const [email, setEmail] = useState<string | null>(localStorage.getItem("email"));
    const [year, setYear] = useState<number | null>(typeof localStorage.getItem("year") === "string" ? Number(localStorage.getItem("year")) : null);
    const [isAdmin, setIsAdmin] = useState<boolean | null>(typeof localStorage.getItem("isAdmin") === "string" ? Boolean(localStorage.getItem("isAdmin")) : null);

    const remember = useContext(TokenContext).remember;
    const [course, setCourse] = useState<CourseDto | null>(typeof localStorage.getItem("course") === "string" ? JSON.parse(localStorage.getItem("course") as string) : null);

    useEffect(() => {
        // Course
        if (course !== null && remember)
            localStorage.setItem("course", JSON.stringify(course));
        else
            localStorage.removeItem("course");

        // User
        if (name !== null && remember)
            localStorage.setItem("name", name);
        else
            localStorage.removeItem("name");

        if (email !== null && remember)
            localStorage.setItem("email", email);
        else
            localStorage.removeItem("email");

        if (year !== null && remember)
            localStorage.setItem("year", year.toString());
        else
            localStorage.removeItem("year");

        if (isAdmin !== null && remember)
            localStorage.setItem("isAdmin", isAdmin.toString());
        else
            localStorage.removeItem("isAdmin");
    }, [course, name, email, isAdmin]);

    return (
        <UserContext.Provider value={{
            user: {
                name, setName,
                email, setEmail,
                year, setYear,
                isAdmin, setIsAdmin
            },
            course: {
                course, setCourse
            }
        }}>
            {children}
        </UserContext.Provider>
    );
}
