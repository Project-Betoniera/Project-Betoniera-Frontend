import { Button, Caption1, Caption2, Card, CardHeader, Dialog, DialogActions, DialogBody, DialogContent, DialogSurface, DialogTitle, DialogTrigger, Drawer, DrawerBody, DrawerHeader, DrawerHeaderTitle, Subtitle1, Subtitle2, Title3, makeStyles, mergeClasses, shorthands, tokens } from "@fluentui/react-components";
import { ArrowExportRegular, CalendarMonthRegular, CalendarWeekNumbersRegular, CircleFilled, DismissRegular, SettingsRegular } from "@fluentui/react-icons";
import { useContext, useEffect, useState } from "react";
import { DateSelector } from "../components/DateSelector";
import EventDetails from "../components/EventDetails";
import { CalendarSelection, CalendarSelector, CalendarTypeCode } from "../components/calendar/CalendarSelector";
import { RouterButton } from "../components/router/RouterButton";
import { CourseContext } from "../context/CourseContext";
import { EventDto } from "../dto/EventDto";
import { useGlobalStyles } from "../globalStyles";
import { generateMonth, generateWeek } from "../libraries/calendarGenerator/calendarGenerator";
import useRequests from "../libraries/requests/requests";

const useStyles = makeStyles({
    drawerContainer: {
        display: "flex",
        flexDirection: "row",
        flexGrow: 1,
        minHeight: 0,
        ...shorthands.gap("0.5rem"),
    },
    drawer: {
        ...shorthands.borderRadius(tokens.borderRadiusMedium)
    },
    container: {
        display: "flex",
        flexDirection: "column",
        flexGrow: 1,
        ...shorthands.gap("0.5rem"),
    },
    sideMargin: {
        ...shorthands.margin("0", "1rem"),
    },
    toolbar: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexDirection: "row",
        "@media screen and (max-width: 578px)": {
            justifyContent: "stretch",
            flexDirection: "column",
            alignItems: "unset"
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

    const [now] = useState(new Date());
    const [dateTime, setDateTime] = useState(new Date(now));

    const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
    const [events, setEvents] = useState<EventDto[] | null>(null);

    const [calendarType, setCalendarType] = useState<{ code: CalendarTypeCode, name: string; }>({ code: "course", name: "Corso" });
    const [calendarSelection, setCalendarSelection] = useState<{ code: string, name: string; }>(course ? { code: course?.id.toString(), name: course.code } : { code: "", name: "" });

    const calendarView = currentView ? generateMonth(dateTime).flat() : generateWeek(dateTime);

    const onCalendarSelectionChange = async (selection: CalendarSelection[]) => {
        const getEvents = () => {
            const requestedEvents: EventDto[] = [];

            selection.forEach(element => {
                switch (element.type) {
                    case "course":
                        return requests.event.byCourse(calendarView[0], calendarView[calendarView.length - 1], parseInt(element.code)).then((result) => {
                            requestedEvents.push(...result);
                        });
                    case "classroom":
                        return requests.event.byClassroom(calendarView[0], calendarView[calendarView.length - 1], parseInt(element.code)).then((result) => {
                            requestedEvents.push(...result);
                        });
                    case "teacher":
                        return requests.event.byTeacher(calendarView[0], calendarView[calendarView.length - 1], element.code).then((result) => {
                            requestedEvents.push(...result);
                        });
                }
            });

            return requestedEvents;

            /*
            switch (selection.type) {
                case "course":
                    return requests.event.byCourse(result[0], result[result.length - 1], parseInt(selection.code));
                case "classroom":
                    return requests.event.byClassroom(result[0], result[result.length - 1], parseInt(selection.code));
                case "teacher":
                    return requests.event.byTeacher(result[0], result[result.length - 1], selection.code);
            }
            */
        };

        //setCalendarType({ code: selection.type, name: selection.type === "course" ? "Corso" : selection.type === "classroom" ? "Aula" : "Docente" });
        //setCalendarSelection(selection);
        setEvents(await getEvents());
    };

    // Load default calendar on first render
    useEffect(() => {
        if (!course) return;
        onCalendarSelectionChange([{ code: course.id.toString(), name: course.code, color: "", display: true, type: "course" }]);
    }, []);

    const renderCalendar = () =>
        calendarView.map((day) => {
            const filteredEvents = events ? events.filter((event) => event.start.toLocaleDateString() === day.toLocaleDateString()) : [];

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

    return (
        <div className={mergeClasses(styles.container, styles.sideMargin)}>
            <Card className={styles.toolbar}>
                <DateSelector now={now} dateTime={dateTime} setDateTime={setDateTime} inputType={currentView ? "month" : "week"} />
                <Subtitle2>Calendario per '{calendarType.code === "classroom" && "Aula "}{calendarSelection.name}'</Subtitle2>
                <div className={styles.toolbarButtons}>
                    <Button icon={currentView ? <CalendarWeekNumbersRegular /> : <CalendarMonthRegular />} onClick={() => setCurrentView(!currentView)}>{currentView ? "Settimana" : "Mese"}</Button>
                    <Button icon={<SettingsRegular />} onClick={() => setIsDrawerOpen(!isDrawerOpen)} />
                    <RouterButton className={styles.syncButton} as="a" icon={<ArrowExportRegular />} href="/calendar-sync">Integrazioni</RouterButton>
                </div>
            </Card>

            <div className={styles.drawerContainer}>
                <div className={styles.container}>

                    <Card className={styles.calendarHeader}>
                        {window.matchMedia('(max-width: 578px)').matches ?
                            calendarLocal.weekDaysAbbr.map((day) => { return (<Subtitle1 key={day} className={styles.headerItem}>{day}</Subtitle1>); })
                            : calendarLocal.weekDays.map((day) => { return (<Subtitle1 key={day} className={styles.headerItem}>{day}</Subtitle1>); })}
                    </Card>

                    {/* {events ? ( */}
                    <div className={styles.calendarContainer}>
                        <div className={styles.calendar}>{renderCalendar()}</div>
                    </div>
                    {/* ) : <Spinner size="huge" />} */}
                </div>

                <Drawer type={window.matchMedia('(max-width: 1000px)').matches ? "overlay" : "inline"} open={isDrawerOpen} onOpenChange={(_, { open }) => setIsDrawerOpen(open)} position="end" className={styles.drawer}>
                    <DrawerHeader>
                        <DrawerHeaderTitle
                            action={
                                <Button
                                    appearance="subtle"
                                    aria-label="Close"
                                    icon={<DismissRegular />}
                                    onClick={() => setIsDrawerOpen(false)}
                                />
                            }
                        > Imposta visualizzazione
                        </DrawerHeaderTitle>
                    </DrawerHeader>

                    <DrawerBody>
                        <CalendarSelector onSelectionChange={onCalendarSelectionChange} />
                    </DrawerBody>
                </Drawer>
            </div>
        </div >
    );
}
