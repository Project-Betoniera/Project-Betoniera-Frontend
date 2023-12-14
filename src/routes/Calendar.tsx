import { Button, Caption1, Card, CardHeader, DialogActions, Dialog, DialogBody, DialogContent, DialogSurface, DialogTitle, DialogTrigger, Subtitle1, Subtitle2, Title3, makeStyles, mergeClasses, shorthands, tokens, Spinner, Caption2, Popover, PopoverTrigger, PopoverSurface, Label, Select, Combobox, SelectOnChangeData, Option } from "@fluentui/react-components";
import { ChangeEvent, useContext, useEffect, useState } from "react";
import { DateSelector } from "../components/DateSelector";
import { EventDto } from "../dto/EventDto";
import { CourseContext } from "../context/CourseContext";
import { useGlobalStyles } from "../globalStyles";
import { CircleFilled, SettingsRegular, CalendarMonthRegular, CalendarWeekNumbersRegular, ArrowExportRegular } from "@fluentui/react-icons";
import EventDetails from "../components/EventDetails";
import useRequests from "../libraries/requests/requests";
import { generateMonth, generateWeek } from "../libraries/calendarGenerator/calendarGenerator";
import { OptionOnSelectData, SelectionEvents } from "@fluentui/react-combobox";
import axios from "axios";
import { apiUrl } from "../config";
import { TokenContext } from "../context/TokenContext";
import { RouterButton } from "../components/RouterButton";

const useStyles = makeStyles({
    container: {
        display: "flex",
        flexDirection: "column",
        flexGrow: 1,
        ...shorthands.gap("0.5rem"),
        ...shorthands.margin("0", "1rem"),
    },
    toolbar: {
        display: "flex",
        justifyContent: "space-between",
        flexDirection: "row",
        "@media screen and (max-width: 578px)": {
            justifyContent: "stretch",
            flexDirection: "column",
        }
    },
    toolbarButtons: {
        display: "flex",
        flexDirection: "row",
        columnGap: "0.5rem",
        justifyContent: "flex-end",
        "@media (max-width: 578px)": {
            justifyContent: "space-between",
        }
    },
    syncButton: {
        "@media screen and (max-width: 578px)": {
            flexGrow: 1,
        }
    },
    calendarHeader: {
        display: "grid",
        columnGap: "0.5rem",
        gridTemplateColumns: "repeat(7, 1fr)",
        ...shorthands.padding("0.5rem", "0"),
        "@media screen and (max-width: 578px)": {
            ...shorthands.margin("0.2rem"),
            columnGap: "0.2rem",
        }
    },
    headerItem: {
        textAlign: "center",
    },
    calendarContainer: {
        position: "relative",
        display: "flex",
        flexDirection: "row",
        flexGrow: "1",
        minHeight: "14rem"
    },
    calendar: {
        position: "absolute",
        width: "100%",
        top: "0",
        bottom: "0",
        display: "grid",
        gridTemplateColumns: "repeat(7, 1fr)",
        gridAutoRows: "1fr",
        ...shorthands.gap("0.5rem"),
    },
    card: {
        display: "flex",
        ...shorthands.margin("0rem"),
        ...shorthands.gap("0.3rem"),
        ...shorthands.padding("0.5rem"),
        "@media screen and (max-width: 578px)": {
            ...shorthands.gap("0"),
            ...shorthands.padding("0.2rem"),
        }
    },
    todayBadge: {
        backgroundColor: tokens.colorBrandBackground,
        ":hover": {
            backgroundColor: tokens.colorBrandBackgroundHover
        },
        color: "white"
    },
    eventIndicator: {
        "@media (min-width: 351px)": {
            display: "none",
        }
    },
    verticalEventIndicator: {
        "@media (max-width: 350px), (min-height: 601px)": {
            display: "none",
        }
    },
    eventContainer: {
        display: "flex",
        minHeight: 0,
        flexShrink: 1,
        overflowY: "auto",
        flexDirection: "column",
        rowGap: "0.4rem",
        "@media (max-width: 578px)": {
            rowGap: "0.2rem",
            overflowY: "hidden",
        },
        "@media (max-width: 350px), (max-height: 600px)": {
            display: "none",
        },
    },
    event: {
        flexShrink: 0,
        ...shorthands.padding("0.25rem"),
        ...shorthands.margin("0"),
        backgroundColor: tokens.colorBrandBackground2Hover,
    },
    eventText: {
        display: "block",
        overflowX: "hidden",
        whiteSpace: "nowrap",
        textOverflow: "ellipsis",
    }
});

export function Calendar() {
    const globalStyles = useGlobalStyles();
    const styles = useStyles();
    const token = useContext(TokenContext).token;
    const { course } = useContext(CourseContext);
    const requests = useRequests();
    const [currentView, setCurrentView] = useState<boolean>(true);

    // TODO Use proper localization
    const calendarLocal = {
        months: ["Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio", "Giugno", "Luglio", "Agosto", "Settembre", "Ottobre", "Novembre", "Dicembre"],
        monthsAbbr: ["Gen", "Feb", "Mar", "Apr", "Mag", "Giu", "Lug", "Ago", "Set", "Ott", "Nov", "Dic"],
        weekDays: ["Lunedì", "Martedì", "Mercoledì", "Giovedì", "Venerdì", "Sabato", "Domenica"],
        weekDaysAbbr: ["Lun", "Mar", "Mer", "Gio", "Ven", "Sab", "Dom"]
    };

    // Items for the calendar selector
    const calendarTypes: { code: string, name: string; }[] = [
        { code: "course", name: "Corso", },
        { code: "classroom", name: "Aula" },
        { code: "teacher", name: "Docente" },
    ];

    const [calendarSelectors, setCalendarSelectors] = useState<{ code: string, name: string; fullName: string; }[]>([]);
    const [calendarType, setCalendarType] = useState<{ code: string, name: string; }>(calendarTypes[0]);
    const [calendarSelector, setCalendarSelector] = useState<{ code: string, name: string; }>(course ? { code: course?.id.toString(), name: course.code } : { code: "", name: "" });

    // Set calendar selector from URL
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);

        const input_course = params.get("course");
        const input_classroom = params.get("classroom");

        if (input_course || input_classroom) {
            if (input_course) {
                requests.course.byId(Number(params.get("course"))).then((course) => {
                    console.log(course);
                    if (!course[0]) { throw new Error("Invalid course"); }
                    setCalendarSelector({
                        code: input_course,
                        name: course[0].code
                    });
                }).catch(console.error);
            } else if (input_classroom) {
                requests.classroom.byId(Number(input_classroom)).then((classroom) => {
                    if (!classroom[0]) { throw new Error("Invalid classroom"); }
                    setCalendarType(calendarTypes[1]); // Set calendar type to classroom
                    setCalendarSelector({
                        code: input_classroom,
                        name: classroom[0].name
                    })
                }).catch(console.error);
            }
        }
    }, []);

    const [now] = useState(new Date());
    const [dateTime, setDateTime] = useState(new Date(now));
    const [events, setEvents] = useState<EventDto[] | null>(null);
    const result = currentView ? generateMonth(dateTime).flat() : generateWeek(dateTime);

    useEffect(() => {

        // If the calendar selector is empty, don't fetch anything
        if (calendarSelector.code === "") return;

        const start = result[0];
        const end = result[result.length - 1];
        end.setDate(end.getDate() + 1);
        end.setHours(0, 0, 0, 0);

        setEvents(null); // Show spinner

        switch (calendarType.code) {
            case "course":
                requests.event.byCourse(start, end, Number(calendarSelector.code) || 0, true)
                    .then(setEvents)
                    .catch(console.error); // TODO Handle error
                break;
            case "classroom":
                requests.event.byClassroom(start, end, Number(calendarSelector.code) || 0, true)
                    .then(setEvents)
                    .catch(console.error); // TODO Handle error
                break;
            case "teacher":
                requests.event.byTeacher(start, end, calendarSelector.code, true)
                    .then(setEvents)
                    .catch(console.error); // TODO Handle error
                break;
            default:
                console.error("Invalid calendar selector");
                break;
        }
    }, [dateTime, currentView, calendarSelector]);

    const renderCalendar = () =>
        events && result.map((day) => {
            const filteredEvents = events.filter((event) => event.start.toLocaleDateString() === day.toLocaleDateString());

            const renderPreviewEvents = (events: EventDto[]) => {
                return events.map((event) => event.start.toLocaleDateString() === day.toLocaleDateString() &&
                    <Card key={event.id} className={styles.event}>
                        <Caption1 className={currentView ? styles.eventText : undefined}>{event.subject}</Caption1>
                        <div style={currentView ? { display: "none" } : undefined}>
                            <Caption2>{event.start.toLocaleString([], { timeStyle: "short" })} - {event.end.toLocaleString([], { timeStyle: "short" })}</Caption2>
                            <br />
                            <Caption2>Aula {event.classroom.name}</Caption2>
                        </div>
                    </Card>
                );
            };

            const renderDetailedEvents = (events: EventDto[]) => events && events.length > 0 ? events.map((event) => (
                <Card key={event.id} className={mergeClasses(globalStyles.eventCard, (event.start <= dateTime && event.end > dateTime) && globalStyles.ongoing)}>
                    <EventDetails event={event} title="subject" now={now} />
                </Card>
            )) : (<Subtitle2>Nessuna</Subtitle2>);

            return (
                <Dialog key={day.getTime()}>
                    <DialogTrigger>
                        <Card key={day.getTime()} className={mergeClasses(styles.card, now.toLocaleDateString() === day.toLocaleDateString() && styles.todayBadge)}>
                            <CardHeader action={filteredEvents.length > 0 ? <CircleFilled className={styles.verticalEventIndicator} color={now.toLocaleDateString() === day.toLocaleDateString() ? "white" : tokens.colorBrandBackground} /> : undefined} header={<Subtitle2>{day.toLocaleDateString([], { day: "numeric" })}</Subtitle2>} />
                            {filteredEvents.length > 0 && <CircleFilled className={styles.eventIndicator} color={now.toLocaleDateString() === day.toLocaleDateString() ? "white" : tokens.colorBrandBackground} />}
                            <div className={styles.eventContainer}>
                                {renderPreviewEvents(filteredEvents)}
                            </div>
                        </Card>
                    </DialogTrigger>
                    <DialogSurface>
                        <DialogBody>
                            <DialogTitle>
                                <Title3>Lezioni {now.toLocaleDateString() === day.toLocaleDateString() ? "di oggi" : `del ${day.toLocaleDateString([], { day: "numeric", month: "long" })}`}</Title3>
                            </DialogTitle>
                            <DialogContent className={globalStyles.list}>
                                {renderDetailedEvents(filteredEvents)}
                            </DialogContent>
                            <DialogActions>
                                <DialogTrigger>
                                    <Button appearance="primary">Chiudi</Button>
                                </DialogTrigger>
                            </DialogActions>
                        </DialogBody>
                    </DialogSurface>
                </Dialog>
            );
        });

    const renderFilters = () => {
        // Get calendar selector list
        useEffect(() => {
            // Clear selectors, but only if the list is already populated (so always but the first time)
            if (calendarSelectors.length > 0) {
                setCalendarSelector({ code: "", name: "" });
                setCalendarSelectors([]);
            }

            switch (calendarType.code) {
                case "course":
                    requests.course.all().then((courses) => {
                        setCalendarSelectors(courses.map(item => ({ code: item.id.toString(), name: item.code, fullName: `${item.code} - ${item.name}` })));
                    })
                    break;
                case "classroom":
                    requests.classroom.all().then(classrooms => {
                        setCalendarSelectors(classrooms.map(item => ({ code: item.id.toString(), name: item.name, fullName: `Aula ${item.name}` })));
                    })
                    break;
                case "teacher":
                    axios.get(new URL("teacher", apiUrl).toString(), {
                        headers: { Authorization: "Bearer " + token },
                    }).then(response => {
                        let teachers: { teacher: string; }[] = response.data;
                        teachers = teachers.filter(item => item.teacher !== null && item.teacher !== " "); // Remove null or empty teachers
                        setCalendarSelectors(teachers.map(item => ({ code: item.teacher, name: item.teacher, fullName: item.teacher })));
                    }).catch(() => {
                        console.error("Error while fetching teachers");
                    });
                    break;
                default:
                    console.error("Invalid calendar selector");
                    break;
            }
        }, [calendarType, token]);

        const onCalendarTypeChange = (_event: ChangeEvent<HTMLSelectElement>, data: SelectOnChangeData) => {
            setCalendarType(calendarTypes.find(item => item.code === data.value) || calendarTypes[0]);
        };

        const onCalendarSelectorChange = (_event: SelectionEvents, data: OptionOnSelectData) => {
            setCalendarSelector({ code: data.selectedOptions[0] || "", name: data.optionText || "" });
        };

        return (
            <>
                <div className={globalStyles.horizontalList}>
                    <Label>Calendario per</Label>
                    <Select value={calendarType.code} onChange={onCalendarTypeChange}>
                        {calendarTypes.map(item => <option key={item.code} value={item.code}>{item.name}</option>)}
                    </Select>
                </div>

                <div className={globalStyles.horizontalList}>
                    <Label className={globalStyles.horizontalList}>Scegli {calendarType.name.toLowerCase()}</Label>
                    <Combobox placeholder={`Cerca ${calendarType.name.toLowerCase()}`} defaultValue={calendarSelector.name} defaultSelectedOptions={[calendarSelector.code]} onOptionSelect={onCalendarSelectorChange}>
                        {calendarSelectors.map(item => <Option key={item.code} value={item.code} text={item.name}>{item.fullName}</Option>)}
                    </Combobox>
                </div>
            </>
        )
    };

    return (
        <div className={styles.container}>
            <Card className={styles.toolbar}>
                <DateSelector now={now} dateTime={dateTime} setDateTime={setDateTime} inputType={currentView ? "month" : "week"} />
                <div className={styles.toolbarButtons}>
                    <Button icon={currentView ? <CalendarWeekNumbersRegular /> : <CalendarMonthRegular />} onClick={() => setCurrentView(!currentView)}>{currentView ? "Settimana" : "Mese"}</Button>
                    <Popover>
                        <PopoverTrigger>
                            <Button icon={<SettingsRegular />} />
                        </PopoverTrigger>
                        <PopoverSurface>
                            {renderFilters()}
                        </PopoverSurface>
                    </Popover>
                    <RouterButton className={styles.syncButton} as="a" icon={<ArrowExportRegular />} href="/calendar-sync">Integrazioni</RouterButton>
                </div>
            </Card>

            <Card className={styles.calendarHeader}>
                {window.matchMedia('(max-width: 578px)').matches ?
                    calendarLocal.weekDaysAbbr.map((day) => { return (<Subtitle1 key={day} className={styles.headerItem}>{day}</Subtitle1>); })
                    : calendarLocal.weekDays.map((day) => { return (<Subtitle1 key={day} className={styles.headerItem}>{day}</Subtitle1>); })}
            </Card>

            {events ? (
                <div className={styles.calendarContainer}>
                    <div className={styles.calendar}>{renderCalendar()}</div>
                </div>
            ) : <Spinner size="huge" />}
        </div>
    );
}
