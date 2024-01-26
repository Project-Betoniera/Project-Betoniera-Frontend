import { Body1, Card, CardHeader, Popover, PopoverSurface, PopoverTrigger, Spinner, Subtitle2, Title2 } from "@fluentui/react-components";
import { useContext, useEffect, useState } from "react";
import { DateSelector } from "../components/DateSelector";
import EventDetails from "../components/EventDetails";
import { TimekeeperContext } from "../context/TimekeeperContext";
import { UserContext } from "../context/UserContext";
import { ClassroomDto } from "../dto/ClassroomDto";
import { ClassroomStatus } from "../dto/ClassroomStatus";
import { EventDto } from "../dto/EventDto";
import { useGlobalStyles } from "../globalStyles";
import useRequests from "../libraries/requests/requests";

export function Home() {
    const globalStyles = useGlobalStyles();

    const requests = useRequests();
    const { course } = useContext(UserContext).course;

    const [now, setNow] = useState(() => new Date());
    const [dateTime, setDateTime] = useState(() => new Date());
    const [showEventsSideSpinner, setShowEventsSideSpinner] = useState(false);
    const [events, setEvents] = useState<EventDto[] | null>(null);
    const [classrooms, setClassrooms] = useState<ClassroomStatus[] | null>(null);
    const [showClassroomsSideSpinner, setShowClassroomsSideSpinner] = useState(false);

    const { timekeeper } = useContext(TimekeeperContext);
    useEffect(() => {
        const updateTime = () => setNow(new Date());
        timekeeper.addListener("minute", updateTime);
        return () => timekeeper.removeListener(updateTime);
    }, []);

    useEffect(() => {
        const start = new Date(dateTime); // Now
        const end = new Date(start); // Tomorrow at 00:00
        end.setDate(end.getDate() + 1);
        end.setHours(0, 0, 0, 0);

        // Clear current data and show spinner only if the side spinner is not already visible
        if (!showEventsSideSpinner)
            setEvents(null);

        requests.event.byCourse(start, end, course?.id || 0, true)
            .then(setEvents)
            .then(() => setShowEventsSideSpinner(false))
            .catch(console.error); // TODO Handle error
    }, [dateTime]);

    useEffect(() => {
        // Show side spinner spinner only if the main spinner is not already visible (classrooms == null)
        if (classrooms !== null)
            setShowClassroomsSideSpinner(true);

        requests.classroom.status(now)
            .then(setClassrooms)
            .then(() => setShowClassroomsSideSpinner(false))
            .catch(console.error); // TODO Handle error
    }, [now]);

    const renderEvents = () => events && events.length > 0 ? (
        events.map((event) => (
            <EventDetails as="card" key={event.id} event={event} title="subject" hide={["course"]} />
        ))
    ) : (
        <Card className={globalStyles.card}><Subtitle2>😊 Nessuna lezione {dateTime.toDateString() !== now.toDateString() ? `${"programmata per il " + dateTime.toLocaleDateString([], { dateStyle: "medium" })}` : "rimasta per oggi"}</Subtitle2></Card>
    );

    const renderClassrooms = () => classrooms && classrooms.length > 0 ? classrooms.filter(item => item.status.isFree).map((item) => {
        // TODO Return classroom object inside ClassroomStatus object
        const fixNextEvent = (event: Omit<EventDto, "classroom"> | null, classroom: ClassroomDto) => {
            if (!event) return null;

            let result: EventDto = {
                id: event.id,
                start: event.start,
                end: event.end,
                subject: event.subject,
                teacher: event.teacher,
                course: event.course,
                classroom: classroom
            };

            return result;
        };

        const nextEvent = fixNextEvent(item.status.currentOrNextEvent, item.classroom);

        let changeTime = "";
        if (!item.status.statusChangeAt || item.status.statusChangeAt.getDate() != now.getDate())
            changeTime = "Fino a domani";
        else
            changeTime = "Fino alle " + item.status.statusChangeAt.toLocaleTimeString([], { timeStyle: "short" });

        return (
            <Popover key={item.classroom.id}>
                <PopoverTrigger>
                    <Card className={globalStyles.card}>
                        <CardHeader header={<Subtitle2>🏫 Aula {item.classroom.name}</Subtitle2>} />
                        <Body1>{changeTime}</Body1>
                    </Card>
                </PopoverTrigger>
                <PopoverSurface>
                    {nextEvent ? <EventDetails event={nextEvent as EventDto} title="custom" customTitle="Prossima lezione" linkToCalendar={true} hide={["classroom"]} /> : <Subtitle2>Nessuna lezione</Subtitle2>}
                </PopoverSurface>
            </Popover>
        );
    }) : (<Card className={globalStyles.card}><Subtitle2>😒 Nessuna aula libera al momento</Subtitle2></Card>);

    return (
        <>
            <div className={globalStyles.container}>
                <Card className={globalStyles.titleBar}>
                    <CardHeader
                        header={<Title2>📚 {course?.code} - Lezioni</Title2>}
                        description={<><Subtitle2>{course?.name}</Subtitle2></>}
                        action={showEventsSideSpinner ? <Spinner size="small" /> : undefined}
                    />
                    <DateSelector autoUpdate={true} inputType="day" dateTime={dateTime} setDateTime={(newDateTime, autoUpdated) => {
                        setShowEventsSideSpinner(autoUpdated);
                        setDateTime(newDateTime);
                    }} />
                </Card>
                <div className={globalStyles.grid}>
                    {events ? (renderEvents()) : (<Spinner size="huge" />)}
                </div>
            </div>

            <div className={globalStyles.container}>
                <Card className={globalStyles.titleBar}>
                    <CardHeader
                        header={<Title2>🏫 Aule Libere</Title2>}
                        description={<Subtitle2>Alle {now.toLocaleTimeString([], { timeStyle: "short" })}</Subtitle2>}
                        action={showClassroomsSideSpinner ? <Spinner size="small" /> : undefined}
                    />
                </Card>
                <div className={globalStyles.grid}>
                    {classrooms ? (renderClassrooms()) : (<Spinner size="huge" />)}
                </div>
            </div>
        </>
    );
}
