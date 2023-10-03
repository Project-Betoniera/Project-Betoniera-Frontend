import axios from "axios";
import { apiUrl } from "../config";
import { TokenContext } from "../context/TokenContext";
import { useContext, useEffect, useRef, useState } from "react";
import { CourseDto } from "../dto/CourseDto";
import QRCode from 'qrcode';
import { CourseContext } from "../context/CourseContext";
import { Body1, Card, CardHeader, Option, Combobox, Dropdown, Subtitle2, Title2 } from "@fluentui/react-components";
import { useGlobalStyles } from "../globalStyles";

export function Calendar() {
    const globalStyles = useGlobalStyles();

    const { tokenData } = useContext(TokenContext);
    const { course } = useContext(CourseContext);

    const [courses, setCourses] = useState<CourseDto[]>([]);
    const [selectedCourse, setSelectedCourse] = useState<string>("");
    const [calendarUrl, setCalendarUrl] = useState<string>("");
    const [calendarProvider, setCalendarProvider] = useState<string>("");
    const [isLinkCopied, setIsLinkCopied] = useState<boolean>(false);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const qrCodeRef = useRef<HTMLDivElement>(null);

    // Get course list
    useEffect(() => {
        axios.get(new URL("course", apiUrl).toString(), {
            headers: {
                Authorization: "Bearer " + tokenData.token
            },
            params: {
                distinct: true
            }
        }).then(response => {
            setCourses(response.data);
        }).catch(() => {
        });
    }, [tokenData]);

    // Update calendar url
    useEffect(() => {
        if (selectedCourse === "") {
            setCalendarUrl("");
        }
        else {
            let result: URL;

            const url = new URL(`event/${encodeURIComponent(selectedCourse)}/ics`, apiUrl);
            url.protocol = "webcal";
            url.searchParams.append("authorization", `Bearer ${tokenData.token}`);

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

    }, [selectedCourse, calendarProvider, tokenData]);

    // Update QR code
    useEffect(() => {
        // Clear canvas if no course is selected
        if (calendarUrl === "") {
            canvasRef.current?.getContext("2d")?.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
            return;
        }

        QRCode.toCanvas(canvasRef.current, calendarUrl, (error) => { if (error) console.error(error); });
    }, [calendarUrl]);

    // Try to set selected course
    useEffect(() => {
        if (course?.id) {
            setSelectedCourse(course.id.toString());
        }
    }, [course]);

    return (
        <>
            <div className={globalStyles.container}>
                <Card className={globalStyles.card}>
                    <CardHeader
                        header={<Title2>📆 Esporta calendario</Title2>}
                        description={<Subtitle2>Integrazione con calendari di terze parti</Subtitle2>}
                    />
                </Card>
                <div className={globalStyles.container}>
                    <Body1>Aggiungi il calendario delle lezioni del tuo corso alla tua app calendario preferita!</Body1>
                    <div className="container align-left">
                        <div className="display-block flex-h align-center">
                            <Body1>Seleziona il tuo corso</Body1>
                            <Combobox defaultValue={course ? course.code : ""} onOptionSelect={(_event, data) => { setSelectedCourse(data.optionValue || ""); setIsLinkCopied(false); }}>
                                {courses.map(course => <Option
                                    key={course.id.toString()}
                                    value={course.id.toString()}
                                    text={course.code}
                                >{course.code} - {course.name}</Option>)}
                            </Combobox>
                        </div>
                        <div className="display-block flex-h align-center">
                            <span>Aggiungi a</span>
                            <Dropdown defaultValue="" placeholder="Seleziona un calendario" onOptionSelect={(_event, data) => { setCalendarProvider(data.optionValue || ""); setIsLinkCopied(false); }}>
                                <Option value="raw">Link diretto</Option>
                                <Option value="google">Google Calendar</Option>
                                <Option value="outlook">Outlook (Personale)</Option>
                                <Option value="ms365">Outlook (Account aziendale o scolastico)</Option>
                            </Dropdown>
                        </div>
                    </div>
                    <div className={globalStyles.list}>
                        <Card className={globalStyles.card}>
                            <Subtitle2>ℹ️ Informazioni</Subtitle2>
                            <Body1>Se hai un dispositivo Apple, e vuoi aggiungere il calendario su Apple Calendar, seleziona <i>Link diretto</i>, poi scansiona il codice QR.</Body1>
                            <Body1>Se su Google calendar non visualizzi il calendario sul cellulare, attiva la sincronizzazione del calendario (Impostazioni &gt; [Nome del calendario aggiunto] &gt; Sincronizzazione)</Body1>
                        </Card>
                        <Card className={globalStyles.card}>
                            <Subtitle2>⚠️ Attenzione!</Subtitle2>
                            <Body1><strong>I link generati contengono informazioni personali. Non condividerli con nessuno.</strong></Body1>
                        </Card>
                    </div>
                    <div id="qrCodeContainer" ref={qrCodeRef} className="flex-v">
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
