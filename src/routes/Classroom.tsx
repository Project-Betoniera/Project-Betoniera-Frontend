import { useContext, useEffect, useState } from "react";
import { apiUrl } from "../config";
import axios from "axios";
import { TokenContext } from "../context/TokenContext";
import { ClassroomStatus } from "../dto/ClassroomStatus";
import { EventDto } from "../dto/EventDto";

export function Classroom() {
    const { tokenData } = useContext(TokenContext);

    const [classrooms, setClassrooms] = useState<ClassroomStatus[]>([]);

    const [now] = useState(new Date());
    const [dateTime, setDateTime] = useState(new Date());

    const [error, setError] = useState(false);

    const [popUp, setPopUp] = useState(false);
    const [event, setEvent] = useState<EventDto[]>([]);

    useEffect(() => {
        axios.get(new URL(`classroom/status`, apiUrl).toString(), {
            headers: {
                Authorization: "Bearer " + tokenData.token
            },
            params: {
                time: dateTime.toISOString(),
            }
        }).then(response => {
            let result: ClassroomStatus[] = response.data;

            const exclude = [5, 19, 20, 21, 22, 23, 24, 25, 26, 32, 33];
            result = result.filter((item) => !exclude.includes(item.classroom.id));

            result = result.map((item) => {
                item.status.statusChangeAt = item.status.statusChangeAt ? new Date(item.status.statusChangeAt) : null;
                return item;
            });

            setClassrooms(result);
        }).catch(() => {
            setError(true);
        });
    }, [dateTime]);

    function fetchEvent(start: Date, end: Date, classroomID: number) {
        axios.get(new URL(`/event/classroom/${encodeURIComponent(classroomID)}`, apiUrl).toString(), {
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
    
            setEvent(result);
        }).catch(() => {
            setError(true);
        });
    }

    function displayPopUp(end: Date, classroomID: number) {
        fetchEvent(dateTime, end, classroomID);
        setPopUp(true);
        console.log(classroomID, end);
    }

    return (
        <>
            <div className="main-container container" style={{ display: classrooms[0]?.classroom && !error ? "none" : "flex"}}>
                <img id="loadingIndicator" src={error ? "/errorLogo.svg" : "./logo.svg"} alt="Loading..." style={{ width: "15rem", height: "15rem"}}/>
                {error ? (<><span style={{ fontSize: "2rem", fontWeight: "bold", color: "red"}}>ERROR</span><span>Ricarica la pagina!</span></>) : (<span>Loading...</span>)}
                {error ? <button onClick={() => window.location.reload()}>Ricarica</button> : ""}
            </div>

            <div className="main-container container align-left" style={{ display: classrooms[0]?.classroom && !error ? "flex" : "none"}}>
                <div className="container wide align-left">
                    <h1>🏫 Stato Aule</h1>
                    <h3>📅 {new Date().toLocaleDateString([], { year: "numeric", month: "numeric", day: "numeric", hour: "2-digit", minute: "2-digit" })}</h3>
                    <input type="datetime-local" defaultValue={dateTime.toLocaleString()} min="2018-10-01T00:00" onChange={(e) => setDateTime(new Date(e.target.value))} />
                </div>
                <div className="element-container flex-h wide align-left wrap">
                    {
                        classrooms.map((item) => {
                            const status = item.status.isFree ? "🟢 Libera" : "🔴 Occupata";
                            let changeTime = "";

                            if (!item.status.statusChangeAt)
                                changeTime = "⌚ Nessun evento programmato.";
                            else if (item.status.statusChangeAt.getDate() == dateTime.getDate())
                                changeTime = "⌚ Fino alle " + item.status.statusChangeAt.toLocaleString([], { hour: "2-digit", minute: "2-digit" });
                            else
                                changeTime = "⌚ " + item.status.statusChangeAt.toLocaleString([], { day: "2-digit", month: "2-digit", year: "2-digit", hour: "2-digit", minute: "2-digit" });
                            /*
                            return (
                                <div key={item.classroom.id} className="class-element container align-left" style={{ backgroundColor: item.status.isFree ? "#00FF0030" : "#FF000030" }}>
                                    <h3>🏫 Aula {item.classroom.name}</h3>
                                    <span>{status}</span>
                                    <span>{changeTime}</span>
    
                                </div>
                            );
                            */

                            if (item.status.isFree) {
                                return (
                                    <div key={item.classroom.id} className="class-element container align-left" style={{ backgroundColor: "#00FF0030", boxShadow: "rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px" }}>
                                        <h3>🏫 {item.classroom.name}</h3>
                                        <span>{status}</span>
                                        <span>{changeTime}</span>
                                    </div>
                                )
                            }
                            else {
                                return (
                                    <a onClick={() => {displayPopUp(item.status.statusChangeAt as Date,item.classroom.id)}} style={{ color: "var(--text)", cursor: "pointer", display: "contents"}}>
                                        <div key={item.classroom.id} className="class-element container align-left" style={{ backgroundColor: "#FF000030", boxShadow: "rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px" }}>
                                            <h3>🏫 {item.classroom.name}</h3>
                                            <span>{status}</span>
                                            <span>{changeTime}</span>
                                        </div>
                                    </a>
                                )
                            }
                        })
                    }
                </div>
                <div className="pop-up-backdrop" style={{ display: popUp ? "flex" : "none" }}>
                    <div className="pop-up-container" style={{ display: popUp ? "flex" : "none" }}>
                        <div className="container align-left">

                            <h3>💼 {event[0]?.subject}</h3>
                            {event[0]?.start < now && event[0].end > now ? <span id="inProgressIndicator">🔴 <strong>In corso</strong></span> : ""}
                            <span>⌚ {event[0]?.start.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} - {event[0]?.end.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                            <span>📍 Aula {event[0]?.classroom.name}</span>
                            <span>🎒 {event[0]?.course.code} - {event[0]?.course.name} ({event[0]?.course.startYear}/{event[0]?.course.endYear})</span>
                            <span>🧑‍🏫 {event[0]?.teacher}</span>

                            {/*
                            <h3>💼 M4 TEST TESTTESTTEST</h3>
                            <span id="inProgressIndicator">🔴 <strong>In corso</strong></span>
                            <span>⌚ 09:00 - 13:00</span>
                            <span>📍 Aula 305</span>
                            <span>🧑‍🏫 Mario Rossi</span>
                            */}
                        </div>
                        <button onClick={() => setPopUp(false)} style={{fontSize: "1rem"}}>Chiudi</button>
                    </div>
                </div>
            </div>
        </>
    );
}
