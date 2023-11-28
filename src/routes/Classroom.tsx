import { ChangeEvent, useContext, useEffect, useState } from "react";
import { apiUrl } from "../config";
import axios from "axios";
import { TokenContext } from "../context/TokenContext";
import { ClassroomStatus } from "../dto/ClassroomStatus";
import { EventDto } from "../dto/EventDto";
import { useGlobalStyles } from "../globalStyles";
import { Body1, Button, Card, CardFooter, CardHeader, Dialog, DialogActions, DialogBody, DialogContent, DialogSurface, DialogTitle, DialogTrigger, Select, SelectOnChangeData, Spinner, Subtitle2, Title2, Title3, makeStyles, mergeClasses, tokens, webLightTheme } from "@fluentui/react-components";
import { ThemeContext } from "../context/ThemeContext";
import { DateSelector } from "../components/DateSelector";
import EventDetails from "../components/EventDetails";
import getClockEmoji from "../libraries/clockEmoji/clockEmoji";

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
    }
});

export function Classroom() {
    const { theme } = useContext(ThemeContext);

    const globalStyles = useGlobalStyles();
    const themeStyles = theme === webLightTheme ? useLightStyles() : useDarkStyles();
    const styles = useStyles();

    const { tokenData } = useContext(TokenContext);

    const [now] = useState(new Date());
    const [dateTime, setDateTime] = useState(new Date(now));
    const [classrooms, setClassrooms] = useState<ClassroomStatus[] | null>(null);
    const [events, setEvents] = useState<EventDto[] | null>(null);
    const [filter, setFilter] = useState<"all" | "free" | "busy">("all");
    const [filteredClassrooms, setFilteredClassrooms] = useState<ClassroomStatus[]>([]);

    // Get new data when the date changes
    useEffect(() => {
        setClassrooms(null);
        axios.get(new URL(`classroom/status`, apiUrl).toString(), {
            headers: { Authorization: "Bearer " + tokenData.token },
            params: { time: dateTime.toISOString(), }
        }).then(response => {
            let result: ClassroomStatus[] = response.data;

            const exclude = [5, 19, 26, 31, 33];
            result = result.filter((item) => !exclude.includes(item.classroom.id));

            result = result.map((item) => {
                item.status.statusChangeAt = item.status.statusChangeAt ? new Date(item.status.statusChangeAt) : null;
                return item;
            });

            setClassrooms(result);
        }).catch(() => {
        });

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

    const renderClassrooms = () => {
        return filteredClassrooms.length === 0 ? [
            <Card key={0} className={globalStyles.card}>🚫 Nessuna aula {filter === "free" ? "libera" : "occupata"}</Card>
        ] : filteredClassrooms.map((item) => {
            const getEvents = (isOpen: boolean) => {
                if (!isOpen) {
                    setEvents(null);
                    return;
                };

                const start = new Date(dateTime);
                start.setHours(0, 0, 0, 0);
                const end = new Date(start);
                end.setDate(end.getDate() + 1);

                axios.get(new URL(`event/classroom/${encodeURIComponent(item.classroom.id)}`, apiUrl).toString(), {
                    headers: { Authorization: "Bearer " + tokenData.token },
                    params: {
                        start: start.toISOString(),
                        end: end.toISOString()
                    }
                }).then(response => {
                    const result: EventDto[] = [];

                    // Convert strings to objects
                    (response.data as any[]).forEach(element => {
                        element.start = new Date(element.start);
                        element.end = new Date(element.end);
                        result.push(element as EventDto);
                    });

                    setEvents(result);
                }).catch(() => {
                });
            };

            const renderEvents = () => events && events.length > 0 ? events.map((event) => (
                <Card key={event.id} className={mergeClasses(globalStyles.eventCard, event.start <= dateTime && event.end > dateTime ? globalStyles.ongoing : undefined)}>
                    <EventDetails event={event} title="subject" hide={["classroom"]} now={now} />
                </Card>
            )) : (<Subtitle2>Nessuna</Subtitle2>);

            const status = item.status.isFree ? (<>🟢 <strong>Libera</strong></>) : <>🔴 <strong>Occupata</strong></>;
            let changeTime = "";

            if (!item.status.statusChangeAt)
                changeTime = "Nessun evento programmato.";
            else if (item.status.statusChangeAt.getDate() == dateTime.getDate())
                changeTime = "Fino alle " + item.status.statusChangeAt.toLocaleTimeString([], { timeStyle: "short" });
            else
                changeTime = item.status.statusChangeAt.toLocaleString([], { dateStyle: "medium", timeStyle: "short" });

            return (
                <Dialog key={item.classroom.id} modalType="modal" onOpenChange={(_event, data) => { getEvents(data.open); }}>
                    <DialogTrigger>
                        <Card className={mergeClasses(globalStyles.card, item.status.isFree ? themeStyles.cardFree : themeStyles.cardBusy)}>
                            <CardHeader header={<Subtitle2>🏫 {item.classroom.name}</Subtitle2>} />
                            <div>
                                <Body1>{status}</Body1>
                                <br />
                                <Body1>{getClockEmoji(item.status.statusChangeAt)} {changeTime}</Body1>
                            </div>
                        </Card>
                    </DialogTrigger>
                    <DialogSurface>
                        <DialogBody>
                            <DialogTitle>
                                <Title3>Lezioni in Aula {item.classroom.name}</Title3>
                                <br />
                                <Subtitle2>📅 {dateTime.toLocaleDateString([], { dateStyle: "medium" })}</Subtitle2>
                            </DialogTitle>
                            <DialogContent className={globalStyles.list}>
                                {events ? renderEvents() : <Spinner size="huge" />}
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
                />
                <CardFooter className={styles.toolbar}>
                    <DateSelector inputType="datetime-local" dateTime={dateTime} setDateTime={setDateTime} now={now} />
                    <Select className={styles.filter} placeholder="Filtro" onChange={(onFilterChange)} >
                        <option value="all">Tutte</option>
                        <option value="free">Libere</option>
                        <option value="busy">Occupate</option>
                    </Select>
                </CardFooter>
            </Card>

            <div className={globalStyles.grid}>
                {classrooms ? renderClassrooms() : <Spinner size="huge" />}
            </div>
        </div>
    );
}
