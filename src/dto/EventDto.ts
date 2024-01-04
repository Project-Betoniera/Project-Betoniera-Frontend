import { ClassroomDto } from "./ClassroomDto";
import { CourseDto } from "./CourseDto";

export type EventDto = {
    id: number,
    start: Date,
    end: Date,
    teacher: string;
    classroom: ClassroomDto,
    course: CourseDto,
    subject: string,
    color?: string,
};
