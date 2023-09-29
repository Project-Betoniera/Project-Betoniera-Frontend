import axios from "axios";
import { apiUrl } from "../config";
import { TokenContext } from "../context/TokenContext";
import { useContext, useEffect, useState } from "react";
import { EventDto } from "../dto/EventDto";
import { CourseContext } from "../context/CourseContext";
import { ClassroomStatus } from "../dto/ClassroomStatus";
import { Caption1, Card, CardHeader, makeStyles, shorthands, tokens } from "@fluentui/react-components";
import { useGlobalStyles } from "../globalStyle";

const useStyles = makeStyles({
    titleBar: {
        display: "flex",
        flexDirection: "column",
        alignSelf: "stretch",
        ...shorthands.padding("1.5rem"),
        ...shorthands.borderRadius("1rem"),
        ...shorthands.gap("1rem"),
        backgroundColor: tokens.colorNeutralBackground2,
        "& h1, h3": {
            ...shorthands.margin("0"),
            ...shorthands.padding("0"),
        }
    },
    grid: {
        display: "flex",

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

            result = result.map((item) => {
                item.status.statusChangeAt = item.status.statusChangeAt ? new Date(item.status.statusChangeAt) : null;
                return item;
            });

            setClassrooms(result);
        }).catch(() => { });
    }, []);

    const remainingEvents = () => events.length > 0 ? (
        <>
            {
                events.map((event) => (
                    <Card className={globalStyles.card}>
                        <CardHeader
                            header={
                                <h3>💼 {event.subject}</h3>

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
        <div className={globalStyles.card}>
            <p>Nessuna lezione rimasta per oggi 😊</p>
        </div>
    );

    const freeClassrooms = () => classrooms.length > 0 ? (
        <>
            {
                classrooms.map((element) => {
                    let changeTime = "";

                    if (!element.status.statusChangeAt || element.status.statusChangeAt.getDate() != now.getDate())
                        changeTime = "Fino a domani.";
                    else
                        changeTime = "Fino alle " + element.status.statusChangeAt.toLocaleString([], { hour: "2-digit", minute: "2-digit" });

                    return (
                        <div key={element.classroom.id} className={globalStyles.card} style={{ backgroundColor: element.classroom.color.substring(0, 7) + "20" /* Override transparency */, boxShadow: "rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px" }}>
                            <h3>🏫 Aula {element.classroom.name}</h3>
                            <span>{changeTime}</span>

                        </div>
                    );
                })
            }
        </>
    ) : (
        <div className="container">
            <p>Nessuna aula libera al momento 😒</p>
        </div>
    );

    return (
        <>
            <div className={globalStyles.container} style={{ display: events[0]?.id || classrooms[0]?.classroom ? "flex" : "none" }}>
                <div className={styles.titleBar}>
                    <h1>📚 {course?.code} - Lezioni Rimanenti</h1>
                    <h3>{course?.name}</h3>
                </div>
                <div className={styles.grid}>
                    {remainingEvents()}
                </div>
            </div>

            <div className={globalStyles.container} style={{ display: events[0]?.id || classrooms[0]?.classroom ? "flex" : "none" }}>
                <div className={styles.titleBar}>
                    <h1>🏫 Aule Libere</h1>
                </div>
                <div className={styles.grid}>
                    {freeClassrooms()}
                </div>
            </div>
        </>
    );
}
