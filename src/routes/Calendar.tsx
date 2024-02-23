import { Badge, Button, Caption1, Caption2, Card, Dialog, DialogActions, DialogBody, DialogContent, DialogSurface, DialogTitle, DialogTrigger, Drawer, DrawerBody, DrawerHeader, DrawerHeaderTitle, Subtitle1, Subtitle2, Title3, Tooltip, Tree, TreeItem, TreeItemLayout, makeStyles, mergeClasses, shorthands, tokens } from "@fluentui/react-components";
import { ArrowExportRegular, BackpackFilled, BuildingFilled, CalendarMonthRegular, CalendarWeekNumbersRegular, DismissFilled, DismissRegular, EyeFilled, EyeOffFilled, PersonFilled, SettingsRegular, StarFilled, StarRegular } from "@fluentui/react-icons";
import { ReactNode, useContext, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { DateSelector } from "../components/DateSelector";
import EventDetails from "../components/EventDetails";
import { CalendarSelection, CalendarSelector, CalendarType, getCalendarSelections } from "../components/calendar/CalendarSelector";
import { RouterButton } from "../components/router/RouterButton";
import { UserContext } from "../context/UserContext";
import { EventDto } from "../dto/EventDto";
import { generateMonth, generateShortWeek, generateWeek } from "../libraries/calendarGenerator/calendarGenerator";
import { useMediaQuery } from "../libraries/mediaQuery/mediaQuery";
import useRequests from "../libraries/requests/requests";
import { useGlobalStyles } from "../globalStyles";

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
    mobileMargins: {
        marginTop: "2.5rem",
        marginBottom: "1rem",
        marginRight: "1rem",
        marginLeft: "1rem",
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
    stack: {
        display: "flex",
        flexDirection: "row",
        columnGap: "0.5rem",
        justifyContent: "flex-end",
        alignItems: "center",
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
        }
    },
    eventHeader: {
        display: "flex",
        flexDirection: "row",
        flexGrow: "0 !important",
        justifyContent: "space-between"
    },
    event: {
        flexShrink: 0,
        ...shorthands.padding("0.25rem"),
        ...shorthands.margin("0"),
        backgroundColor: tokens.colorBrandBackground2Hover,
    },
    wide: {
        alignSelf: "stretch",
    },
    scroll: {
        overflowY: "auto",
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

/**
 * Calendar type that contains the calendar selection and the color to use for the calendar and the display state
 */
type Calendar = {
    selection: CalendarSelection,
    color: number,
    enabled: boolean,
};

/**
 * Extended `EventDto` type that contains the color and the selection id of the calendar it belongs to
 */
type ExtendedEventDto = EventDto & {
    color: number;
    selectionId: string;
};

const COLORS = [
    // special: default course
    tokens.colorBrandBackground2Hover,

    tokens.colorPaletteRedBackground2,
    tokens.colorPaletteDarkOrangeBackground2,
    tokens.colorPaletteYellowBackground2,
    tokens.colorPaletteGreenBackground2,
    tokens.colorPalettePurpleBackground2,
    tokens.colorPaletteBerryBackground2,
    tokens.colorPaletteMarigoldBackground2,
];

// Colors that can be randomly selected.
// The first color is reserved for the default course
const RANDOMABLE_COLORS = [...Array(COLORS.length - 1).keys()].map(k => k + 1);

export function Calendar() {
    const styles = useStyles();
    const globalStyles = useGlobalStyles();

    const { data } = useContext(UserContext);
    const course = data?.course || { id: 0, code: "", name: "", startYear: 0, endYear: 0 };

    const screenMediaQuery = useMediaQuery("(max-width: 578px)");
    const requests = useRequests();
    const [isCurrentViewMonth, setIsCurrentViewMonth] = useState<boolean>(true);

    // TODO Use proper localization
    const calendarLocal = {
        months: ["Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio", "Giugno", "Luglio", "Agosto", "Settembre", "Ottobre", "Novembre", "Dicembre"],
        monthsAbbr: ["Gen", "Feb", "Mar", "Apr", "Mag", "Giu", "Lug", "Ago", "Set", "Ott", "Nov", "Dic"],
        weekDays: ["Lunedì", "Martedì", "Mercoledì", "Giovedì", "Venerdì", "Sabato", "Domenica"],
        weekDaysAbbr: ["Lun", "Mar", "Mer", "Gio", "Ven", "Sab", "Dom"]
    };

    const [searchParams, setSearchParams] = useSearchParams();

    const [now] = useState(new Date());
    const [dateTime, setDateTime] = useState(new Date(now));

    const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
    const [calendarTitle, setCalendarTitle] = useState<string>("");
    const [isDefault, setIsDefault] = useState<boolean>(false);

    const calendarView = isCurrentViewMonth ? generateMonth(dateTime).flat() : screenMediaQuery ? generateShortWeek(dateTime) : generateWeek(dateTime);

    // Current calendar selection (the one that will be added if the user clicks the "Add" button)
    const [currentSelection, setCurrentSelection] = useState<CalendarSelection>({
        id: course.id.toString(),
        type: "course",
        shortName: course.code,
        fullName: `${course.code} - ${course.name}`,
    });

    // Calendars on the view
    const [calendars, setCalendars] = useState<Calendar[]>([]);

    const [events, setEvents] = useState<ExtendedEventDto[]>([]);

    /**
     * Called when the user selects a new calendar with the `CalendarSelector` component 
     * */
    function onCalendarSelectionChange(selection: CalendarSelection) {
        setCurrentSelection(selection);
    };

    /**
     * Returns a random color among the colors that can be randomly selected
     * */
    function getRandomColor() {
        return RANDOMABLE_COLORS[Math.floor(Math.random() * (RANDOMABLE_COLORS.length))];
    }
    (window as any).getRandomColor = getRandomColor;

    /**
     * Converts a numerical color value to the real color value
     * */
    function getColorValue(color: number) {
        return COLORS[color];
    }

    /**
     * Returns the list of events for the in-view week/month for the specified calendar.  
     * The `from` and `to` parameters can be used to specify a custom range of dates to get events for.
     */
    async function getEvents(calendar: Calendar, from: Date = calendarView[0], to: Date = calendarView[calendarView.length - 1]) {
        let newEvents: EventDto[] = [];

        switch (calendar.selection.type) {
            case "course":
                newEvents = await requests.event.byCourse(from, to, parseInt(calendar.selection.id));
                break;
            case "classroom":
                newEvents = await requests.event.byClassroom(from, to, parseInt(calendar.selection.id));
                break;
            case "teacher":
                newEvents = await requests.event.byTeacher(from, to, calendar.selection.id);
                break;
        }

        // Return only the events that are NOT already in the events list
        return newEvents
            .filter((event) => events.find((item) =>
                item.id === event.id &&
                item.selectionId === calendar.selection.id
            ) === undefined)
            .map((event) => {
                const result: ExtendedEventDto = {
                    ...event,
                    color: calendar.color,
                    selectionId: calendar.selection.id,
                };

                return result;
            });
    };

    /**
     * Updates the calendar title based on the current calendar selections
     */
    function updateCalendarTitle() {
        if (calendars.length == 1) {
            const calendar = calendars[0];
            setCalendarTitle(`Calendario per ${calendar.selection.type === "classroom" ? calendar.selection.fullName : calendar.selection.shortName}`);
        } else if (calendars.length > 1) {
            setCalendarTitle("Visualizzazione personalizzata");
        } else {
            setCalendarTitle("Nessun calendario selezionato");
        }
    }

    /**
     * Updates search parameters based on current calendar selections
     */
    function updateSearchParameters() {
        const newSearchParams = new URLSearchParams();
        for (const selection of calendars) {
            newSearchParams.append(
                selection.selection.type,
                `${selection.selection.id}.c${selection.color}${selection.enabled ? "" : ".disabled"}`
            );
        }
        setSearchParams(newSearchParams, {
            replace: true,
        });
    }

    /**
     * Add one or more Calendar objects to the list of selections
     */
    function addCalendars(...calendars: Calendar[]) {
        setCalendars((oldValue) => {
            const newValue = [...oldValue];
            for (const calendar of calendars) {
                if (!newValue.find(item => item.selection.id === calendar.selection.id)) {
                    newValue.push(calendar);
                }
            }

            if (newValue.length === oldValue.length)
                return oldValue;
            else
                return newValue;
        });
    }

    /**
     * Creates a Calendar object from a CalendarSelection
     */
    function createCalendar(selection: CalendarSelection): Calendar {
        return {
            selection: selection,
            color: parseInt(selection.id) === course?.id ? 0 : getRandomColor(),
            enabled: true
        };
    }

    /** 
     * Add the current calendar selection to the list of selections
     * */
    async function onAddCalendarClick() {
        if (!currentSelection) return;

        const calendar = createCalendar(currentSelection);

        addCalendars(calendar);
    };

    /**
     * Add a calendar from a search parameter value.
     */
    async function createCalendarFromSearch(type: CalendarType, searchValue: string) {
        const selections = await getCalendarSelections(requests, type);
        const split = searchValue.split(".");
        if (split.length === 0) {
            throw new Error(`Invalid ${type} search value ${searchValue}`);
        }

        // Removes the first element so that others can be looked
        // through as options without having to manually ignore the
        // first element
        const id = split.shift();

        const selection = selections.find(s => s.id === id);

        if (selection === undefined) {
            throw new Error(`Invalid ${type} search value ${searchValue}: Could not find calendar with ID ${id}`);
        }

        let calendar = await createCalendar(selection);

        for (const parameter of split) {
            if (parameter === "disabled") {
                calendar.enabled = false;
            } else if (parameter.length > 0 && parameter[0] === "c") {
                const colorValue = parseInt(parameter.substring(1));
                if (colorValue >= 0 && colorValue < COLORS.length) {
                    calendar.color = colorValue;
                } else {
                    console.warn(`Invalid color value ${parameter} in ${type} search value ${searchValue}`);
                }
            } else {
                console.warn(`Unknown parameter ${parameter} in ${type} search value ${searchValue}`);
            }
        }

        return calendar;
    }

    /**
     * Add a calendar from an array of search parameter values while maintaining ordering.
     */
    async function createCalendarsFromSearch(type: CalendarType, searchValues: string[]): Promise<Calendar[]> {
        let calendars: Calendar[] = [];

        // This is a for loop to maintain ordering
        for (const searchValue of searchValues) {
            calendars.push(await createCalendarFromSearch(type, searchValue));
        }

        return calendars;
    }

    /**
     * Create Calendars from search parameters.
     */
    async function createCalendarsFromSearchParams(params: URLSearchParams): Promise<Calendar[]> {
        let newCalendars: Calendar[] = [];
        for (const type of ["course", "classroom", "teacher"]) {
            const searchValues = params.getAll(type);
            if (searchValues.length > 0) {
                newCalendars.push(...await createCalendarsFromSearch(type as CalendarType, searchValues));
            }
        }

        return newCalendars;
    }

    /**
     * Renders the badges for the specified calendars.
     */
    function renderBadges(day: Date, calendars: Calendar[], events: ExtendedEventDto[]) {

        const result: ReactNode[] = [];

        // On a mobile device render only one badge with the number of events for all calendars
        if (screenMediaQuery || calendars.length > 3) {
            // Add a badge with the number of events for all calendars
            result.push(
                <Badge
                    key="all"
                    appearance="filled"
                    size={screenMediaQuery ? "small" : "medium"}
                    color={now.toLocaleDateString() === day.toLocaleDateString() ? "subtle" : undefined}
                >
                    {events.length}
                </Badge>
            );

            return result;
        }

        // Foreach calendar render the detailed event list
        calendars.map((calendar) => {
            // Events of the current calendar for the current day, sorted by start time
            const filteredEvents = events.filter((event) => event.selectionId === calendar.selection.id);

            // Skip if there are no events for the current calendar
            if (filteredEvents.length === 0) return;

            // Add a badge with the number of events for the current calendar
            result.push(
                <Badge
                    key={calendar.selection.id}
                    appearance="filled"
                    style={{ marginRight: "0.2rem", backgroundColor: getColorValue(calendar.color) }}
                >
                    {filteredEvents.length}
                </Badge>
            );
        });

        return result;
    }

    /**
     * Renders the various cards for each day of the month/week in the current calendar view.  
     * Each card contains a list that enables the user to preview the events for the day.  
     * Furthermore, each card is clickable and opens a dialog with the detailed list of events for the day.
     */
    function renderCurrentCalendarView() {
        /**
         * Renders a preview list of the events passed as parameter.
         * @param events The events to render
         */
        function renderPreviewEvents(events: ExtendedEventDto[]) {
            // Render a preview card for each event in each calendar
            return events.map((event, index) => (
                <Card
                    key={index}
                    className={styles.event}
                    style={{ backgroundColor: getColorValue(event.color) }}
                >
                    <Caption1 className={isCurrentViewMonth ? globalStyles.ellipsisText : undefined}>{event.subject}</Caption1>

                    {/* Week view style */}
                    <div style={isCurrentViewMonth ? { display: "none" } : undefined}>
                        <Caption2>{event.start.toLocaleString([], { timeStyle: "short" })} - {event.end.toLocaleString([], { timeStyle: "short" })}</Caption2>
                        <br />
                        <Caption2>Aula {event.classroom.name}</Caption2>
                    </div>
                </Card>
            ));
        };

        /**
         * Renders a detailed list of the events for a specified day.  
         * If more calendars are selected, the events are grouped horizontally by calendar.
         */
        function renderDetailedEvents(calendars: Calendar[], events: ExtendedEventDto[]) {
            return (
                <div className={styles.dialogCalendarViewsContainer}>
                    {
                        // Foreach calendar render the detailed event list
                        calendars.map((calendar) => {
                            // Events of the current calendar for the current day, sorted by start time
                            const filteredEvents = events.filter((event) => event.selectionId === calendar.selection.id);

                            return (
                                <div className={styles.dialogCalendarView} key={calendar.selection.id}>
                                    <Subtitle2 className={globalStyles.ellipsisText}>{calendar.selection.fullName}</Subtitle2>
                                    <div className={styles.dialogEventList}>
                                        {
                                            // Foreach event in the current calendar render the detailed preview card
                                            filteredEvents.length > 0 ?
                                                filteredEvents.map((event, index) => <EventDetails as="card" key={index} event={event} title="subject" backgroundColor={getColorValue(calendar.color)} />)
                                                :
                                                <Subtitle2>Nessuna</Subtitle2>
                                        }
                                    </div>
                                </div>
                            );
                        })
                    }
                </div>
            );
        }

        // For each day in the current calendar view render 
        // a clickable card with the day number and a preview of the events
        return calendarView.map((day) => {
            // Events of the current day for the enabled calendars, sorted by start time
            const filteredEvents = events
                .filter(event =>
                    event.start.toLocaleDateString() === day.toLocaleDateString() &&
                    calendars.find(calendar => calendar.selection.id === event.selectionId)?.enabled)
                .sort((a, b) => a.start.getTime() - b.start.getTime());

            // Enabled calendars
            const filteredCalendars = calendars.filter(calendar => calendar.enabled);

            return (
                <Dialog key={day.getTime()} >
                    <DialogTrigger>
                        <Card key={day.getTime()} className={mergeClasses(styles.card, now.toLocaleDateString() === day.toLocaleDateString() && styles.todayBadge)}>
                            <div className={styles.eventHeader}>
                                <Subtitle2>{day.toLocaleDateString([], { day: "numeric" })}</Subtitle2>
                                {isCurrentViewMonth && filteredEvents.length > 0 ? <div>{renderBadges(day, filteredCalendars, filteredEvents)}</div> : undefined}
                            </div>
                            <div className={styles.eventContainer} style={screenMediaQuery && !isCurrentViewMonth ? { overflowY: "auto" } : undefined}>
                                {/* TODO Show skeletons when loading events */}
                                {renderPreviewEvents(filteredEvents)}
                            </div>
                        </Card>
                    </DialogTrigger>
                    <DialogSurface className={styles.eventsDialog}>
                        <DialogBody>
                            <DialogTitle>
                                <Title3>Lezioni {now.toLocaleDateString() === day.toLocaleDateString() ? "di oggi" : `del ${day.toLocaleDateString([], { day: "numeric", month: "long" })}`}</Title3>
                            </DialogTitle>
                            <DialogContent>
                                {renderDetailedEvents(filteredCalendars, filteredEvents)}
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
                return (<BackpackFilled color={getColorValue(calendar.color)} />);
            case "classroom":
                return (<BuildingFilled color={getColorValue(calendar.color)} />);
            case "teacher":
                return (<PersonFilled color={getColorValue(calendar.color)} />);
            default:
                return undefined;
        }
    };

    /**
     * Renders the tree view for the specified calendar type
     * @param type The type of tree to render
     */
    function renderTree(type: CalendarType) {

        /**
         * @returns The appropriate tree title for the specified calendar type
         */
        function getTreeTitle() {
            switch (type) {
                case "course":
                    return "Corsi";
                case "classroom":
                    return "Aule";
                case "teacher":
                    return "Docenti";
            }
        }

        // Filter out calendars that are not of the specified type
        const filtered = calendars.filter((calendar) => calendar.selection.type === type);

        return filtered.length > 0 && <TreeItem itemType="branch">
            <TreeItemLayout>{getTreeTitle()}</TreeItemLayout>
            <Tree aria-label={`${type} tree`}>
                {filtered.map(calendar => {
                    /**
                     * Called when the user clicks the eye button on a calendar
                     */
                    function onEnableDisableButtonClick() {
                        setCalendars((oldValue) => oldValue.map((item) => {
                            if (item.selection.id === calendar.selection.id) item.enabled = !item.enabled;
                            return item;
                        }));
                    };

                    function onRemoveCalendarClick() {
                        setCalendars((oldValue) => oldValue.filter((item) => item.selection.id !== calendar.selection.id));
                        setEvents((oldValue) => oldValue.filter((item) => item.selectionId !== calendar.selection.id));
                    }

                    return (
                        <TreeItem itemType="leaf" key={calendar.selection.id}>
                            <TreeItemLayout
                                iconBefore={getCalendarIcon(calendar.selection.type, calendar)}
                                aside={!calendar.enabled ? <EyeOffFilled fontSize={20} /> : undefined}
                                actions={<>
                                    <Button
                                        appearance="subtle"
                                        aria-label="enable/disable calendar"
                                        icon={calendar.enabled ? <EyeFilled /> : <EyeOffFilled />}
                                        onClick={onEnableDisableButtonClick}
                                    />
                                    <Button
                                        appearance="subtle"
                                        aria-label="remove calendar"
                                        icon={<DismissFilled />}
                                        onClick={onRemoveCalendarClick}
                                    />
                                </>}>
                                {calendar.selection.shortName}
                            </TreeItemLayout>
                        </TreeItem>
                    );
                })}
            </Tree>
        </TreeItem>;
    }

    // First render: read calendars from search parameters or load the user default calendar
    async function loadCalendars() {
        const newCalendars = await createCalendarsFromSearchParams(searchParams);

        if (newCalendars.length > 0) {
            addCalendars(...newCalendars);
        } else {
            // No calendars from parameters: try to load the default calendars from local storage
            try {
                const defaults = window.localStorage.getItem("defaultCalendar");
                if (defaults !== null) {
                    const parsed = new URLSearchParams(defaults);
                    addCalendars(...await createCalendarsFromSearchParams(parsed));
                    return;
                }
            } catch (err) {
                console.warn("Failed to load default calendars from local storage", err);
            }

            // No calendars from local storage: add the default course
            onAddCalendarClick();
        }
    }


    useEffect(() => {
        loadCalendars();
    }, []);

    // Update calendar title and search parameters when calendar selections change
    useEffect(() => {
        updateCalendarTitle();
        updateSearchParameters();
    }, [calendars]);

    // Update default view state when search parameters change,
    // and save current view as default if no default is set and the current search parameters are not empty
    useEffect(() => {
        const currentDefault = window.localStorage.getItem("defaultCalendar");
        if (currentDefault) {
            setIsDefault(searchParams.toString() === currentDefault);
        } else if (searchParams.size !== 0) {
            window.localStorage.setItem("defaultCalendar", searchParams.toString());
            setIsDefault(true);
        }
    }, [searchParams]);

    // Load events for the current calendar view
    useEffect(() => {
        calendars.forEach(async (calendar) => {
            const newEvents = await getEvents(calendar);
            setEvents((oldValue) => [...oldValue, ...newEvents]);
        });
    }, [dateTime, calendars]);

    return (
        <div className={screenMediaQuery ? mergeClasses(styles.container, styles.mobileMargins) : mergeClasses(styles.container, styles.sideMargin)}>
            <Card className={styles.toolbar}>
                <DateSelector autoUpdate={true} dateTime={dateTime} setDateTime={setDateTime} inputType={isCurrentViewMonth ? "month" : screenMediaQuery ? "shortWeek" : "week"} />
                <div className={styles.stack}>
                    <Subtitle2>{calendarTitle}</Subtitle2>
                    <Tooltip
                        content={isDefault ? "Questa è la visualizzazione predefinita" : "Imposta come visualizzazione predefinita"}
                        relationship="description"
                    >
                        <Button
                            icon={isDefault ? <StarFilled /> : <StarRegular />}
                            disabled={isDefault}
                            onClick={() => {
                                if (!isDefault) {
                                    window.localStorage.setItem("defaultCalendar", searchParams.toString());
                                    setIsDefault(true);
                                }
                            }}
                        />
                    </Tooltip>
                </div>
                <div className={styles.stack}>
                    <Button icon={isCurrentViewMonth ? <CalendarWeekNumbersRegular /> : <CalendarMonthRegular />} onClick={() => setIsCurrentViewMonth(!isCurrentViewMonth)}>{isCurrentViewMonth ? "Settimana" : "Mese"}</Button>
                    <Button icon={<SettingsRegular />} onClick={() => setIsDrawerOpen(!isDrawerOpen)} />
                    <RouterButton className={styles.syncButton} as="a" icon={<ArrowExportRegular />} href="/calendar-sync" appearance="primary">Integrazioni</RouterButton>
                </div>
            </Card>

            <div className={styles.drawerContainer}>
                <div className={styles.container}>
                    <Card className={styles.calendarHeader} style={!isCurrentViewMonth && screenMediaQuery ? { gridTemplateColumns: "repeat(" + calendarView.length + ", 1fr)" } : undefined}>
                        {screenMediaQuery ?
                            isCurrentViewMonth ?
                                calendarLocal.weekDaysAbbr.map((day) => (<Subtitle1 key={day} className={styles.headerItem}>{day}</Subtitle1>)) :
                                calendarView.map((day) => (<Subtitle1 key={day.getTime()} className={styles.headerItem}>{day.toLocaleDateString([], { weekday: "short" }).charAt(0).toUpperCase() + day.toLocaleDateString([], { weekday: "short" }).slice(1)}</Subtitle1>))
                            : calendarLocal.weekDays.map((day) => (<Subtitle1 key={day} className={styles.headerItem}>{day}</Subtitle1>))}
                    </Card>

                    <div className={styles.calendarContainer}>
                        <div className={styles.calendar} style={!isCurrentViewMonth && screenMediaQuery ? { gridTemplateColumns: "repeat(" + calendarView.length + ", 1fr)" } : undefined}>{renderCurrentCalendarView()}</div>
                    </div>
                </div>

                <Drawer type={window.matchMedia("(max-width: 1000px)").matches ? "overlay" : "inline"} open={isDrawerOpen} onOpenChange={(_, { open }) => setIsDrawerOpen(open)} position="end" className={styles.drawer}>
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
                            {renderTree("course")}
                            {renderTree("classroom")}
                            {renderTree("teacher")}
                        </Tree>
                    </DrawerBody>
                </Drawer>
            </div>
        </div>
    );
}
