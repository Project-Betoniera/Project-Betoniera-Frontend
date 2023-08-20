import { ClassroomDto } from "./ClassroomDto";

export type ClassroomStatus = {
    classroom: ClassroomDto;
    status: {
        isFree: boolean;
        statusChangeAt: Date | null;
    };
};
