import { Body1, Button, Caption1, Card, CardHeader, DialogActions, Dialog, DialogBody, DialogContent, DialogSurface, DialogTitle, DialogTrigger, Subtitle1, Subtitle2, Title3, makeStyles, mergeClasses, shorthands, tokens, Body2 } from "@fluentui/react-components";
import CalendarJs from "calendar-js";
import { useContext, useEffect, useState } from "react";
import { DateSelector } from "../components/DateSelector";
import { EventDto } from "../dto/EventDto";
import axios from "axios";
import { TokenContext } from "../context/TokenContext";
import { CourseContext } from "../context/CourseContext";
import { apiUrl } from "../config";
import { ClockEmoji } from "react-clock-emoji";
import { useGlobalStyles } from "../globalStyles";
import { ArrowExportRegular } from "@fluentui/react-icons";
import { RouterButton } from "../components/RouterButton";

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

// type CalendarConfig = {
//     months: string[];
//     monthsAbbr: string[];
//     weekDays: string[];
//     weekDaysAbbr: string[];
// };

const useStyles = makeStyles({
    toolbar: {
        display: "flex",
        justifyContent: "space-between",
        ...shorthands.margin("0.7rem"),
    },
    calendarHeader: {
        ...shorthands.margin("0.5rem"),
        paddingLeft: "0",
        paddingRight: "0",
        columnGap: "1rem",
        display: "grid",
        gridTemplateColumns: "repeat(7, 1fr)",
    },
    headerItem: {
        textAlign: "center",
    },
    calendar: {
        display: "grid",
        gridTemplateColumns: "repeat(7, 1fr)",
        flexGrow: 1
    },
    card: {
        display: "flex",
        ...shorthands.margin("0.5rem"),
        ...shorthands.padding("0.5rem"),
        ...shorthands.gap("0.2rem"),
        overflowY: "auto",
        "@media screen and (max-width: 578px)": {
            ...shorthands.margin("0.2rem"),
            ...shorthands.padding("0.2rem"),
        }
    },
    todayBadge: {
        // ...shorthands.padding("0.1rem"),
        // ...shorthands.borderRadius("25%"),
        // ...shorthands.border("4px", "solid", tokens.colorBrandBackground),
        backgroundColor: tokens.colorBrandBackground,
        ":hover": {
            backgroundColor: tokens.colorBrandBackgroundHover
        }
    },
    eventContainer: {
        maxHeight: "4rem",
        display: "flex",
        flexDirection: "column",
        overflowY: "scroll",
        rowGap: "0.5rem",
        "@media screen and (max-width: 578px)": {
            rowGap: "0.2rem",
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

    const { tokenData } = useContext(TokenContext);
    const { course } = useContext(CourseContext);

    const [now] = useState(new Date());
    const [dateTime, setDateTime] = useState(new Date(now));
    const [events, setEvents] = useState<EventDto[] | null>(null);

    const result: DetailedCalendar = (CalendarJs() as any).detailed(dateTime.getFullYear(), dateTime.getMonth());

    useEffect(() => {
        const start = result.calendar.flat()[0].date;
        const end = result.calendar.flat()[result.calendar.flat().length - 1].date;
        end.setDate(end.getDate() + 1);
        end.setHours(0, 0, 0, 0);

        setEvents(null); // Show spinner
        axios.get(new URL(`event/${encodeURIComponent(course?.id as number)}`, apiUrl).toString(), {
            headers: { Authorization: "Bearer " + tokenData.token },
            params: {
                start: start.toISOString(),
                end: end.toISOString(),
                includeOngoing: true
            }
        }).then(response => {
            let result: EventDto[] = [];

            (response.data as any[]).forEach(element => {
                element.start = new Date(element.start);
                element.end = new Date(element.end);
                result.push(element as EventDto);
            });

            setEvents(result);
        }).catch(() => { });
    }, [dateTime]);

    const renderCalendar = () =>
        events && result.calendar.flat().map((day) => {
            const filteredEvents = events.filter((event) => event.start.toLocaleDateString() === day.date.toLocaleDateString());

            const renderPreviewEvents = (events: EventDto[]) => {
                return events.map((event) =>
                    event.start.toLocaleDateString() === day.date.toLocaleDateString() &&
                    <Card key={event.id} className={styles.event}>
                        <Caption1 className={styles.eventText}>{event.subject}</Caption1>
                    </Card>
                );
            };

            const renderDetailedEvents = (events: EventDto[]) => events && events.length > 0 ? events.map((event) => (
                <Card key={event.id} className={mergeClasses(globalStyles.card, event.start <= dateTime && event.end > dateTime ? globalStyles.ongoing : undefined)}>
                    <CardHeader
                        header={<Subtitle2>💼 {event.subject}</Subtitle2>}
                        description={event.start <= now && event.end > now ? <Body2 className={globalStyles.blink}>🔴 <strong>In corso</strong></Body2> : ""}
                    />
                    <div>
                        <Body1><ClockEmoji time={event.start} defaultTime={event.start} /> {event.start.toLocaleTimeString([], { timeStyle: "short" })} - {event.end.toLocaleTimeString([], { timeStyle: "short" })}</Body1>
                        <br />
                        <Body1>📚 {event.course.code} - {event.course.name}</Body1>
                        <br />
                        {event.teacher ? <Body1>🧑‍🏫 {event.teacher}</Body1> : ""}
                    </div>
                </Card>
            )) : (<Subtitle2>Nessuna</Subtitle2>);

            return (
                <Dialog key={day.date.getTime()}>
                    <DialogTrigger>
                        <Card key={day.date.getTime()} className={mergeClasses(styles.card, now.toLocaleDateString() === day.date.toLocaleDateString() ? styles.todayBadge : "")}>
                            <CardHeader header={<Subtitle2>{day.date.toLocaleDateString([], { day: "numeric" })}</Subtitle2>} />
                            <div className={styles.eventContainer}>
                                {renderPreviewEvents(filteredEvents)}
                            </div>
                        </Card>
                    </DialogTrigger>
                    <DialogSurface>
                        <DialogBody>
                            <DialogTitle>
                                <Title3>Lezioni {now.toLocaleDateString() === day.date.toLocaleDateString() ? "di oggi" : `del ${day.date.toLocaleDateString([], { dateStyle: "medium" })}`}</Title3>
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
        <>
            <div className={styles.toolbar}>
                <DateSelector
                    now={now}
                    dateTime={dateTime}
                    setDateTime={setDateTime}
                    inputType={"month"}
                />
                <RouterButton as="a" icon={<ArrowExportRegular />} href="/calendar-sync">Integrazioni</RouterButton>
            </div >

            <Card className={styles.calendarHeader}>
                {window.matchMedia('(max-width: 578px)').matches ? result.weekdaysAbbr.map((day) => {
                    return (
                        <Subtitle1 key={day} className={styles.headerItem}>{day}</Subtitle1>
                    );
                }) : result.weekdays.map((day) => {
                    return (
                        <Subtitle1 key={day} className={styles.headerItem}>{day}</Subtitle1>
                    );
                })}
            </Card>

            <div className={styles.calendar}>
                {renderCalendar()}
            </div>
        </>
    );
}
