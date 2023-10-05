import { useContext, useEffect, useState } from "react";
import { apiUrl } from "../config";
import axios from "axios";
import { TokenContext } from "../context/TokenContext";
import { ClassroomStatus } from "../dto/ClassroomStatus";
import { EventDto } from "../dto/EventDto";
import { useGlobalStyles } from "../globalStyles";
import { Body1, Body2, Button, Card, CardHeader, Dialog, DialogActions, DialogBody, DialogContent, DialogSurface, DialogTitle, DialogTrigger, Input, Spinner, Subtitle2, Title2, Title3, makeStyles, mergeClasses, tokens, webLightTheme } from "@fluentui/react-components";
import { ThemeContext } from "../context/ThemeContext";

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

export function Classroom() {
    const { theme } = useContext(ThemeContext);

    const styles = theme === webLightTheme ? useLightStyles() : useDarkStyles();
    const globalStyles = useGlobalStyles();
    const { tokenData } = useContext(TokenContext);

    const [now] = useState(new Date());
    const [dateTime, setDateTime] = useState(new Date());
    const [classrooms, setClassrooms] = useState<ClassroomStatus[] | null>(null);
    const [events, setEvents] = useState<EventDto[] | null>(null);

    useEffect(() => {
        setClassrooms(null);
        axios.get(new URL(`classroom/status`, apiUrl).toString(), {
            headers: { Authorization: "Bearer " + tokenData.token },
            params: { time: dateTime.toISOString(), }
        }).then(response => {
            let result: ClassroomStatus[] = response.data;

            const exclude = [5, 19, 20, 21, 22, 23, 24, 25, 26, 32, 33];
            result = result.filter((item) => !exclude.includes(item.classroom.id));

            result = result.map((item) => {
                item.status.statusChangeAt = item.status.statusChangeAt ? new Date(item.status.statusChangeAt) : null;
                return item;
            });

            setClassrooms(result);
        }).catch(() => {
        });
    }, [dateTime]);

    const renderClassrooms = () => {
        return classrooms?.map((item) => {
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
                <Card key={event.id} className={mergeClasses(globalStyles.card, event.start <= dateTime && event.end > dateTime ? globalStyles.ongoing : undefined)}>
                    <CardHeader
                        header={<Subtitle2>💼 {event.subject}</Subtitle2>}
                        description={event.start <= now && event.end > now ? <Body2 className={globalStyles.blink}>🔴 <strong>In corso</strong></Body2> : ""}
                    />
                    <div>
                        <Body1>⌚ {event.start.toLocaleTimeString([], { timeStyle: "short" })} - {event.end.toLocaleTimeString([], { timeStyle: "short" })}</Body1>
                        <br />
                        <Body1>📚 {event.course.code} - {event.course.name}</Body1>
                        <br />
                        {event.teacher ? <Body1>🧑‍🏫 {event.teacher}</Body1> : ""}
                    </div>
                </Card>
            )) : (<Subtitle2>Nessuna</Subtitle2>);

            const status = item.status.isFree ? (<>🟢 <strong>Libera</strong></>) : <>🔴 <strong>Occupata</strong></>;
            let changeTime = "";

            if (!item.status.statusChangeAt)
                changeTime = "⌚ Nessun evento programmato.";
            else if (item.status.statusChangeAt.getDate() == dateTime.getDate())
                changeTime = "⌚ Fino alle " + item.status.statusChangeAt.toLocaleTimeString([], { timeStyle: "short" });
            else
                changeTime = "⌚ " + item.status.statusChangeAt.toLocaleString([], { dateStyle: "medium", timeStyle: "short" });

            return (
                <Dialog key={item.classroom.id} modalType="modal" onOpenChange={(_event, data) => { getEvents(data.open); }}>
                    <DialogTrigger>
                        <Card className={mergeClasses(globalStyles.card, item.status.isFree ? styles.cardFree : styles.cardBusy)}>
                            <CardHeader header={<Subtitle2>🏫 {item.classroom.name}</Subtitle2>} />
                            <div>
                                <Body1>{status}</Body1>
                                <br />
                                <Body1>{changeTime}</Body1>
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

    return (
        <div className={globalStyles.container}>
            <Card className={globalStyles.titleBar}>
                <CardHeader
                    header={<Title2>🏫 Stato Aule</Title2>}
                    description={<Subtitle2>📅 {dateTime.toLocaleString([], { dateStyle: "medium", timeStyle: "short" })}</Subtitle2>}
                />
                <div>
                    <Input type="datetime-local" defaultValue={dateTime.toLocaleString()} min="2018-10-01T00:00" onChange={(e) => setDateTime(new Date(e.target.value))} />
                </div>
            </Card>

            <div className={globalStyles.grid}>
                {classrooms ? renderClassrooms() : <Spinner size="huge" />}
            </div>
        </div>
    );
}
