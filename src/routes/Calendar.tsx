import { Button, Caption1, Card, CardHeader, DialogActions, Dialog, DialogBody, DialogContent, DialogSurface, DialogTitle, DialogTrigger, Subtitle1, Subtitle2, Title3, makeStyles, mergeClasses, shorthands, tokens, Spinner } from "@fluentui/react-components";
import CalendarJs from "calendar-js";
import { useContext, useEffect, useState } from "react";
import { DateSelector } from "../components/DateSelector";
import { EventDto } from "../dto/EventDto";
import { CourseContext } from "../context/CourseContext";
import { useGlobalStyles } from "../globalStyles";
import { ArrowExportRegular } from "@fluentui/react-icons";
import { RouterButton } from "../components/RouterButton";
import EventDetails from "../components/EventDetails";
import useRequests from "../libraries/requests/requests";

type DetailedCalendar = {
    year: string,
    yearAbbr: string,
    month: string,
    monthAbbr: string,
    weekdays: string[],
    weekdaysAbbr: string[],
    days: number,
    firstWeekday: number,
    lastWeekday: number,
    calendar: CalendarDay[][];
};

type CalendarDay = {
    date: Date,
    day: number,
    isInPrimaryMonth: boolean,
    isInLastWeekOfPrimaryMonth: boolean,
    index: { day: number, week: number; };
};

type CalendarConfig = {
    months: string[];
    monthsAbbr: string[];
    weekDays: string[];
    weekDaysAbbr: string[];
};

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
    syncButton: {
        alignSelf: "end",
        flexGrow: "0 !important",
        "@media screen and (max-width: 578px)": {
            alignSelf: "stretch",
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
        }
    },
    eventContainer: {
        display: "flex",
        minHeight: 0,
        flexShrink: 1,
        overflowY: "auto",
        flexDirection: "column",
        rowGap: "0.4rem",
        "@media screen and (max-width: 578px)": {
            rowGap: "0.2rem",
            overflowY: "hidden",
        }
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

    // TODO Use proper localization
    const calendarConfig: CalendarConfig = {
        months: ["Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio", "Giugno", "Luglio", "Agosto", "Settembre", "Ottobre", "Novembre", "Dicembre"],
        monthsAbbr: ["Gen", "Feb", "Mar", "Apr", "Mag", "Giu", "Lug", "Ago", "Set", "Ott", "Nov", "Dic"],
        weekDays: ["Domenica", "Lunedì", "Martedì", "Mercoledì", "Giovedì", "Venerdì", "Sabato"],
        weekDaysAbbr: ["Dom", "Lun", "Mar", "Mer", "Gio", "Ven", "Sab"]
    };

    const [now] = useState(new Date());
    const [dateTime, setDateTime] = useState(new Date(now));
    const [events, setEvents] = useState<EventDto[] | null>(null);
    const result: DetailedCalendar = (CalendarJs(calendarConfig) as any).detailed(dateTime.getFullYear(), dateTime.getMonth());

    useEffect(() => {
        const start = result.calendar.flat()[0].date;
        const end = result.calendar.flat()[result.calendar.flat().length - 1].date;
        end.setDate(end.getDate() + 1);
        end.setHours(0, 0, 0, 0);

        setEvents(null); // Show spinner

        requests.event.byCourse(start, end, course?.id || 0, true)
            .then(setEvents)
            .catch(console.error); // TODO Handle error
    }, [dateTime]);

    const renderCalendar = () =>
        events && result.calendar.flat().map((day) => {
            const filteredEvents = events.filter((event) => event.start.toLocaleDateString() === day.date.toLocaleDateString());

            const renderPreviewEvents = (events: EventDto[]) => {
                return events.map((event) => event.start.toLocaleDateString() === day.date.toLocaleDateString() &&
                    <Card key={event.id} className={styles.event}>
                        <Caption1 className={styles.eventText}>{event.subject}</Caption1>
                    </Card>
                );
            };

            const renderDetailedEvents = (events: EventDto[]) => events && events.length > 0 ? events.map((event) => (
                <Card key={event.id} className={mergeClasses(globalStyles.eventCard, (event.start <= dateTime && event.end > dateTime) && globalStyles.ongoing)}>
                    <EventDetails event={event} title="subject" now={now} />
                </Card>
            )) : (<Subtitle2>Nessuna</Subtitle2>);

            return (
                <Dialog key={day.date.getTime()}>
                    <DialogTrigger>
                        <Card key={day.date.getTime()} className={mergeClasses(styles.card, now.toLocaleDateString() === day.date.toLocaleDateString() && styles.todayBadge)}>
                            <CardHeader header={<Subtitle2>{day.date.toLocaleDateString([], { day: "numeric" })}</Subtitle2>} />
                            <div className={styles.eventContainer}>
                                {renderPreviewEvents(filteredEvents)}
                            </div>
                        </Card>
                    </DialogTrigger>
                    <DialogSurface>
                        <DialogBody>
                            <DialogTitle>
                                <Title3>Lezioni {now.toLocaleDateString() === day.date.toLocaleDateString() ? "di oggi" : `del ${day.date.toLocaleDateString([], { day: "numeric", month: "long" })}`}</Title3>
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
        <div className={styles.container}>
            <Card className={styles.toolbar}>
                <DateSelector now={now} dateTime={dateTime} setDateTime={setDateTime} inputType={"month"} />
                <RouterButton className={styles.syncButton} as="a" icon={<ArrowExportRegular />} href="/calendar-sync">Integrazioni</RouterButton>
            </Card>

            <Card className={styles.calendarHeader}>
                {window.matchMedia('(max-width: 578px)').matches ?
                    calendarConfig.weekDaysAbbr.map((day) => { return (<Subtitle1 key={day} className={styles.headerItem}>{day}</Subtitle1>); })
                    : calendarConfig.weekDays.map((day) => { return (<Subtitle1 key={day} className={styles.headerItem}>{day}</Subtitle1>); })}
            </Card>

            {events ? (
                <div className={styles.calendarContainer}>
                    <div className={styles.calendar}>{renderCalendar()}</div>
                </div>
            ) : <Spinner size="huge" />}
        </div>
    );
}
