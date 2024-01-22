import { Button, Caption1, Caption2, Card, CardHeader, Dialog, DialogActions, DialogBody, DialogContent, DialogSurface, DialogTitle, DialogTrigger, Drawer, DrawerBody, DrawerHeader, DrawerHeaderTitle, Subtitle1, Subtitle2, Title3, Tree, TreeItem, TreeItemLayout, makeStyles, mergeClasses, shorthands, tokens } from "@fluentui/react-components";
import { ArrowExportRegular, CalendarMonthRegular, CalendarWeekNumbersRegular, DismissRegular, SettingsRegular, BackpackFilled, BuildingFilled, PersonFilled, DismissFilled, EyeFilled, EyeOffFilled } from "@fluentui/react-icons";
import { useContext, useEffect, useState } from "react";
import { DateSelector } from "../components/DateSelector";
import EventDetails from "../components/EventDetails";
import { CalendarSelection, CalendarSelector } from "../components/calendar/CalendarSelector";
import { RouterButton } from "../components/router/RouterButton";
import { CourseContext } from "../context/CourseContext";
import { EventDto } from "../dto/EventDto";
import { generateMonth, generateShortWeek, generateWeek } from "../libraries/calendarGenerator/calendarGenerator";
import useRequests from "../libraries/requests/requests";

const useStyles = makeStyles({
    drawerBody: {
        display: "flex",
        flexDirection: "column",
        rowGap: "0.5rem",
    },
    drawerContainer: {
        display: "flex",
        flexDirection: "row",
        flexGrow: 1,
        minHeight: 0,
        ...shorthands.gap("0.5rem"),
    },
    drawer: {
        ...shorthands.borderRadius(tokens.borderRadiusMedium),
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
            alignItems: "unset",
        },
    },
    toolbarButtons: {
        display: "flex",
        flexDirection: "row",
        columnGap: "0.5rem",
        justifyContent: "flex-end",
        "@media (max-width: 578px)": {
            justifyContent: "space-between",
        },
    },
    syncButton: {
        "@media screen and (max-width: 578px)": {
            flexGrow: 1,
        },
    },
    calendarHeader: {
        display: "grid",
        columnGap: "0.5rem",
        gridTemplateColumns: "repeat(7, 1fr)",
        ...shorthands.padding("0.5rem", "0"),
        "@media screen and (max-width: 578px)": {
            ...shorthands.margin("0.2rem"),
            columnGap: "0.2rem",
        },
    },
    headerItem: {
        textAlign: "center",
    },
    calendarContainer: {
        position: "relative",
        display: "flex",
        flexDirection: "row",
        flexGrow: "1",
        minHeight: "14rem",
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
        },
    },
    todayBadge: {
        backgroundColor: tokens.colorBrandBackground,
        ":hover": {
            backgroundColor: tokens.colorBrandBackgroundHover,
        },
        color: "white",
    },
    eventIndicator: {
        "@media (min-width: 351px)": {
            display: "none",
        },
    },
    verticalEventIndicator: {
        "@media (max-width: 350px), (min-height: 601px)": {
            display: "none",
        },
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
    // Truncate overflowing text with "..." and hide the overflow
    ellipsisText: {
        display: "block",
        overflowX: "hidden",
        whiteSpace: "nowrap",
        textOverflow: "ellipsis",
    },
    wide: {
        alignSelf: "stretch",
    },
    scroll: {
        overflowY: "scroll",
    },
    // Enable the event dialog to be as wide as it needs to be
    eventsDialog: {
        maxWidth: "fit-content",
    },
    dialogCalendarViewsContainer: {
        display: "grid",
        gridAutoFlow: "column",
        gridAutoColumns: "1fr",
        columnGap: "1rem",
        ...shorthands.margin("0.5rem"),
    },
    dialogCalendarView: {
        display: "flex",
        flexDirection: "column",
        rowGap: "1rem",
    },
    dialogEventList: {
        display: "grid",
        gridAutoRows: "1fr",
        rowGap: "0.5rem",
    },
});

type Calendar = {
    selection: CalendarSelection,
    events: EventDto[],
    color: string,
    enabled: boolean,
};

export function Calendar() {
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
    const [calendarTitle, setCalendarTitle] = useState<string>("");

    const calendarView = currentView ? generateMonth(dateTime).flat() : window.matchMedia('(max-width: 578px)').matches ? generateShortWeek(dateTime) : generateWeek(dateTime);
    //console.log(calendarView[0].toLocaleDateString([], {weekday:"short"}), calendarLocal.weekDaysAbbr[0]);

    // Current calendar selection (the one that will be added if the user clicks the "Add" button)
    const [currentSelection, setCurrentSelection] = useState<CalendarSelection>({
        id: course?.id.toString() || "",
        type: "course",
        shortName: course?.code || "",
        fullName: `${course?.code} - ${course?.name}` || "",
    });

    // Calendar selections for each type
    const [courseSelections, setCourseSelections] = useState<Calendar[]>([]);
    const [classroomSelections, setClassroomSelections] = useState<Calendar[]>([]);
    const [teacherSelections, setTeacherSelections] = useState<Calendar[]>([]);

    // Merged calendar selections
    const mergedSelections = [courseSelections, classroomSelections, teacherSelections].flat();

    /**
     * Called when the user selects a new calendar with the `CalendarSelector` component 
     * */
    function onCalendarSelectionChange(selection: CalendarSelection) {
        setCurrentSelection(selection);
    };

    /**
     * Returns a random color from the internal color palette
     * */
    function getRandomColor() {
        const colors = [
            tokens.colorPaletteRedBackground2,
            tokens.colorPaletteDarkOrangeBackground2,
            tokens.colorPaletteYellowBackground2,
            tokens.colorPaletteGreenBackground2,
            tokens.colorPaletteBlueBackground2,
            tokens.colorPalettePurpleBackground2,
            tokens.colorPaletteBerryBackground2,
            tokens.colorPaletteMarigoldBackground2,
        ];

        const choice = Math.floor(Math.random() * colors.length);

        return colors[choice]; // Generate a random color
    }

    /**
     * Returns the list of events for the in-view week/month of the calendar selection passed as parameter
     */
    async function getEvents(selection: CalendarSelection) {
        const startDate = calendarView[0];
        const endDate = calendarView[calendarView.length - 1];

        switch (selection.type) {
            case "course":
                return await requests.event.byCourse(startDate, endDate, parseInt(selection.id));
            case "classroom":
                return await requests.event.byClassroom(startDate, endDate, parseInt(selection.id));
            case "teacher":
                return await requests.event.byTeacher(startDate, endDate, selection.id);
            default:
                return [] as EventDto[];
        }
    };

    /**
     * Updates the calendar title based on the current calendar selections
     */
    function updateCalendarTitle() {
        if (mergedSelections.length == 1) {
            const calendar = mergedSelections[0];
            setCalendarTitle(`Calendario per ${calendar.selection.type === "classroom" ? calendar.selection.fullName : calendar.selection.shortName}`);
        } else {
            setCalendarTitle("Visualizzazione personalizzata");
        }
    }

    /** 
     * Add the current calendar selection to the list of selections
     * */
    async function onAddCalendarClick() {
        if (!currentSelection) return;

        const calendar: Calendar = {
            events: await getEvents(currentSelection),
            selection: currentSelection,
            color: parseInt(currentSelection.id) === course?.id ? tokens.colorBrandBackground2Hover : getRandomColor(),
            enabled: true
        };

        switch (currentSelection.type) {
            case "course":
                if (courseSelections.find(item => item.selection.id === currentSelection.id)) return;
                setCourseSelections([...courseSelections, calendar]);
                break;
            case "classroom":
                if (classroomSelections.find(item => item.selection.id === currentSelection.id)) return;
                setClassroomSelections([...classroomSelections, calendar]);
                break;
            case "teacher":
                if (teacherSelections.find(item => item.selection.id === currentSelection.id)) return;
                setTeacherSelections([...teacherSelections, calendar]);
                break;
        }
    };

    /**
     * Renders the various cards for each day of the month/week in the current calendar view.  
     * Each card contains a list that enables the user to preview the events for the day.  
     * Furthermore, each card is clickable and opens a dialog with the detailed list of events for the day.
     */
    function renderCurrentCalendarView() {
        /**
         * Renders a preview list of the events for a specified day.  
         * If more calendars are selected, the events are rendered in the order of the calendars.
         */
        function renderPreviewEvents(day: Date) {
            return mergedSelections
                // Filter out disabled calendars
                .filter(calendar => calendar.enabled)
                // Cycle through all enabled calendars
                .map((calendar) => {
                    return calendar.events
                        // Filter out events that are not in the current day
                        .filter(event => event.start.toLocaleDateString() === day.toLocaleDateString())
                        // Cycle through all events in the current calendar and the current day
                        .map((event) => {
                            // Return the preview event card
                            return (
                                <Card
                                    key={event.id}
                                    className={styles.event}
                                    style={{ backgroundColor: calendar.color }}
                                >
                                    <Caption1 className={currentView ? styles.ellipsisText : undefined}>{event.subject}</Caption1>

                                    {/* Week view style */}
                                    <div style={currentView ? { display: "none" } : undefined}>
                                        <Caption2>{event.start.toLocaleString([], { timeStyle: "short" })} - {event.end.toLocaleString([], { timeStyle: "short" })}</Caption2>
                                        <br />
                                        <Caption2>Aula {event.classroom.name}</Caption2>
                                    </div>
                                </Card>
                            );
                        });
                });
        };

        /**
         * Renders a detailed list of the events for a specified day.  
         * If more calendars are selected, the events are grouped horizontally by calendar.
         */
        function renderDetailedEvents(day: Date) {
            return (
                <div className={styles.dialogCalendarViewsContainer}>
                    {mergedSelections
                        // Filter out disabled calendars
                        .filter(calendar => calendar.enabled)
                        // Cycle through all enabled calendars
                        .map((calendar) => {
                            // Filter out events that are not in the current day
                            const events = calendar.events.filter(event => event.start.toLocaleDateString() === day.toLocaleDateString());

                            return (
                                <div className={styles.dialogCalendarView} key={calendar.selection.id}>
                                    <Subtitle2 className={styles.ellipsisText}>{calendar.selection.fullName}</Subtitle2>
                                    <div className={styles.dialogEventList}>
                                        {
                                            // Cycle through all events in the current calendar and the current day
                                            // and foreach event render the preview card
                                            events.length > 0 ? events.map((event) =>
                                                <EventDetails as="card" key={event.id} event={event} title="subject" backgroundColor={calendar.color} />) :
                                                <Subtitle2>Nessuna</Subtitle2>
                                        }
                                    </div>
                                </div>
                            );
                        })}
                </div>
            );
        }

        // Cycle through all days in the current calendar view
        return calendarView.map((day) => {
            // Return the clickable card with the day number and the preview of the events
            return (
                <Dialog key={day.getTime()} >
                    <DialogTrigger>
                        <Card key={day.getTime()} className={mergeClasses(styles.card, now.toLocaleDateString() === day.toLocaleDateString() && styles.todayBadge)}>
                            <CardHeader header={<Subtitle2>{day.toLocaleDateString([], { day: "numeric" })}</Subtitle2>} />
                            <div className={styles.eventContainer} style={window.matchMedia('(max-width: 578px)').matches && !currentView ? {overflowY: "auto"} : undefined}>
                                {/* TODO Show skeletons when loading events */}
                                {renderPreviewEvents(day)}
                            </div>
                        </Card>
                    </DialogTrigger>
                    <DialogSurface className={styles.eventsDialog}>
                        <DialogBody>
                            <DialogTitle>
                                <Title3>Lezioni {now.toLocaleDateString() === day.toLocaleDateString() ? "di oggi" : `del ${day.toLocaleDateString([], { day: "numeric", month: "long" })}`}</Title3>
                            </DialogTitle>
                            <DialogContent>
                                {renderDetailedEvents(day)}
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
    };

    /**
     * Returns the appropriate icon for the specified calendar type
     */
    function getCalendarIcon(type: string, calendar: Calendar) {
        switch (type) {
            case "course":
                return (<BackpackFilled color={calendar.color} />);
            case "classroom":
                return (<BuildingFilled color={calendar.color} />);
            case "teacher":
                return (<PersonFilled color={calendar.color} />);
            default:
                return undefined;
        }
    };

    // Load the user default calendar on first render (user course)
    useEffect(() => { onAddCalendarClick(); }, []);

    // Update calendar title when calendar selections change
    useEffect(updateCalendarTitle, [mergedSelections]);

    return (
        <div className={mergeClasses(styles.container, styles.sideMargin)}>
            <Card className={styles.toolbar}>
                <DateSelector autoUpdate={true} dateTime={dateTime} setDateTime={setDateTime} inputType={currentView ? "month" : window.matchMedia('(max-width: 578px)').matches ? "shortWeek" : "week"} />
                <Subtitle2>{calendarTitle}</Subtitle2>
                <div className={styles.toolbarButtons}>
                    <Button icon={currentView ? <CalendarWeekNumbersRegular /> : <CalendarMonthRegular />} onClick={() => setCurrentView(!currentView)}>{currentView ? "Settimana" : "Mese"}</Button>
                    <Button icon={<SettingsRegular />} onClick={() => setIsDrawerOpen(!isDrawerOpen)} />
                    <RouterButton className={styles.syncButton} as="a" icon={<ArrowExportRegular />} href="/calendar-sync">Integrazioni</RouterButton>
                </div>
            </Card>

            <div className={styles.drawerContainer}>
                <div className={styles.container}>
                    <Card className={styles.calendarHeader} style={!currentView && window.matchMedia('(max-width: 578px)').matches ? { gridTemplateColumns: "repeat(" + calendarView.length + ", 1fr)" } : undefined}>
                        {window.matchMedia('(max-width: 578px)').matches ?
                            currentView ?
                                calendarLocal.weekDaysAbbr.map((day) => (<Subtitle1 key={day} className={styles.headerItem}>{day}</Subtitle1>)) :
                                calendarView.map((day) => (<Subtitle1 key={day.getTime()} className={styles.headerItem}>{day.toLocaleDateString([], { weekday: "short" }).charAt(0).toUpperCase() + day.toLocaleDateString([], { weekday: "short" }).slice(1)}</Subtitle1>))
                            : calendarLocal.weekDays.map((day) => (<Subtitle1 key={day} className={styles.headerItem}>{day}</Subtitle1>))}
                    </Card>

                    <div className={styles.calendarContainer}>
                        <div className={styles.calendar} style={!currentView && window.matchMedia('(max-width: 578px)').matches ? { gridTemplateColumns: "repeat(" + calendarView.length + ", 1fr)" } : undefined}>{renderCurrentCalendarView()}</div>
                    </div>
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
                        <Button appearance="primary" onClick={onAddCalendarClick}>Aggiungi</Button>

                        <Tree className={mergeClasses(styles.wide, styles.scroll)} aria-label="main tree">
                            {courseSelections.length > 0 && <TreeItem itemType="branch">
                                <TreeItemLayout>Corsi</TreeItemLayout>
                                <Tree aria-label="course tree">
                                    {courseSelections.map(calendar =>
                                        <TreeItem itemType="leaf" key={calendar.selection.id}>
                                            <TreeItemLayout
                                                iconBefore={getCalendarIcon(calendar.selection.type, calendar)}
                                                aside={!calendar.enabled ? <EyeOffFilled /> : undefined}
                                                actions={<>
                                                    <Button
                                                        appearance="subtle"
                                                        aria-label="enable/disable calendar"
                                                        icon={calendar.enabled ? <EyeFilled /> : <EyeOffFilled />}
                                                        onClick={() => setCourseSelections(courseSelections.map((item) => {
                                                            if (item.selection.id === calendar.selection.id) {
                                                                item.enabled = !item.enabled;
                                                            }
                                                            return item;
                                                        }))} />
                                                    <Button
                                                        appearance="subtle"
                                                        aria-label="remove calendar"
                                                        icon={<DismissFilled />}
                                                        onClick={() => setCourseSelections(courseSelections.filter((item) => item.selection.id !== calendar.selection.id))} /></>}>
                                                {calendar.selection.shortName}
                                            </TreeItemLayout>
                                        </TreeItem>)}
                                </Tree>
                            </TreeItem>}
                            {classroomSelections.length > 0 && <TreeItem itemType="branch">
                                <TreeItemLayout>Aule</TreeItemLayout>
                                <Tree aria-label="classroom tree">
                                    {classroomSelections.map(calendar =>
                                        <TreeItem itemType="leaf" key={calendar.selection.id}>
                                            <TreeItemLayout
                                                iconBefore={getCalendarIcon(calendar.selection.type, calendar)}
                                                aside={!calendar.enabled ? <EyeOffFilled /> : undefined}
                                                actions={<>
                                                    <Button
                                                        appearance="subtle"
                                                        aria-label="enable/disable calendar"
                                                        icon={calendar.enabled ? <EyeFilled /> : <EyeOffFilled />}
                                                        onClick={() => setClassroomSelections(classroomSelections.map((item) => {
                                                            if (item.selection.id === calendar.selection.id) {
                                                                item.enabled = !item.enabled;
                                                            }
                                                            return item;
                                                        }))} />
                                                    <Button
                                                        appearance="subtle"
                                                        aria-label="remove calendar"
                                                        icon={<DismissFilled />}
                                                        onClick={() => setClassroomSelections(classroomSelections.filter((item) => item.selection.id !== calendar.selection.id))} /></>}>
                                                {calendar.selection.shortName}
                                            </TreeItemLayout>
                                        </TreeItem>)}
                                </Tree>
                            </TreeItem>}
                            {teacherSelections.length > 0 && <TreeItem itemType="branch">
                                <TreeItemLayout>Docenti</TreeItemLayout>
                                <Tree aria-label="teachers tree">
                                    {teacherSelections.map(calendar =>
                                        <TreeItem itemType="leaf" key={calendar.selection.id}>
                                            <TreeItemLayout
                                                iconBefore={getCalendarIcon(calendar.selection.type, calendar)}
                                                aside={!calendar.enabled ? <EyeOffFilled /> : undefined}
                                                actions={<>
                                                    <Button
                                                        appearance="subtle"
                                                        aria-label="enable/disable calendar"
                                                        icon={calendar.enabled ? <EyeFilled /> : <EyeOffFilled />}
                                                        onClick={() => setTeacherSelections(teacherSelections.map((item) => {
                                                            if (item.selection.id === calendar.selection.id) {
                                                                item.enabled = !item.enabled;
                                                            }
                                                            return item;
                                                        }))} />
                                                    <Button
                                                        appearance="subtle"
                                                        aria-label="remove calendar"
                                                        icon={<DismissFilled />}
                                                        onClick={() => setTeacherSelections(teacherSelections.filter((item) => item.selection.id !== calendar.selection.id))} /></>}>
                                                {calendar.selection.shortName}
                                            </TreeItemLayout>
                                        </TreeItem>)}
                                </Tree>
                            </TreeItem>}
                        </Tree>
                    </DrawerBody>
                </Drawer>
            </div>
        </div>
    );
}
