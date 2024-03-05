import { Body1, Card, CardHeader, Popover, PopoverSurface, PopoverTrigger, Skeleton, SkeletonItem, Spinner, Subtitle2, Title2, makeStyles } from "@fluentui/react-components";
import { useContext, useEffect, useState } from "react";
import { DateSelector } from "../components/DateSelector";
import EventDetails, { EventDetailsSkeleton } from "../components/EventDetails";
import { TimekeeperContext } from "../context/TimekeeperContext";
import { UserContext } from "../context/UserContext";
import { ClassroomStatus } from "../dto/ClassroomStatus";
import { EventDto } from "../dto/EventDto";
import { useGlobalStyles } from "../globalStyles";
import useRequests from "../libraries/requests/requests";

const useStyles = makeStyles({
    skeletonRoot: {
        display: "flex",
        flexDirection: "column",
        rowGap: "0.5rem"
    },
    skeletonBody: {
        display: "flex",
        flexDirection: "column",
        rowGap: "0.2rem"
    }
})

export function Home() {
    const globalStyles = useGlobalStyles();
    const styles = useStyles();

    const requests = useRequests();
    const { data } = useContext(UserContext);
    const course = data?.course || { id: 0, code: "", name: "", startYear: 0, endYear: 0 };

    const [now, setNow] = useState(() => new Date());
    const [dateTime, setDateTime] = useState(() => new Date());
    const [showEventsSideSpinner, setShowEventsSideSpinner] = useState(false);
    const [events, setEvents] = useState<EventDto[] | null>(null);
    const [classrooms, setClassrooms] = useState<ClassroomStatus[] | null>(null);
    const [showClassroomsSideSpinner, setShowClassroomsSideSpinner] = useState(false);

    const { timekeeper } = useContext(TimekeeperContext);
    useEffect(() => {
        const updateTime = () => setNow(new Date());
        timekeeper.addListener("minute", updateTime);
        return () => timekeeper.removeListener(updateTime);
    }, []);

    useEffect(() => {
        const start = new Date(dateTime); // Now
        const end = new Date(start); // Tomorrow at 00:00
        end.setDate(end.getDate() + 1);
        end.setHours(0, 0, 0, 0);

        // Clear current data and show spinner only if the side spinner is not already visible
        if (!showEventsSideSpinner)
            setEvents(null);

        requests.event.byCourse(start, end, course?.id || 0, true)
            .then(setEvents)
            .then(() => setShowEventsSideSpinner(false));
    }, [dateTime]);

    useEffect(() => {
        // Show side spinner spinner only if the main spinner is not already visible (classrooms == null)
        if (classrooms !== null)
            setShowClassroomsSideSpinner(true);

        requests.classroom.status(now)
            .then(setClassrooms)
            .then(() => setShowClassroomsSideSpinner(false));
    }, [now]);

    const renderEvents = () => {
        if (!events) {
            return (
                <>
                    <EventDetailsSkeleton as="card" hide={["course"]} />
                    <EventDetailsSkeleton as="card" hide={["course"]} />
                    <EventDetailsSkeleton as="card" hide={["course"]} />
                </>
            )
        } else if (events.length === 0) {
            return <Card className={globalStyles.card}><Subtitle2>😊 Nessuna lezione {dateTime.toDateString() !== now.toDateString() ? `${"programmata per il " + dateTime.toLocaleDateString([], { dateStyle: "medium" })}` : "rimasta per oggi"}</Subtitle2></Card>;
        } else {
            return events.map((event) => (
                <EventDetails as="card" key={event.id} event={event} title="subject" hide={["course"]} />
            ));
        }
    }

    const classroomSkeleton = (
        <Card className={globalStyles.card}>
            <Skeleton>
                <div className={styles.skeletonRoot}>
                    <SkeletonItem size={24} />
                    <div className={styles.skeletonBody}>
                        <SkeletonItem size={16} />
                    </div>
                </div>
            </Skeleton>
        </Card>
    );

    const renderClassrooms = () => {
        if (!classrooms) {
            const skeletonsElements = new Array(10).fill(classroomSkeleton);
            return (skeletonsElements);
        } else if (classrooms.length === 0) {
            return <Card className={globalStyles.card}><Subtitle2>😒 Nessuna aula libera al momento</Subtitle2></Card>;
        } else {
            return classrooms.filter(item => item.status.isFree).map((item) => {
                let changeTime = "";
                if (!item.status.statusChangeAt || item.status.statusChangeAt.getDate() != now.getDate())
                    changeTime = "Fino a domani";
                else
                    changeTime = "Fino alle " + item.status.statusChangeAt.toLocaleTimeString([], { timeStyle: "short" });

                return (
                    <Popover key={item.classroom.id}>
                        <PopoverTrigger>
                            <Card className={globalStyles.card}>
                                <CardHeader header={<Subtitle2>🏫 Aula {item.classroom.name}</Subtitle2>} />
                                <Body1>{changeTime}</Body1>
                            </Card>
                        </PopoverTrigger>
                        <PopoverSurface>
                            {item.status.currentOrNextEvent ? <EventDetails event={item.status.currentOrNextEvent} title="custom" customTitle="Prossima lezione" linkToCalendar={true} hide={["classroom"]} /> : <Subtitle2>Nessuna lezione</Subtitle2>}
                        </PopoverSurface>
                    </Popover>
                );
            });
        }
    }

    return (
        <>
            <div className={globalStyles.container}>
                <Card className={globalStyles.titleBar}>
                    <CardHeader
                        header={<Title2>📚 {course?.code} - Lezioni</Title2>}
                        description={<><Subtitle2>{course?.name}</Subtitle2></>}
                        action={showEventsSideSpinner ? <Spinner size="small" /> : undefined}
                    />
                    <DateSelector autoUpdate={true} inputType="day" dateTime={dateTime} setDateTime={(newDateTime, autoUpdated) => {
                        setShowEventsSideSpinner(autoUpdated);
                        setDateTime(newDateTime);
                    }} />
                </Card>
                <div className={globalStyles.grid}>
                    {renderEvents()}
                </div>
            </div>

            <div className={globalStyles.container}>
                <Card className={globalStyles.titleBar}>
                    <CardHeader
                        header={<Title2>🏫 Aule Libere</Title2>}
                        description={<Subtitle2>Alle {now.toLocaleTimeString([], { timeStyle: "short" })}</Subtitle2>}
                        action={showClassroomsSideSpinner ? <Spinner size="small" /> : undefined}
                    />
                </Card>
                <div className={globalStyles.grid}>
                    {renderClassrooms()}
                </div>
            </div>
        </>
    );
}
