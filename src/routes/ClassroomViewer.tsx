import { Body2, Card, CardHeader, Divider, Spinner, Subtitle2, Title1, Title2, makeStyles } from "@fluentui/react-components";
import { useContext, useEffect, useState } from "react";
import { ClassroomStatus } from "../dto/ClassroomStatus";
import axios from "axios";
import { apiUrl } from "../config";
import { TokenContext } from "../context/TokenContext";
import { useGlobalStyles } from "../globalStyles";
import { EventDto } from "../dto/EventDto";
import MarqueeText from "react-marquee-text";
import { ClockEmoji } from "react-clock-emoji";

const useStyles = makeStyles({
    displayFlex: {
        display: "flex"
    },
    marqueeText: {
        marginLeft: "0.2rem",
    }
});

export function ClassroomViewer() {

    const globalStyles = useGlobalStyles();
    const styles = useStyles();

    const { tokenData } = useContext(TokenContext);

    const [now] = useState(new Date());
    const [classrooms, setClassrooms] = useState<ClassroomStatus[] | null>(null);
    const [currentFloor, setCurrentFloor] = useState(1);

    useEffect(() => {
        // First data fetch
        fetchClassroomsStatus();

        // Fetch classrooms status every 10 seconds
        const interval = setInterval(() => {
            setCurrentFloor((oldValue) => {
                if (oldValue === 3) fetchClassroomsStatus(); // Refresh when all data has been shown
                return oldValue === 3 ? 1 : oldValue + 1
            });
        }, 10000);

        return () => clearInterval(interval);
    }, []);

    const fetchClassroomsStatus = () => {
        console.log("Fetching classrooms status...");
        setClassrooms(null);
        axios.get(new URL(`classroom/status`, apiUrl).toString(), {
            headers: { Authorization: "Bearer " + tokenData.token },
            params: { time: now.toISOString() }
        }).then(response => {
            let result: ClassroomStatus[] = response.data;

            const exclude = [5, 19, 26, 31, 33];
            result = result.filter((item) => !exclude.includes(item.classroom.id));

            result = result.map((item) => {

                if (item.status.statusChangeAt) {

                    // Convert date string to date object for statusChangeAt
                    item.status.statusChangeAt = new Date(item.status.statusChangeAt);

                    if (item.status.currentOrNextEvent) {
                        // Convert date strings to date objects for currentOrNextEvent
                        item.status.currentOrNextEvent.start = new Date(item.status.currentOrNextEvent.start);
                        item.status.currentOrNextEvent.end = new Date(item.status.currentOrNextEvent.end);
                    } else { item.status.currentOrNextEvent = null; }

                } else { item.status.statusChangeAt = null; }

                return item;
            });

            setClassrooms(result);
        }).catch((error) => {
            console.log(error);
        });
    };

    useEffect(() => {
        // Hide header and footer
        document.getElementsByTagName("header")[0].style.display = "none";
        document.getElementsByTagName("footer")[0].style.display = "none";

        return () => {
            // Restore header and footer
            document.getElementsByTagName("header")[0].style.display = "block";
            document.getElementsByTagName("footer")[0].style.display = "block";
        };

    }, []);

    const renderFloor = (floor: number, classrooms: ClassroomStatus[]) => {

        const filtered = classrooms.filter((item) => item.classroom.name[0] === floor.toString());

        return (
            <>
                <Card className={globalStyles.card}>
                    <CardHeader
                        header={<Title1>🏢 {floor}° Piano</Title1>}
                    />
                </Card>
                <div className={globalStyles.grid}>
                    {renderClassrooms(filtered)}
                </div>
            </>
        );
    };

    const renderClassrooms = (filtered: ClassroomStatus[]) => {

        return filtered.map((item) => {
            return (
                <Card key={item.classroom.id} className={globalStyles.card}>
                    <CardHeader
                        header={<Title2>{item.classroom.name.split(" ")[0]}</Title2>}
                    />
                    <Divider>{item.status.currentOrNextEvent && item.status.currentOrNextEvent.start.getDate() === now.getDate() && item.status.currentOrNextEvent.start > now ? "Occupata tra " + new Date(item.status.currentOrNextEvent.start.getTime() - now.getTime()).toLocaleTimeString([], { hour: "numeric" }) + "h " + new Date(item.status.currentOrNextEvent.start.getTime() - now.getTime()).toLocaleTimeString([], { minute: "numeric" }) + "min" : !item.status.currentOrNextEvent || item.status.currentOrNextEvent.start.getDate() !== now.getDate() ? "Libera" : "Lezione in Corso"}</Divider>
                    {renderEvent(item.status.currentOrNextEvent)}
                </Card>
            );
        });

    };

    const renderEvent = (event: Omit<EventDto, "classroom"> | null) => {

        if (!event || event.start.getDate() !== now.getDate() || event.end < now) {
            return (
                <Title2>Nessuna Lezione</Title2>
            )
        }

        return (
            <div>
                <Title2>{event.course.code}</Title2>
                <br />
                <Subtitle2 className={styles.displayFlex}><MarqueeText pauseOnHover={false} duration={5} direction="right">{event.course.name}</MarqueeText></Subtitle2>
                <br />
                <Subtitle2 className={styles.displayFlex}>💼 <MarqueeText className={styles.marqueeText} pauseOnHover={false} duration={5} direction="right">{event.subject}</MarqueeText></Subtitle2>
                <Body2><ClockEmoji time={event.start} defaultTime={event.start}/> {event.start.toLocaleTimeString([], { timeStyle: "short" })} - {event.end.toLocaleTimeString([], { timeStyle: "short" })}</Body2>
                <br />
                {event.teacher ? <Body2>🧑‍🏫 {event.teacher}</Body2> : ""}
            </div>
        )

    };

    return (
        <div className={globalStyles.container}>
            {classrooms ? renderFloor(currentFloor, classrooms) : <Spinner label="Caricamento..." />}
        </div>
    )

}