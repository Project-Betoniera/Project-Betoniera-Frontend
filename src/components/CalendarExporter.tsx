import { Button, Combobox, Dropdown, Label, Image, Option, Popover, PopoverSurface, PopoverTrigger, makeStyles, shorthands, tokens } from "@fluentui/react-components";
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
    const [calendarSelectors, setCalendarSelectors] = useState<{ code: string, name: string; fullName: string; }[]>([]);

    // Selected values
    const [calendarType, setCalendarType] = useState<{ code: string, name: string; }>(calendarTypes[0]);
    const [calendarSelector, setCalendarSelector] = useState<{ code: string, name: string; }>(userCourse ? { code: userCourse?.id.toString(), name: userCourse.code } : { code: "", name: "" });
    const [calendarProvider, setCalendarProvider] = useState<{ code: string, name: string; }>(calendarProviders[1]);

    const [calendarUrl, setCalendarUrl] = useState<string>("");
    const [isUrlCopied, setIsUrlCopied] = useState<boolean>(false);
    const [qrCode, setQrCode] = useState<string>("");

    // Get calendar selector list
    useEffect(() => {
        // Clear selectors, but only if the list is already populated (so always but the first time)
        if (calendarSelectors.length > 0) {
            setCalendarSelector({ code: "", name: "" });
            setCalendarSelectors([]);
        }

        switch (calendarType.code) {
            case "course":
                axios.get(new URL("course", apiUrl).toString(), {
                    headers: { Authorization: "Bearer " + tokenData.token },
                    params: { distinct: true }
                }).then(response => {
                    const courses: CourseDto[] = response.data;
                    setCalendarSelectors(courses.map(item => ({ code: item.id.toString(), name: item.code, fullName: `${item.code} - ${item.name}` })));
                }).catch(() => {
                });
                break;
            case "classroom":
                axios.get(new URL("classroom", apiUrl).toString(), {
                    headers: { Authorization: "Bearer " + tokenData.token },
                }).then(response => {
                    const classrooms: ClassroomDto[] = response.data;
                    setCalendarSelectors(classrooms.map(item => ({ code: item.id.toString(), name: item.name, fullName: `Aula ${item.name}` })));
                }).catch(() => {
                });
                break;
            case "teacher":
                axios.get(new URL("teacher", apiUrl).toString(), {
                    headers: { Authorization: "Bearer " + tokenData.token },
                }).then(response => {
                    let teachers: { teacher: string; }[] = response.data;
                    teachers = teachers.filter(item => item.teacher !== null && item.teacher !== " "); // Remove null or empty teachers
                    setCalendarSelectors(teachers.map(item => ({ code: item.teacher, name: item.teacher, fullName: item.teacher })));
                }).catch(() => {
                });
                break;
            default:
                console.error("Invalid calendar selector");
                break;

        }
    }, [calendarType, tokenData]);

    // Update calendar url
    useEffect(() => {
        if (calendarSelector.code === "") {
            setCalendarUrl("");
        }
        else {
            let result: URL;

            const type = calendarType.code === "course" ? "" : `/${calendarType.code}`;

            const url = new URL(`/event${type}/${encodeURIComponent(calendarSelector.code)}/ics`, apiUrl);
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
                    result.searchParams.append("name", `JAC ${calendarSelector.name}`);
                    break;
                case "ms365":
                    result = new URL("https://outlook.office.com/calendar/addcalendar");
                    result.searchParams.append("url", url.toString());
                    result.searchParams.append("name", `JAC ${calendarSelector.name}`);
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

    }, [calendarType, calendarSelector, calendarProvider]);

    // Update QR code
    useEffect(() => {
        if (calendarUrl === "") {
            setQrCode("");
            return;
        }

        QRCode.toDataURL(calendarUrl, (_error, url) => { setQrCode(url); });
    }, [calendarUrl]);

    const handleCalendarTypeChange = (_data: OptionOnSelectData) => {
        setCalendarType(calendarTypes.find(item => item.code === _data.optionValue) || calendarTypes[0]);
        setIsUrlCopied(false);
    };

    const handleCalendarSelectorChange = (data: OptionOnSelectData) => {
        setCalendarSelector({ code: data.selectedOptions[0] || "", name: data.optionText || "" });
        setIsUrlCopied(false);
    };

    const handleCalendarProviderChange = (data: OptionOnSelectData) => {
        setCalendarProvider(calendarProviders.find(item => item.code === data.optionValue) || calendarProviders[0]);
        setIsUrlCopied(false);
    };

    return (
        <>
            <div className={globalStyles.horizontalList}>
                <Label>Calendario per</Label>
                <Dropdown value={calendarType.name} selectedOptions={[calendarType.code]} onOptionSelect={(_event, data) => handleCalendarTypeChange(data)}>
                    {calendarTypes.map(item => <Option key={item.code} value={item.code} text={item.name}>{item.name}</Option>)}
                </Dropdown>
            </div>

            <div className={globalStyles.horizontalList}>
                <Label className={globalStyles.horizontalList}>Scegli {calendarType.name.toLowerCase()}</Label>
                <Combobox placeholder={`Cerca ${calendarType.name.toLowerCase()}`} defaultValue={calendarSelector.name} defaultSelectedOptions={[calendarSelector.code]} onOptionSelect={(_event, data) => handleCalendarSelectorChange(data)}>
                    {calendarSelectors.map(item => <Option key={item.code} value={item.code} text={item.name}>{item.fullName}</Option>)}
                </Combobox>
            </div>

            <div className={globalStyles.horizontalList}>
                <Label>Aggiungi a</Label>
                <Dropdown value={calendarProvider.name} selectedOptions={[calendarProvider.code]} onOptionSelect={(_event, data) => handleCalendarProviderChange(data)}>
                    {calendarProviders.map(item => <Option key={item.code} value={item.code}>{item.name}</Option>)}
                </Dropdown>
            </div>

            <div className={globalStyles.horizontalList}>
                <Button disabled={calendarSelector.code == ""} as="a" href={calendarUrl} target="_blank">Aggiungi tramite link</Button>
                <Button disabled={calendarSelector.code == ""} onClick={() => { navigator.clipboard.writeText(calendarUrl); setIsUrlCopied(true); }}>{isUrlCopied ? "✅ Link copiato!" : "Copia link"}</Button>
                <Popover>
                    <PopoverTrigger>
                        <Button disabled={calendarSelector.code == ""}>Mostra codice QR</Button>
                    </PopoverTrigger>
                    <PopoverSurface>
                        <Image src={qrCode} className={styles.qrCode} />
                    </PopoverSurface>
                </Popover>
            </div>
        </>
    );

}