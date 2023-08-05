import { ClassroomDto } from "./ClassroomDto";

export type ClassroomStatus = {
    classroom: ClassroomDto;
    free: boolean;
    statusChangedAt: Date;
};
