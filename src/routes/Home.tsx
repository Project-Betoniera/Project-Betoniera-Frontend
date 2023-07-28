import axios from "axios";
import { apiUrl } from "../config";
import { TokenContext } from "../context/TokenContext";
import { useContext, useEffect, useState } from "react";
import { Event } from "../dto/Event";
import { CourseContext } from "../context/CourseContext";
export function Home() {

    const { token } = useContext(TokenContext);
    const { course } = useContext(CourseContext);

    const [events, setEvents] = useState<Event[]>([]);

    useEffect(() => {
        const start = new Date(); // Now
        start.setMinutes(0, 0, 0); // Now, at the beginning of the current hour

        const end = new Date(start); // Tomorrow at 00:00
        end.setDate(end.getDate() + 1);
        end.setHours(0, 0, 0, 0);

        axios.get(new URL(`event/${encodeURIComponent(course?.id as number)}`, apiUrl).toString(), {
            headers: {
                Authorization: "Bearer " + token
            },
            params: {
                start: start.toISOString(),
                end: end.toISOString()
            }
        }).then(response => {
            let result: Event[] = [];

            console.log(response.data);

            (response.data as any[]).forEach(element => {
                element.start = new Date(element.start);
                element.end = new Date(element.end);
                result.push(element as Event);
            });

            setEvents(result);
        });
    }, [token]);

    const remainingEvents = () => events.length > 0 ?
        (
            <>
                {
                    events.map((event) => (
                        <div key={event.id} className="container align-left">
                            <h3>💼 {event.subject}</h3>
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

    return (
        <div className="container align-left">
            <div className="container wide align-left">
                <h1>📚 {course?.code} - Lezioni rimanenti</h1>
                <h3>{course?.name}</h3>
            </div>
            <div className="flex-h wide align-left">
                {remainingEvents()}
            </div>
        </div>
    );
}