import { useContext, useEffect, useState } from "react";
import { EventDto } from "../dto/EventDto";
import { CourseContext } from "../context/CourseContext";
import { ClassroomStatus } from "../dto/ClassroomStatus";
import { Body1, Card, CardHeader, Popover, PopoverSurface, PopoverTrigger, Spinner, Subtitle2, Title2 } from "@fluentui/react-components";
import { useGlobalStyles } from "../globalStyles";
import { DateSelector } from "../components/DateSelector";
import EventDetails from "../components/EventDetails";
import { ClassroomDto } from "../dto/ClassroomDto";
import useRequests from "../libraries/requests/requests";
import { TimekeeperContext } from '../context/TimekeeperContext';

export function Home() {
    const globalStyles = useGlobalStyles();

    const requests = useRequests();
    const { course } = useContext(CourseContext);

    const [now, setNow] = useState(() => new Date());
    const [dateTime, setDateTime] = useState(() => new Date());
    const [events, setEvents] = useState<EventDto[] | null>(null);
    const [classrooms, setClassrooms] = useState<ClassroomStatus[] | null>(null);

    const { timekeeper } = useContext(TimekeeperContext);
    useEffect(() => {
        const updateTime = () => setNow(new Date());
        timekeeper.addListener('minute', updateTime);
        return () => timekeeper.removeListener(updateTime);
    }, []);

    useEffect(() => {
        const start = new Date(dateTime); // Now
        const end = new Date(start); // Tomorrow at 00:00
        end.setDate(end.getDate() + 1);
        end.setHours(0, 0, 0, 0);

        setEvents(null); // Show spinner

        requests.event.byCourse(start, end, course?.id || 0, true)
            .then(setEvents)
            .catch(console.error); // TODO Handle error
    }, [dateTime]);

    useEffect(() => {
        requests.classroom.status(now)
            .then(setClassrooms)
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
                    {nextEvent ? <EventDetails event={nextEvent as EventDto} title="custom" customTitle="Prossima lezione" hide={["classroom"]} /> : <Subtitle2>Nessuna lezione</Subtitle2>}
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
                    />
                    <DateSelector autoUpdate={true} inputType="date" dateTime={dateTime} setDateTime={setDateTime} />
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
                    />
                </Card>
                <div className={globalStyles.grid}>
                    {classrooms ? (renderClassrooms()) : (<Spinner size="huge" />)}
                </div>
            </div>
        </>
    );
}
