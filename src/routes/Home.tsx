import axios from "axios";
import { apiUrl } from "../config";
import { TokenContext } from "../context/TokenContext";
import { useContext, useEffect, useState } from "react";
import { EventDto } from "../dto/EventDto";
import { CourseContext } from "../context/CourseContext";
import { ClassroomStatus } from "../dto/ClassroomStatus";
import { Body1, Caption1, Card, CardHeader, Popover, PopoverSurface, PopoverTrigger, Subtitle2, Title2, makeStyles, shorthands, tokens } from "@fluentui/react-components";
import { useGlobalStyles } from "../globalStyle";

const useStyles = makeStyles({
    titleBar: {
        display: "flex",
        flexDirection: "column",
        alignSelf: "stretch",
        ...shorthands.borderRadius(tokens.borderRadiusXLarge),
        ...shorthands.padding("1rem"),
        "& h3": {
            ...shorthands.margin("0"),
            ...shorthands.padding("0"),
        },
        backgroundColor: tokens.colorNeutralBackground2,
    },
    grid: {
        display: "flex",
        flexWrap: "wrap",

        ...shorthands.gap("1rem"),
        ...shorthands.margin("1rem"),
    }
});

export function Home() {
    const styles = useStyles();
    const globalStyles = useGlobalStyles();

    const { tokenData } = useContext(TokenContext);
    const { course } = useContext(CourseContext);

    const [events, setEvents] = useState<EventDto[]>([]);
    const [classrooms, setClassrooms] = useState<ClassroomStatus[]>([]);

    const [now] = useState(new Date());

    useEffect(() => {
        const start = new Date(now); // Now
        const end = new Date(start); // Tomorrow at 00:00
        end.setDate(end.getDate() + 1);
        end.setHours(0, 0, 0, 0);

        axios.get(new URL(`event/${encodeURIComponent(course?.id as number)}`, apiUrl).toString(), {
            headers: {
                Authorization: "Bearer " + tokenData.token
            },
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
    }, []);

    useEffect(() => {
        axios.get(new URL(`classroom/status`, apiUrl).toString(), {
            headers: {
                Authorization: "Bearer " + tokenData.token
            },
            params: {
                time: now.toISOString(),
            }
        }).then(response => {
            let result: ClassroomStatus[] = response.data;

            const exclude = [5, 19, 20, 21, 22, 23, 24, 25, 26, 32, 33];
            result = result.filter((element) => !exclude.includes(element.classroom.id) && element.status.isFree !== false);

            // Convert objects to objects
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

    const remainingEvents = () => events.length > 0 ? (
        <>
            {
                events.map((event) => (
                    <Card className={globalStyles.card} key={event.id}>
                        <CardHeader
                            header={
                                <Subtitle2>💼 {event.subject}</Subtitle2>
                            }
                            description={
                                <Caption1>
                                    {event.start < now ? <span>🔴 <strong>In corso</strong></span> : ""}
                                </Caption1>
                            }
                        />
                        <>
                            <span>⌚ {event.start.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} - {event.end.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                            <span>📍 Aula {event.classroom.name}</span>
                            <span>🧑‍🏫 {event.teacher}</span>
                        </>
                    </Card>
                ))
            }
        </>
    ) : (
        <Card className={globalStyles.card}>
            <CardHeader
                header={
                    <Subtitle2>Nessuna lezione rimasta per oggi 😊</Subtitle2>
                }
            />
        </Card>
    );

    const freeClassrooms = () => classrooms.length > 0 ? (
        <>
            {
                classrooms.map((item) => {
                    let changeTime = "";
                    const nextEvent = item.status.currentOrNextEvent;

                    if (!item.status.statusChangeAt || item.status.statusChangeAt.getDate() != now.getDate())
                        changeTime = "Fino a domani";
                    else
                        changeTime = "Fino alle " + item.status.statusChangeAt.toLocaleString([], { hour: "2-digit", minute: "2-digit" });

                    return (
                        <Popover inline={true} key={item.classroom.id}>
                            <PopoverTrigger disableButtonEnhancement>
                                <Card className={globalStyles.card}>
                                    <CardHeader
                                        header={
                                            <Subtitle2>🏫 Aula {item.classroom.name}</Subtitle2>
                                        }
                                    />
                                    <Body1>{changeTime}</Body1>
                                </Card>
                            </PopoverTrigger>

                            <PopoverSurface>
                                <h3>Prossima lezione</h3>
                                {
                                    nextEvent ? (
                                        <>
                                            <Body1>⌚ {nextEvent.start.toLocaleString([], { dateStyle: "medium", timeStyle: "short" })}</Body1>
                                            <br />
                                            <Body1>📚 {nextEvent.course.code} {nextEvent.course.name}</Body1>
                                            <br />
                                            <Body1>💼 {nextEvent.subject}</Body1>
                                            <br />
                                            <Body1>🧑‍🏫 {nextEvent.teacher}</Body1>
                                        </>
                                    ) : (
                                        <Body1>Nessuna</Body1>
                                    )
                                }
                            </PopoverSurface>
                        </Popover>
                    );
                })
            }
        </>
    ) : (
        <Card className={globalStyles.card}>
            <CardHeader
                header={
                    <Subtitle2>Nessuna aula libera al momento 😒</Subtitle2>
                }
            />
        </Card>
    );

    return (
        <>
            <div className={globalStyles.container}>
                <Card className={styles.titleBar}>
                    <CardHeader
                        header={
                            <Title2>📚 {course?.code} - Lezioni Rimanenti</Title2>
                        }
                        description={
                            <Subtitle2>{course?.name}</Subtitle2>
                        }
                    />
                </Card>

                <div className={styles.grid}>
                    {remainingEvents()}
                </div>
            </div>

            <div className={globalStyles.container}>
                <Card className={styles.titleBar}>
                    <CardHeader
                        header={
                            <Title2>🏫 Aule Libere</Title2>
                        }
                        description={
                            <Subtitle2>Alle {now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</Subtitle2>
                        }
                    />
                </Card>

                <div className={styles.grid}>
                    {freeClassrooms()}
                </div>
            </div>
        </>
    );
}
