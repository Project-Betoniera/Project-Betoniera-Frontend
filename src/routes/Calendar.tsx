import axios from "axios";
import { apiUrl } from "../config";
import { TokenContext } from "../context/TokenContext";
import { useContext, useEffect, useRef, useState } from "react";
import { Course } from "../dto/Course";
import QRCode from 'qrcode';
import { CourseContext } from "../context/CourseContext";

export function Calendar() {

    const { token } = useContext(TokenContext);
    const { course } = useContext(CourseContext);

    const [courses, setCourses] = useState<Course[]>([]);
    const [selectedCourse, setSelectedCourse] = useState<string>("");
    const [calendarUrl, setCalendarUrl] = useState<string>("");
    const [calendarProvider, setCalendarProvider] = useState<string>("");
    const [isLinkCopied, setIsLinkCopied] = useState<boolean>(false);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    // Get course list
    useEffect(() => {
        axios.get(new URL("course", apiUrl).toString(), {
            headers: {
                Authorization: "Bearer " + token
            }
        }).then(response => { setCourses(response.data); });
    }, [token]);

    // Update calendar url
    useEffect(() => {
        if (selectedCourse === "") {
            setCalendarUrl("");
        }
        else {
            let result: URL;

            const url = new URL(`event/${encodeURIComponent(selectedCourse)}/ics`, apiUrl);
            url.protocol = "webcal";
            url.searchParams.append("authorization", `Bearer ${token}`);

            switch (calendarProvider) {
                case "google":
                    result = new URL("https://www.google.com/calendar/render");
                    result.searchParams.append("cid", url.toString());
                    break;
                case "outlook":
                    result = new URL("https://outlook.live.com/calendar/addcalendar");
                    result.searchParams.append("url", url.toString());
                    result.searchParams.append("name", `JAC ${courses.find(course => course.id === parseInt(selectedCourse))?.code}`);
                    break;
                case "ms365":
                    result = new URL("https://outlook.office.com/calendar/addcalendar");
                    result.searchParams.append("url", url.toString());
                    result.searchParams.append("name", `JAC ${courses.find(course => course.id === parseInt(selectedCourse))?.code}`);
                    break;
                case "raw":
                    result = url;
                    break;
                default:
                    setCalendarUrl("");
                    return;
            }

            setCalendarUrl(result.toString());
        }

    }, [selectedCourse, calendarProvider, token]);

    // Update QR code
    useEffect(() => {
        // Clear canvas if no course is selected
        if (calendarUrl === "") {
            canvasRef.current?.getContext("2d")?.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
            return;
        }

        QRCode.toCanvas(canvasRef.current, calendarUrl, (error) => { console.error(error); });
    }, [calendarUrl]);

    // Try to set selected course
    useEffect(() => {
        if (course?.id) {
            setSelectedCourse(course.id.toString());
        }
    }, [course])

    return (
        <>
            <div className="container align-left flex-grow">
                <div className="container wide align-left">
                    <h1>📆 Calendario</h1>
                </div>
                <div className="flex-h">
                    <div className="flex-v">
                        <div className="container align-left">
                            <h3>Integrazione con calendari di terze parti - Aggiungi il calendario delle lezioni del tuo corso alla tua app calendario preferita!</h3>
                            <div className="flex-h align-center">
                                <span>Seleziona il tuo corso</span>
                                <select defaultValue={selectedCourse} value={selectedCourse} onChange={(e) => { setSelectedCourse(e.target.value); setIsLinkCopied(false); }}>
                                    <option value="" disabled>Seleziona un corso</option>
                                    {courses.sort((a, b) => a.startYear > b.startYear ? 0 : 1).map(course => <option key={course.id} value={course.id}>{course.code} - {course.name}</option>)}
                                </select>
                            </div>
                            <div className="flex-h align-center">
                                <span>Aggiungi a</span>
                                <select defaultValue="" onChange={(e) => { setCalendarProvider(e.target.value); setIsLinkCopied(false); }}>
                                    <option value="" disabled>Seleziona un calendario</option>
                                    <option value="raw">Link diretto</option>
                                    <option value="google">Google Calendar</option>
                                    <option value="outlook">Outlook (Personale)</option>
                                    <option value="ms365">Outlook (Account aziendale o scolastico)</option>
                                </select>
                            </div>
                        </div>
                        <div className="container align-left container-info">
                            <h3>ℹ️ Informazioni</h3>
                            <span>Se hai un dispositivo Apple, e vuoi aggiungere il calendario su Apple Calendar, seleziona <i>Link diretto</i>, poi scansiona il codice QR.</span>
                            <span>Se su Google calendar non visualizzi il calendario sul cellulare, attiva la sincronizzazione del calendario (Impostazioni &gt; [Nome del calendario aggiunto] &gt; Sincronizzazione)</span>
                        </div>
                        <div className="container align-left container-warning">
                            <h3>⚠️ Attenzione!</h3>
                            <span><strong>I link generati contengono informazioni personali. Non condividerli con nessuno.</strong></span>
                        </div>
                    </div>
                    <div className="flex-v">
                        <div className="container">
                            <h3>Scansiona codice QR</h3>
                            <canvas ref={canvasRef}></canvas>
                        </div>
                        <div className="container">
                            <h3>Oppure</h3>
                            <button disabled={calendarProvider !== "" && selectedCourse !== "" ? false : true} onClick={() => window.open(calendarUrl, "_blank")}>Aggiungi tramite link</button>
                            <button disabled={calendarProvider !== "" && selectedCourse !== "" ? false : true} onClick={() => { navigator.clipboard.writeText(calendarUrl); setIsLinkCopied(true); }}>{isLinkCopied ? "🔗 Link copiato!" : "Copia negli appunti"}</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
