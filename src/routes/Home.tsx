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
        const start = new Date().toISOString();
        const tomorrow = new Date(new Date().setDate(new Date().getDate() + 1));
        const end = tomorrow.getFullYear() + "-" + (tomorrow.getMonth() + 1) + "-" + tomorrow.getDate() + "T00:00:00.000Z";

        axios.get(new URL(`event/${encodeURIComponent(course?.id as number)}`, apiUrl).toString(), {
            headers: {
                Authorization: "Bearer " + token
            },
            params: {
                start: start,
                end: end
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

    const dayEvents = () => {
        if (events.length > 0) {
            return events.map((event) => {
                return (
                    <div key={event.id}>
                        <p>{event.subject}</p>
                        <p>{event.start.toLocaleTimeString([], { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" })} - {event.end.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</p>
                        <p>Aula {event.classroom.name}</p>
                    </div>
                )
            });
        } else {
            return (<p>NESSUNA Lezione!</p>)
        }
    }

    return (
        <>
            <h2>{course?.code}</h2>
            <h3>{course?.name}</h3>
            { dayEvents() }
        </>
    );
}