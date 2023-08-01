import { createContext, useEffect, useState } from "react";
import { CourseDto } from "../dto/Course";

export const CourseContext = createContext({ course: null as CourseDto | null, setCourse: (data: CourseDto | null) => { console.log(data); } });

export function CourseContextProvider({ children }: { children: JSX.Element; }) {

    const [course, setCourse] = useState<CourseDto | null>(typeof localStorage.getItem("course") === "string" ? JSON.parse(localStorage.getItem("course") as string) : null);

    useEffect(() => {
        if (course !== null)
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
