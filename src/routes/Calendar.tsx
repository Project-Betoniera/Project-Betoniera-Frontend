import { Button, Caption1, Caption2, Card, CardHeader, Dialog, DialogActions, DialogBody, DialogContent, DialogSurface, DialogTitle, DialogTrigger, Drawer, DrawerBody, DrawerHeader, DrawerHeaderTitle, Spinner, Subtitle1, Subtitle2, Title3, Tree, TreeItem, TreeItemLayout, makeStyles, mergeClasses, shorthands, tokens } from "@fluentui/react-components";
import { ArrowExportRegular, CalendarMonthRegular, CalendarWeekNumbersRegular, CircleFilled, DismissRegular, SettingsRegular, BackpackFilled, BuildingFilled, PersonFilled, DismissFilled } from "@fluentui/react-icons";
import { useContext, useEffect, useState } from "react";
import { DateSelector } from "../components/DateSelector";
import EventDetails from "../components/EventDetails";
import { CalendarSelection, CalendarSelector } from "../components/calendar/CalendarSelector";
import { RouterButton } from "../components/router/RouterButton";
import { CourseContext } from "../context/CourseContext";
import { EventDto } from "../dto/EventDto";
import { useGlobalStyles } from "../globalStyles";
import { generateMonth, generateWeek } from "../libraries/calendarGenerator/calendarGenerator";
import useRequests from "../libraries/requests/requests";

const useStyles = makeStyles({
    drawerBody: {
        display: "flex",
        flexDirection: "column",
        rowGap: "0.5rem"
    },
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
    },
    wide: {
        alignSelf: "stretch",
    }
});

type Calendar = {
    selection: CalendarSelection,
    color: string,
    enabled: boolean,
};

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
    const [calendarTitle, setCalendarTitle] = useState<string>("");

    const calendarView = currentView ? generateMonth(dateTime).flat() : generateWeek(dateTime);

    //- Calendar Selection Logic -//

    // Current calendar selection (the one that will be added when the user clicks the "Aggiungi" button)
    const [currentCalendarSelection, setCurrentCalendarSelection] = useState<CalendarSelection>();

    // Calendar selections for each type
    const [courseCalendarSelections, setCourseCalendarSelections] = useState<Calendar[]>([]);
    const [classroomCalendarSelections, setClassroomCalendarSelections] = useState<Calendar[]>([]);
    const [teacherCalendarSelections, setTeacherCalendarSelections] = useState<Calendar[]>([]);

    // Called when the user selects a new calendar with the `CalendarSelector` component
    const onCalendarSelectionChange = (selection: CalendarSelection) => {
        setCurrentCalendarSelection(selection);
    };

    /**
     * TODO Make a table with some colors that make sense 
     * */
    const getRandomColor = () => {
        return `#${Math.floor(Math.random() * 16777215).toString(16)}`; // Generate a random color
    };

    // Add the current calendar selection to the list of selections
    const addCalendar = async () => {
        if (!currentCalendarSelection) return;

        const calendar: Calendar = {
            selection: currentCalendarSelection,
            color: getRandomColor(),
            enabled: true
        };

        switch (currentCalendarSelection.type) {
            case "course":
                if (courseCalendarSelections.find(item => item.selection.id === currentCalendarSelection.id)) return;
                setCourseCalendarSelections([...courseCalendarSelections, calendar]);
                break;
            case "classroom":
                if (classroomCalendarSelections.find(item => item.selection.id === currentCalendarSelection.id)) return;
                setClassroomCalendarSelections([...classroomCalendarSelections, calendar]);
                break;
            case "teacher":
                if (teacherCalendarSelections.find(item => item.selection.id === currentCalendarSelection.id)) return;
                setTeacherCalendarSelections([...teacherCalendarSelections, calendar]);
                break;
        }
    };

    const updateCalendar = async () => {
        const getEvents = async (calendars: Calendar[]) => {
            const requestedEvents: EventDto[] = [];

            for (let calendar of calendars) {
                let result: EventDto[];
                switch (calendar.selection.type) {
                    case "course":
                        result = await requests.event.byCourse(calendarView[0], calendarView[calendarView.length - 1], parseInt(calendar.selection.id));
                        requestedEvents.push(...result);
                        break;
                    case "classroom":
                        result = await requests.event.byClassroom(calendarView[0], calendarView[calendarView.length - 1], parseInt(calendar.selection.id));
                        requestedEvents.push(...result);
                        break;
                    case "teacher":
                        result = await requests.event.byTeacher(calendarView[0], calendarView[calendarView.length - 1], calendar.selection.id);
                        requestedEvents.push(...result);
                        break;
                }
            };

            return requestedEvents;
        };

        // Merge all selections
        const selections = [courseCalendarSelections, classroomCalendarSelections, teacherCalendarSelections].flat();

        // Update calendar title
        if (selections.length == 1) {
            setCalendarTitle("Calendario " + selections[0].selection.shortName);
        } else {
            setCalendarTitle("Calendario Filtrato");
        }

        setEvents(await getEvents(selections));
    };

    // Update calendar when selections change
    useEffect(() => {
        updateCalendar();
    }, [courseCalendarSelections, classroomCalendarSelections, teacherCalendarSelections]);

    // Load default calendar on first render
    // TODO Save custom view in local storage
    useEffect(() => {
        if (!course) return;
        setCourseCalendarSelections([{
            selection: {
                id: course.id.toString(),
                shortName: course.code,
                fullName: course.name,
                type: "course"
            },
            color: tokens.colorBrandBackground2Hover,
            enabled: true
        }]);
    }, []);

    // Get event color based on calendar selection it belongs to
    const getEventColor = (event: EventDto) => {

        // Merge all selections
        const selections = [courseCalendarSelections, classroomCalendarSelections, teacherCalendarSelections].flat();

        let color: string | undefined = undefined;
        for (let selection of selections) {
            switch (selection.selection.type) {
                case "course":
                    if (selection.selection.id === event.course.id.toString()) {
                        color = selection.color;
                    }
                    break;
                case "classroom":
                    if (selection.selection.id === event.classroom.id.toString()) {
                        color = selection.color;
                    }
                    break;
                case "teacher":
                    if (selection.selection.id === event.teacher) {
                        color = selection.color;
                    }
                    break;
            }
            if (color) break; // Stop searching if a color is found
        };

        return color;

    };

    const renderCalendar = () =>
        calendarView.map((day) => {
            const filteredEvents = events ? events.filter((event) => event.start.toLocaleDateString() === day.toLocaleDateString()) : [];

            const renderPreviewEvents = (events: EventDto[]) => {
                return events.map((event) => event.start.toLocaleDateString() === day.toLocaleDateString() &&
                    <Card key={event.id} className={styles.event} style={{ backgroundColor: getEventColor(event) }}>
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
                <EventDetails as="card" key={event.id} event={event} title="subject" />
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

    const getCalendarIcon = (type: string, calendar: Calendar) => {
        switch (type) {
            case "course":
                return (<BackpackFilled style={{ color: calendar.color }} />);
            case "classroom":
                return (<BuildingFilled style={{ color: calendar.color }} />);
            case "teacher":
                return (<PersonFilled style={{ color: calendar.color }} />);
            default:
                return undefined;
        }
    };

    return (
        <div className={mergeClasses(styles.container, styles.sideMargin)}>
            <Card className={styles.toolbar}>
                <DateSelector autoUpdate={true} dateTime={dateTime} setDateTime={setDateTime} inputType={currentView ? "month" : "week"} />
                <Subtitle2>{calendarTitle}</Subtitle2>
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
                            calendarLocal.weekDaysAbbr.map((day) => (<Subtitle1 key={day} className={styles.headerItem}>{day}</Subtitle1>))
                            : calendarLocal.weekDays.map((day) => (<Subtitle1 key={day} className={styles.headerItem}>{day}</Subtitle1>))}
                    </Card>

                    {events && typeof events !== null && events.length > 0 ? (
                        <div className={styles.calendarContainer}>
                            <div className={styles.calendar}>{renderCalendar()}</div>
                        </div>
                    ) : <Spinner size="huge" />}
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

                    <DrawerBody className={styles.drawerBody}>
                        <CalendarSelector onSelectionChange={onCalendarSelectionChange} />
                        <Button appearance="primary" onClick={addCalendar}>Aggiungi</Button>

                        <Tree className={styles.wide}>
                            {courseCalendarSelections.length > 0 && <TreeItem itemType="branch">
                                <TreeItemLayout>Corsi</TreeItemLayout>
                                <Tree>
                                    {courseCalendarSelections.map(calendar =>
                                        <TreeItem itemType="leaf" key={calendar.selection.id}>
                                            <TreeItemLayout
                                                iconBefore={getCalendarIcon(calendar.selection.type, calendar)}
                                                actions={<Button
                                                    appearance="subtle"
                                                    icon={<DismissFilled />}
                                                    onClick={() => setCourseCalendarSelections(courseCalendarSelections.filter((item) => item.selection.id !== calendar.selection.id))} />}>
                                                {calendar.selection.shortName}
                                            </TreeItemLayout>
                                        </TreeItem>)}
                                </Tree>
                            </TreeItem>}
                            {classroomCalendarSelections.length > 0 && <TreeItem itemType="branch">
                                <TreeItemLayout>Aule</TreeItemLayout>
                                <Tree>
                                    {classroomCalendarSelections.map(calendar =>
                                        <TreeItem itemType="leaf" key={calendar.selection.id}>
                                            <TreeItemLayout
                                                iconBefore={getCalendarIcon(calendar.selection.type, calendar)}
                                                actions={<Button
                                                    appearance="subtle"
                                                    icon={<DismissFilled />}
                                                    onClick={() => setClassroomCalendarSelections(classroomCalendarSelections.filter((item) => item.selection.id !== calendar.selection.id))} />}>
                                                {calendar.selection.shortName}
                                            </TreeItemLayout>
                                        </TreeItem>)}
                                </Tree>
                            </TreeItem>}
                            {teacherCalendarSelections.length > 0 && <TreeItem itemType="branch">
                                <TreeItemLayout>Docenti</TreeItemLayout>
                                <Tree>
                                    {teacherCalendarSelections.map(calendar =>
                                        <TreeItem itemType="leaf" key={calendar.selection.id}>
                                            <TreeItemLayout
                                                iconBefore={getCalendarIcon(calendar.selection.type, calendar)}
                                                actions={<Button
                                                    appearance="subtle"
                                                    icon={<DismissFilled />}
                                                    onClick={() => setTeacherCalendarSelections(teacherCalendarSelections.filter((item) => item.selection.id !== calendar.selection.id))} />}>
                                                {calendar.selection.shortName}
                                            </TreeItemLayout>
                                        </TreeItem>)}
                                </Tree>
                            </TreeItem>}
                        </Tree>
                    </DrawerBody>
                </Drawer>
            </div>
        </div >
    );
}
