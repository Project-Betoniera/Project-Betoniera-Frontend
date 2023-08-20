import axios from "axios";
import { apiUrl } from "../config";
import { TokenContext } from "../context/TokenContext";
import { useContext, useEffect, useState } from "react";
import { EventDto } from "../dto/EventDto";
import { CourseContext } from "../context/CourseContext";
import { ClassroomStatus } from "../dto/ClassroomStatus";

export function Home() {
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
        });
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
        });
    }, []);

    const remainingEvents = () => events.length > 0 ? (
        <>
            {
                events.map((event) => (
                    <div key={event.id} className="container align-left" style={event.start < now ? { backgroundColor: "#00FF0030" } : {}}>
                        <h3>💼 {event.subject}</h3>
                        {event.start < now ? <span id="inProgressIndicator">🔴 <strong>In corso</strong></span> : ""}
                        <span>⌚ {event.start.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} - {event.end.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                        <span>📍 Aula {event.classroom.name}</span>
                        <span>🧑‍🏫 {event.teacher}</span>
                    </div>
                ))
            }
        </>
    ) : (
        <div className="container">
            <p>Nessuna lezione rimasta per oggi 😊</p>
        </div>
    );

    const freeClassrooms = () => classrooms.length > 0 ? (
        <>
            {
                classrooms.map((element) => {
                    let changeTime = "";

                    if (!element.status.statusChangeAt || element.status.statusChangeAt.getDate() != now.getDate())
                        changeTime = "Fino alle 18:00";
                    else
                        changeTime = "Fino alle " + element.status.statusChangeAt.toLocaleString([], { hour: "2-digit", minute: "2-digit" });

                    return (
                        <div key={element.classroom.id} className="element container align-left" style={{ backgroundColor: element.classroom.color.substring(0, 7) + "20" /* Override transparency */ }}>
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
            <div className="main-container container align-left">
                <div className="container wide align-left">
                    <h1>📚 {course?.code} - Lezioni Rimanenti</h1>
                    <h3>{course?.name}</h3>
                </div>
                <div className="element-container flex-h wide align-left wrap">
                    {remainingEvents()}
                </div>
            </div>

            <div className="main-container container align-left">
                <div className="container wide align-left">
                    <h1>🏫 Aule Libere</h1>
                </div>
                <div className="element-container flex-h wide align-left wrap">
                    {freeClassrooms()}
                </div>
            </div>
        </>
    );
}
