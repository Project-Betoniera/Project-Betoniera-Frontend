import { Body1, Button, Combobox, Dropdown, Label, Image, Option, Popover, PopoverSurface, PopoverTrigger, Link, makeStyles, shorthands, tokens } from "@fluentui/react-components";
import { useGlobalStyles } from "../globalStyles";
import { useContext, useEffect, useState } from "react";
import QRCode from 'qrcode';
import { TokenContext } from "../context/TokenContext";
import { CourseContext } from "../context/CourseContext";
import { CourseDto } from "../dto/CourseDto";
import { ClassroomDto } from "../dto/ClassroomDto";
import axios from "axios";
import { apiUrl } from "../config";
import { OptionOnSelectData } from "@fluentui/react-combobox";

const useStyles = makeStyles({
    qrCode: {
        ...shorthands.borderRadius(tokens.borderRadiusXLarge)
    },
});

export function CalendarExporter() {
    const globalStyles = useGlobalStyles();
    const styles = useStyles();

    const { tokenData } = useContext(TokenContext);
    const { course: userCourse } = useContext(CourseContext);

    const calendarTypes: { code: string, name: string; }[] = [
        { code: "course", name: "Corso", },
        { code: "classroom", name: "Aula" },
        { code: "teacher", name: "Docente" },
    ];

    const calendarProviders: { code: string, name: string; }[] = [
        { code: "raw", name: "Link diretto" },
        { code: "google", name: "Google Calendar" },
        { code: "outlook", name: "Outlook (Personale)" },
        { code: "ms365", name: "Outlook (Account aziendale o scolastico)" },
    ];

    // Calendar selectors
    const [courses, setCourses] = useState<CourseDto[]>([]);
    const [classrooms, setClassrooms] = useState<ClassroomDto[]>([]);
    const [teachers, setTeachers] = useState<{ teacher: string; }[]>([]);

    // Selected values
    const [calendarType, setCalendarType] = useState<{ code: string, name: string; }>(calendarTypes[0]);
    const [calendarSelector, setCalendarSelector] = useState<string>("");
    const [calendarProvider, setCalendarProvider] = useState<{ code: string, name: string; }>(calendarProviders[0]);

    const [calendarUrl, setCalendarUrl] = useState<string>("");
    const [isUrlCopied, setIsUrlCopied] = useState<boolean>(false);
    const [qrCode, setQrCode] = useState<string>("");

    // Get course list
    useEffect(() => {
        axios.get(new URL("course", apiUrl).toString(), {
            headers: { Authorization: "Bearer " + tokenData.token },
            params: { distinct: true }
        }).then(response => {
            setCourses(response.data);
        }).catch(() => {
        });
    }, []);

    // Update calendar url
    useEffect(() => {
        if (calendarSelector === "") {
            setCalendarUrl("");
        }
        else {
            let result: URL;

            const url = new URL(`event/${encodeURIComponent(calendarSelector)}/ics`, apiUrl);
            url.protocol = "webcal";
            url.searchParams.append("authorization", `Bearer ${tokenData.token}`);

            switch (calendarProvider.code) {
                case "google":
                    result = new URL("https://www.google.com/calendar/render");
                    result.searchParams.append("cid", url.toString());
                    break;
                case "outlook":
                    result = new URL("https://outlook.live.com/calendar/addcalendar");
                    result.searchParams.append("url", url.toString());
                    result.searchParams.append("name", `JAC ${courses.find(course => course.id === parseInt(calendarSelector))?.code}`);
                    break;
                case "ms365":
                    result = new URL("https://outlook.office.com/calendar/addcalendar");
                    result.searchParams.append("url", url.toString());
                    result.searchParams.append("name", `JAC ${courses.find(course => course.id === parseInt(calendarSelector))?.code}`);
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

    }, [calendarSelector, calendarProvider, tokenData]);

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
        if (userCourse?.id) {
            setCalendarSelector(userCourse.id.toString());
        }
    }, [userCourse]);

    const handleCalendarTypeChange = (_data: OptionOnSelectData) => { };

    const handleCalendarSelectorChange = (data: OptionOnSelectData) => {
        setCalendarSelector(data.optionValue || "");
        setIsUrlCopied(false);
    };

    const handleCalendarProviderChange = (data: OptionOnSelectData) => {
        setCalendarProvider(calendarProviders.find(item => item.code === data.optionValue) || calendarProviders[0]);
        setIsUrlCopied(false);
    };

    return (
        <>
            <Body1>
                Da questa pagina è possibile creare un link al calendario per il proprio corso, ed aggiungerlo ad un'app di terze parti (ad esempio <Link href="https://calendar.google.com" target="_blank">Google Calendar</Link>).
                <br />
                Il calendario contiene tutti gli eventi del corso, e si aggiornerà automaticamente in caso di modifiche.
            </Body1>

            <div className={globalStyles.horizontalList}>
                <Label>Calendario per</Label>
                <Dropdown onOptionSelect={(_event, data) => handleCalendarTypeChange(data)}>
                    {calendarTypes.map(item => <Option key={item.code} value={item.code} text={item.name}>{item.name}</Option>)}
                </Dropdown>
            </div>

            <div className={globalStyles.horizontalList}>
                <Label className={globalStyles.horizontalList}>Seleziona corso / aula / docente</Label>
                <Combobox defaultValue={userCourse ? userCourse.code : ""} onOptionSelect={(_event, data) => handleCalendarSelectorChange(data)}>
                    {courses.map(course => <Option
                        key={course.id.toString()}
                        value={course.id.toString()}
                        text={course.code}
                    >{course.code} - {course.name}</Option>)}
                </Combobox>
            </div>

            <div className={globalStyles.horizontalList}>
                <Label>Aggiungi a</Label>
                <Dropdown defaultValue="" placeholder="Seleziona un calendario" onOptionSelect={(_event, data) => handleCalendarProviderChange(data)}>
                    {calendarProviders.map(item => <Option key={item.code} value={item.code}>{item.name}</Option>)}
                </Dropdown>
            </div>

            <div className={globalStyles.horizontalList}>
                <Button disabled={calendarProvider === "" || calendarSelector === ""} as="a" href={calendarUrl} target="_blank">Aggiungi tramite link</Button>
                <Button disabled={calendarProvider === "" || calendarSelector === ""} onClick={() => { navigator.clipboard.writeText(calendarUrl); setIsUrlCopied(true); }}>{isUrlCopied ? "✅ Link copiato!" : "Copia link"}</Button>
                <Popover>
                    <PopoverTrigger>
                        <Button disabled={calendarProvider === "" || calendarSelector === ""}>Mostra QR code</Button>
                    </PopoverTrigger>
                    <PopoverSurface>
                        <Image src={qrCode} className={styles.qrCode} />
                    </PopoverSurface>
                </Popover>
            </div>
        </>
    );

}