import axios from "axios";
import { apiUrl } from "../config";
import { TokenContext } from "../context/TokenContext";
import { useContext, useEffect, useState } from "react";
import { EventDto } from "../dto/EventDto";
import { CourseContext } from "../context/CourseContext";
import { ClassroomStatus } from "../dto/ClassroomStatus";
import { Body1, Body2, Button, Card, CardFooter, CardHeader, Input, Popover, PopoverSurface, PopoverTrigger, Spinner, Subtitle2, Title2, makeStyles, mergeClasses } from "@fluentui/react-components";
import { ArrowLeftFilled, ArrowRightFilled, CalendarTodayRegular } from "@fluentui/react-icons";
import { useGlobalStyles } from "../globalStyles";

const useStyles = makeStyles({
    dateSelector: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        "@media screen and (max-width: 578px)": {
            justifyContent: "space-between",
        },
    },
    dateInput: {
        maxWidth: "unset",
        "@media screen and (max-width: 578px)": {
            flexGrow: 1,
            width: "unset",
        }
    },
    arrowButton: {
        width: "4rem",
        maxWidth: "unset",
    }
});

export function Home() {
    const styles = useStyles();
    const globalStyles = useGlobalStyles();

    const { tokenData } = useContext(TokenContext);
    const { course } = useContext(CourseContext);

    const [now] = useState(new Date());
    const [events, setEvents] = useState<EventDto[] | null>(null);
    const [classrooms, setClassrooms] = useState<ClassroomStatus[] | null>(null);
    const [dateTime, setDateTime] = useState(new Date(now.getTime()));

    useEffect(() => {
        const start = new Date(dateTime); // Now
        const end = new Date(start); // Tomorrow at 00:00
        end.setDate(end.getDate() + 1);
        end.setHours(0, 0, 0, 0);

        setEvents(null); // Show spinner
        axios.get(new URL(`event/${encodeURIComponent(course?.id as number)}`, apiUrl).toString(), {
            headers: { Authorization: "Bearer " + tokenData.token },
            params: {
                start: start.toISOString(),
                end: end.toISOString(),
                includeOngoing: true
            }
        }).then(response => {
            let result: EventDto[] = [];

            (response.data as any[]).forEach(element => {
                element.start = new Date(element.start);
                element.end = new Date(element.end);
                result.push(element as EventDto);
            });

            setEvents(result);
        }).catch(() => { });
    }, [dateTime]);

    useEffect(() => {
        axios.get(new URL(`classroom/status`, apiUrl).toString(), {
            headers: { Authorization: "Bearer " + tokenData.token },
            params: { time: now.toISOString(), }
        }).then(response => {
            let result: ClassroomStatus[] = response.data;

            const exclude = [5, 19, 20, 21, 22, 23, 24, 25, 26, 31, 32, 33];
            result = result.filter((element) => !exclude.includes(element.classroom.id) && element.status.isFree !== false);

            // Convert strings to objects
            result = result.map((item) => {
                item.status.statusChangeAt = item.status.statusChangeAt ? new Date(item.status.statusChangeAt) : null;
                if (item.status.currentOrNextEvent) {
                    item.status.currentOrNextEvent.start = new Date(item.status.currentOrNextEvent.start);
                    item.status.currentOrNextEvent.end = new Date(item.status.currentOrNextEvent.end);
                }
                item.classroom = item.classroom;
                return item;
            });

            setClassrooms(result);
        }).catch(() => { });
    }, []);

    const renderEvents = () => events && events.length > 0 ? (
        events.map((event) => (
            <Card className={mergeClasses(globalStyles.card, event.start <= now && event.end > now ? globalStyles.ongoing : "")} key={event.id}>
                <CardHeader
                    header={<Subtitle2>💼 {event.subject}</Subtitle2>}
                    description={event.start <= now && event.end > now ? <Body2 className={globalStyles.blink}>🔴 <strong>In corso</strong></Body2> : ""}
                />
                <div>
                    <Body1>⌚ {event.start.toLocaleTimeString([], { timeStyle: "short" })} - {event.end.toLocaleTimeString([], { timeStyle: "short" })}</Body1>
                    <br />
                    <Body1>📍 Aula {event.classroom.name}</Body1>
                    <br />
                    {event.teacher ? <Body1>🧑‍🏫 {event.teacher}</Body1> : ""}
                </div>
            </Card>
        ))
    ) : (
        <Card className={globalStyles.card}><Subtitle2>😊 Nessuna lezione {dateTime.toDateString() !== now.toDateString() ? `${"programmata per il " + dateTime.toLocaleDateString([], { dateStyle: "medium" })}` : "rimasta per oggi"}</Subtitle2></Card>
    );

    const renderClassrooms = () => classrooms && classrooms.length > 0 ? classrooms.map((item) => {
        const nextEvent = item.status.currentOrNextEvent;

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
                    <h3>Prossima lezione</h3>
                    {
                        nextEvent ? (
                            <>
                                <Body1>💼 {nextEvent.subject}</Body1>
                                <br />
                                <Body1>⌚ {nextEvent.start.toLocaleString([], { dateStyle: "medium", timeStyle: "short" })}</Body1>
                                <br />
                                <Body1>📚 {nextEvent.course.code} {nextEvent.course.name}</Body1>
                                <br />
                                {nextEvent.teacher ? <Body1>🧑‍🏫 {nextEvent.teacher}</Body1> : ""}
                            </>
                        ) : (<Body1>Nessuna</Body1>)
                    }
                </PopoverSurface>
            </Popover>
        );
    }) : (<Card className={globalStyles.card}><Subtitle2>😒 Nessuna aula libera al momento</Subtitle2></Card>);

    const onBackButtonClick = () => {
        let result: Date = new Date(dateTime.getTime());

        result.setDate(result.getDate() - 1);
        result.toDateString() == now.toDateString() ? result = now : result.setHours(0, 0, 0, 0);

        setDateTime(result);
    };

    const onForwardButtonClick = () => {
        let result: Date = new Date(dateTime.getTime());

        result.setDate(result.getDate() + 1);
        result.toDateString() == now.toDateString() ? result = now : result.setHours(0, 0, 0, 0);

        setDateTime(result);
    };

    const onTodayButtonClick = () => { if (now.toDateString() !== dateTime.toDateString()) setDateTime(new Date(now.getTime())); };

    return (
        <>
            <div className={globalStyles.container}>
                <Card className={globalStyles.titleBar}>
                    <CardHeader
                        header={<Title2>📚 {course?.code} - Lezioni</Title2>}
                        description={<><Subtitle2>{course?.name}</Subtitle2></>}
                    />
                    <CardFooter className={styles.dateSelector}>
                        <Button className={styles.arrowButton} icon={<ArrowLeftFilled />} onClick={onBackButtonClick}></Button>
                        <Input className={styles.dateInput} type="date" onChange={(_event, data) => { data.value && setDateTime(new Date(data.value)); }} value={new Date(dateTime.getTime() - (now.getTimezoneOffset() * 60000)).toISOString().split('T')[0]}></Input>
                        <Button className={styles.arrowButton} disabled={dateTime.toDateString() === now.toDateString()} onClick={onTodayButtonClick} icon={<CalendarTodayRegular />}></Button>
                        <Button className={styles.arrowButton} icon={<ArrowRightFilled />} onClick={onForwardButtonClick}></Button>
                    </CardFooter>
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
