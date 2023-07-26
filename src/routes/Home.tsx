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
        axios.get(new URL(`event/${encodeURIComponent(course?.id as number)}`, apiUrl).toString(), {
            headers: {
                Authorization: "Bearer " + token
            },
            params: {
                start: '2023-01-20 07:0:0',
                end: '2023-01-21 0:0:0'
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

    const SUS = () => {
        if (events.length > 0) {
            return events.map((event) => {
                return (
                    <div key={event.id}>
                        <p>{event.subject}</p>
                        <p>{event.start.toLocaleString()}</p>
                        <p>{event.end.toLocaleString()}</p>
                        <p>Aula {event.classroom.name}</p>
                    </div>
                )
            });
        } else {
            return (<p>NO Event!</p>)
        }
    }

    return (
        <>
            <h1>Home</h1>
            { typeof events[0]?.start}
            { SUS() }
        </>
    );
}