import { ClassroomDto } from "./ClassroomDto";
import { EventDto } from "./EventDto";

export type ClassroomStatus = {
    classroom: ClassroomDto;
    status: {
        isFree: boolean;
        statusChangeAt: Date | null;
        currentOrNextEvent: Omit<EventDto, "classroom"> | null;
    };
};
