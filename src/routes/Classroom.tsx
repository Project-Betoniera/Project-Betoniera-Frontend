import { Body1, Button, Card, CardFooter, CardHeader, Dialog, DialogActions, DialogBody, DialogContent, DialogSurface, DialogTitle, DialogTrigger, Select, SelectOnChangeData, Skeleton, SkeletonItem, Spinner, Subtitle2, Title2, Title3, makeStyles, mergeClasses, tokens, webLightTheme } from "@fluentui/react-components";
import { ChangeEvent, useContext, useEffect, useState } from "react";
import { DateSelector } from "../components/DateSelector";
import EventDetails, { EventDetailsSkeleton } from "../components/EventDetails";
import { ThemeContext } from "../context/ThemeContext";
import { ClassroomDto } from "../dto/ClassroomDto";
import { ClassroomStatus } from "../dto/ClassroomStatus";
import { EventDto } from "../dto/EventDto";
import { useGlobalStyles } from "../globalStyles";
import { FullScreenMaximizeFilled } from "@fluentui/react-icons";
import getClockEmoji from "../libraries/clockEmoji/clockEmoji";
import useRequests from "../libraries/requests/requests";
import { RouterButton } from "../components/router/RouterButton";

const useLightStyles = makeStyles({
    cardFree: {
        backgroundColor: tokens.colorPaletteLightGreenBackground2,
        ":hover": { backgroundColor: tokens.colorPaletteLightGreenBackground1 },
        ":active": { backgroundColor: tokens.colorPaletteGreenBackground2 },
    },
    cardBusy: {
        backgroundColor: tokens.colorPaletteRedBackground2,
        ":hover": { backgroundColor: tokens.colorPaletteRedBackground1 },
        ":active": { backgroundColor: tokens.colorPaletteDarkRedBackground2 },
    }
});

const useDarkStyles = makeStyles({
    cardFree: {
        backgroundColor: tokens.colorPaletteLightGreenBackground2,
        ":hover": { backgroundColor: tokens.colorPaletteLightGreenBackground3 },
        ":active": { backgroundColor: tokens.colorPaletteLightGreenBackground1 },
    },
    cardBusy: {
        backgroundColor: tokens.colorPaletteRedBackground2,
        ":hover": { backgroundColor: tokens.colorPaletteRedBackground3 },
        ":active": { backgroundColor: tokens.colorPaletteRedBackground1 },
    }
});

const useStyles = makeStyles({
    toolbar: {
        justifyContent: "space-between",
        "@media screen and (max-width: 620px)": {
            justifyContent: "stretch",
            flexDirection: "column-reverse",
        }
    },
    filter: {
        alignSelf: "flex-start",

        "@media screen and (max-width: 578px)": {
            alignSelf: "stretch",
        }
    },
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
});

export function Classroom() {
    const theme = useContext(ThemeContext).themeValue;

    const globalStyles = useGlobalStyles();
    const themeStyles = theme === webLightTheme ? useLightStyles() : useDarkStyles();
    const styles = useStyles();
    const requests = useRequests();

    const [dateTime, setDateTime] = useState(() => new Date());
    const [showSideSpinner, setShowSideSpinner] = useState(false);
    const [classrooms, setClassrooms] = useState<ClassroomStatus[] | null>(null);
    const [eventDialog, setEventDialog] = useState<{ classroom: ClassroomDto, events: EventDto[] | null, open: boolean; } | null>(null);
    const [filter, setFilter] = useState<"all" | "free" | "busy">("all");
    const [filteredClassrooms, setFilteredClassrooms] = useState<ClassroomStatus[]>([]);

    // Get new data when the date changes
    useEffect(() => {
        // Clear current data and show spinner only if the side spinner is not already visible
        if (!showSideSpinner)
            setClassrooms(null);

        requests.classroom.status(dateTime)
            .then(setClassrooms)
            .then(() => setShowSideSpinner(false));
    }, [dateTime]);

    // Filter the classrooms when the filter changes
    useEffect(() => {
        if (!classrooms) return;

        switch (filter) {
            case "all":
                setFilteredClassrooms(classrooms || []);
                break;
            case "free":
                setFilteredClassrooms(classrooms?.filter((item) => item.status.isFree) || []);
                break;
            case "busy":
                setFilteredClassrooms(classrooms?.filter((item) => !item.status.isFree) || []);
                break;
        }
    }, [filter, classrooms]);

    const renderEvents = () => {
        if (!eventDialog || !eventDialog.events) {
            return (
                <>
                    <EventDetailsSkeleton as="card" hide={["classroom"]}/>
                    <EventDetailsSkeleton as="card" hide={["classroom"]}/>
                </>
            )
        } else if (eventDialog.events.length === 0) {
            return <Subtitle2>Nessuna</Subtitle2>;
        } else {
            return eventDialog.events.map((event) => (
                <EventDetails as="card" linkToCalendar key={event.id} event={event} title="subject" hide={["classroom"]} />
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
                        <SkeletonItem size={16} />
                    </div>
                </div>
            </Skeleton>
        </Card>
    );

    const renderClassrooms = () => {
        if (!classrooms) {
            const skeletonsElements = new Array(15).fill(classroomSkeleton);
            return (skeletonsElements);
        } else if (filteredClassrooms.length === 0) {
            return <Card className={globalStyles.card}>🚫 Nessuna aula {filter === "free" ? "libera" : "occupata"}</Card>;
        } else {
            return filteredClassrooms.map((item) => {

                const status = item.status.isFree ? (<>🟢 <strong>Libera</strong></>) : <>🔴 <strong>Occupata</strong></>;
                let changeTime = "";

                if (!item.status.statusChangeAt)
                    changeTime = "Nessun evento programmato.";
                else if (item.status.statusChangeAt.getDate() == dateTime.getDate())
                    changeTime = "Fino alle " + item.status.statusChangeAt.toLocaleTimeString([], { timeStyle: "short" });
                else
                    changeTime = item.status.statusChangeAt.toLocaleString([], { dateStyle: "medium", timeStyle: "short" });

                return (
                    <Card key={item.classroom.id} className={mergeClasses(globalStyles.card, item.status.isFree ? themeStyles.cardFree : themeStyles.cardBusy)} onClick={() => {
                        setEventDialog({
                            classroom: item.classroom,
                            events: null,
                            open: true
                        });

                        const start = new Date(dateTime);
                        start.setHours(0, 0, 0, 0);
                        const end = new Date(start);
                        end.setDate(end.getDate() + 1);

                        requests.event.byClassroom(start, end, item.classroom.id)
                            .then(events => setEventDialog(eventDialog => {
                                if (!eventDialog) return null;
                                return {
                                    ...eventDialog,
                                    events,
                                };
                            }));
                    }}>
                        <CardHeader header={<Subtitle2>🏫 {item.classroom.name}</Subtitle2>} />
                        <div>
                            <Body1>{status}</Body1>
                            <br />
                            <Body1>{getClockEmoji(item.status.statusChangeAt)} {changeTime}</Body1>
                        </div>
                    </Card>
                );
            });
        }
    }

    function onFilterChange(_event: ChangeEvent<HTMLSelectElement>, data: SelectOnChangeData) {
        if (data.value !== "all" &&
            data.value !== "free" &&
            data.value !== "busy") return;

        setFilter(data.value);
    }

    return (
        <div className={globalStyles.container}>
            <Card className={globalStyles.titleBar}>
                <CardHeader
                    header={<Title2>🏫 Stato Aule</Title2>}
                    action={
                        <>
                            {showSideSpinner ? <Spinner size="small" /> : undefined}
                            {<RouterButton as="a" icon={<FullScreenMaximizeFilled />} href="/viewer" />}
                        </>
                    }
                />
                <CardFooter className={styles.toolbar}>
                    <DateSelector autoUpdate={true} inputType="hour" dateTime={dateTime} setDateTime={(newDateTime, autoUpdated) => {
                        setShowSideSpinner(autoUpdated);
                        setDateTime(newDateTime);
                    }} />
                    <Select className={styles.filter} onChange={(onFilterChange)} >
                        <option value="all">Tutte</option>
                        <option value="free">Libere</option>
                        <option value="busy">Occupate</option>
                    </Select>
                </CardFooter>
            </Card>

            <div className={globalStyles.grid}>
                {renderClassrooms()}
            </div>

            {eventDialog && (
                <Dialog modalType="modal" open={eventDialog.open} onOpenChange={(_, data) => setEventDialog(eventDialog => {
                    if (!eventDialog) return null;
                    return {
                        ...eventDialog,
                        open: data.open,
                    };
                })}>
                    <DialogSurface>
                        <DialogBody>
                            <DialogTitle>
                                <Title3>Lezioni in Aula {eventDialog.classroom.name}</Title3>
                                <br />
                                <Subtitle2>📅 {dateTime.toLocaleDateString([], { dateStyle: "medium" })}</Subtitle2>
                            </DialogTitle>
                            <DialogContent className={globalStyles.list}>
                                {renderEvents()}
                            </DialogContent>
                            <DialogActions>
                                <DialogTrigger>
                                    <Button appearance="primary">Chiudi</Button>
                                </DialogTrigger>
                            </DialogActions>
                        </DialogBody>
                    </DialogSurface>
                </Dialog>
            )}
        </div>
    );
}
