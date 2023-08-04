import axios from "axios";
import { apiUrl } from "../config";
import { TokenContext } from "../context/TokenContext";
import { useContext, useEffect, useState } from "react";
import { EventDto } from "../dto/Event";
import { CourseContext } from "../context/CourseContext";
import { ClassroomDto } from "../dto/ClassroomDto";

export function Home() {
    const { token } = useContext(TokenContext);
    const { course } = useContext(CourseContext);

    const [events, setEvents] = useState<EventDto[]>([]);
    const [classrooms, setClassrooms] = useState<ClassroomDto[]>([]);

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
                end: end.toISOString(),
                includeOngoing: true
            }
        }).then(response => {
            let result: EventDto[] = [];

            console.log(response.data);

            (response.data as any[]).forEach(element => {
                element.start = new Date(element.start);
                element.end = new Date(element.end);
                result.push(element as EventDto);
            });

            setEvents(result);
        });
    }, [token]);

    useEffect(() => {
        const start = new Date("2023-05-10T13:20");
        start.setHours(start.getHours() - 1, 0, 0, 0); // Now, minus 1 hour at XX:00:00 (Eg: 14:15 => 13:00)

        const end = new Date(start);
        end.setHours(end.getHours() + 2); // (Eg: 14:15 => 15:00)

        axios.get(new URL(`classroom/free`, apiUrl).toString(), {
            headers: {
                Authorization: "Bearer " + token
            },
            params: {
                start: start.toISOString(),
                end: end.toISOString()
            }
        }).then(response => {
            let result: ClassroomDto[] = response.data;

            setClassrooms(result);
        });
    });

    const remainingEvents = () => events.length > 0 ? (
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

    const freeClassrooms = () => classrooms.length > 0 ? (
        <>
            {
                classrooms.map((classroom) => (
                    <div key={classroom.id} className="container align-left" style={{ backgroundColor: classroom.color.substring(0, 7) + "20" }}>
                        <h3>🏫 {classroom.name}</h3>
                        <span>Libera fino alle [ora]?</span>
                    </div>
                ))
            }
        </>
    ) : (
        <div className="container">
            <p>Nessuna aula libera al momento 😒</p>
        </div>
    );

    return (
        <>
            <div className="container align-left">
                <div className="container wide align-left">
                    <h1>📚 {course?.code} - Lezioni Rimanenti</h1>
                    <h3>{course?.name}</h3>
                </div>
                <div className="flex-h wide align-left">
                    {remainingEvents()}
                </div>
            </div>

            <div className="container align-left">
                <div className="container wide align-left">
                    <h1>🏫 Aule Libere</h1>
                </div>
                <div className="flex-h wide align-left">
                    {freeClassrooms()}
                </div>
            </div>
        </>
    );
}