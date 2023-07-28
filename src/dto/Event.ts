import { Classroom } from "./Classroom";
import { Course } from "./Course";

export type Event = {
    id: number,
    start: Date,
    end: Date,
    teacher: string;
    classroom: Classroom,
    course: Course,
    subject: string,
}