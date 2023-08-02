import { createContext, useContext, useEffect, useState } from "react";
import { Course } from "../dto/Course";
import { TokenContext } from "./TokenContext";

export const CourseContext = createContext({ course: null as Course | null, setCourse: (data: Course | null) => { console.log(data); } });

export function CourseContextProvider({ children }: { children: JSX.Element; }) {

    const { tokenData } = useContext(TokenContext);
    const [course, setCourse] = useState<Course | null>(typeof localStorage.getItem("course") === "string" ? JSON.parse(localStorage.getItem("course") as string) : null);

    useEffect(() => {
        if (course !== null && tokenData.remember)
            localStorage.setItem("course", JSON.stringify(course));
        else
            localStorage.removeItem("course");
    }, [course]);

    return (
        <CourseContext.Provider value={{ course, setCourse }}>
            {children}
        </CourseContext.Provider>
    );
}
