import axios from "axios";
import { apiUrl } from "../config";
import { TokenContext } from "../context/TokenContext";
import { useContext, useEffect, useState } from "react";
import { CourseDto } from "../dto/CourseDto";
import QRCode from 'qrcode';
import { CourseContext } from "../context/CourseContext";
import { Body1, Card, CardHeader, Option, Combobox, Dropdown, Subtitle2, Title2, Label, Link, mergeClasses, Button, makeStyles, shorthands, Image, Popover, PopoverTrigger, PopoverSurface, tokens } from "@fluentui/react-components";
import { useGlobalStyles } from "../globalStyles";

const useStyles = makeStyles({
    horizontalList: {
        display: "flex",
        alignItems: "center",
        ...shorthands.gap("1rem")
    },
    qrCode: {
        ...shorthands.borderRadius(tokens.borderRadiusXLarge)
    },
    warning: {
        backgroundColor: tokens.colorStatusWarningBackground1,
    }
});

export function Calendar() {
    const styles = useStyles();
    const globalStyles = useGlobalStyles();

    const { tokenData } = useContext(TokenContext);
    const { course } = useContext(CourseContext);

    const [courses, setCourses] = useState<CourseDto[]>([]);
    const [selectedCourse, setSelectedCourse] = useState<string>("");
    const [calendarUrl, setCalendarUrl] = useState<string>("");
    const [calendarProvider, setCalendarProvider] = useState<string>("");
    const [isLinkCopied, setIsLinkCopied] = useState<boolean>(false);
    const [qrCode, setQrCode] = useState<string>("");

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
            setQrCode("");
            return;
        }

        QRCode.toDataURL(calendarUrl, (_error, url) => {
            setQrCode(url);
        });
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
                <div className={mergeClasses(globalStyles.container, globalStyles.list)}>
                    <Body1>
                        Da questa pagina è possibile creare un link al calendario per il proprio corso, ed aggiungerlo ad un'app di terze parti (ad esempio <Link href="https://calendar.google.com" target="_blank">Google Calendar</Link>).
                        <br />
                        Il calendario contiene tutti gli eventi del corso, e si aggiornerà automaticamente in caso di modifiche.
                    </Body1>

                    <div className={styles.horizontalList}>
                        <Label className={styles.horizontalList}>Seleziona corso</Label>
                        <Combobox defaultValue={course ? course.code : ""} onOptionSelect={(_event, data) => { setSelectedCourse(data.optionValue || ""); setIsLinkCopied(false); }}>
                            {courses.map(course => <Option
                                key={course.id.toString()}
                                value={course.id.toString()}
                                text={course.code}
                            >{course.code} - {course.name}</Option>)}
                        </Combobox>
                    </div>

                    <div className={styles.horizontalList}>
                        <Label>Aggiungi a</Label>
                        <Dropdown defaultValue="" placeholder="Seleziona un calendario" onOptionSelect={(_event, data) => { setCalendarProvider(data.optionValue || ""); setIsLinkCopied(false); }}>
                            <Option value="raw">Link diretto</Option>
                            <Option value="google">Google Calendar</Option>
                            <Option value="outlook">Outlook (Personale)</Option>
                            <Option value="ms365">Outlook (Account aziendale o scolastico)</Option>
                        </Dropdown>
                    </div>

                    <div className={styles.horizontalList}>
                        <Button disabled={calendarProvider === "" || selectedCourse === ""} as="a" href={calendarUrl} target="_blank">Aggiungi tramite link</Button>
                        <Button disabled={calendarProvider === "" || selectedCourse === ""} onClick={() => { navigator.clipboard.writeText(calendarUrl); setIsLinkCopied(true); }}>{isLinkCopied ? "✅ Link copiato!" : "Copia link"}</Button>
                        <Popover>
                            <PopoverTrigger>
                                <Button disabled={calendarProvider === "" || selectedCourse === ""}>Mostra QR code</Button>
                            </PopoverTrigger>
                            <PopoverSurface>
                                <Image src={qrCode} className={styles.qrCode} />
                            </PopoverSurface>
                        </Popover>
                    </div>

                    <Card className={globalStyles.card}>
                        <Subtitle2>ℹ️ Informazioni</Subtitle2>
                        <Body1>Se hai un dispositivo Apple, e vuoi aggiungere il calendario su Apple Calendar, seleziona <i>Link diretto</i>, poi scansiona il codice QR.</Body1>
                        <Body1>Se da Google calendar non visualizzi il calendario sul cellulare, attiva la sincronizzazione del calendario (Impostazioni &gt; JAC {courses.find(course => course.id == parseInt(selectedCourse))?.code} &gt; Sincronizzazione)</Body1>
                    </Card>
                    <Card className={mergeClasses(globalStyles.card, styles.warning)}>
                        <Subtitle2>⚠️ Attenzione!</Subtitle2>
                        <Body1><strong>I link generati contengono informazioni personali. Non condividerli con nessuno.</strong></Body1>
                    </Card>
                </div>
            </div>
        </>
    );
}
