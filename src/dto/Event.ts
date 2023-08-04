import { ClassroomDto } from "./Classroom";
import { CourseDto } from "./CourseDto";

export type EventDto = {
    id: number,
    start: Date,
    end: Date,
    teacher: string;
    classroom: ClassroomDto,
    course: CourseDto,
    subject: string,
};