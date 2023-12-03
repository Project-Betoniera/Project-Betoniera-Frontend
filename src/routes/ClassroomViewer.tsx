import { Card, CardHeader, Divider, Spinner, Subtitle2, Title1, Title2, makeStyles, mergeClasses, tokens, webLightTheme } from "@fluentui/react-components";
import { useContext, useEffect, useState } from "react";
import { ClassroomStatus } from "../dto/ClassroomStatus";
import axios from "axios";
import { apiUrl } from "../config";
import { TokenContext } from "../context/TokenContext";
import { useGlobalStyles } from "../globalStyles";
import { EventDto } from "../dto/EventDto";
import EventDetails from "../components/EventDetails";
import { ClassroomDto } from "../dto/ClassroomDto";
import { ThemeContext } from "../context/ThemeContext";

const useLightStyles = makeStyles({
    cardFree: {
        backgroundColor: tokens.colorPaletteLightGreenBackground2,
    },
    cardAboutToBeBusy: {
        backgroundColor: tokens.colorStatusWarningBackground2,
    },
    cardBusy: {
        backgroundColor: tokens.colorPaletteRedBackground2,
    },
});

const useDarkStyles = makeStyles({
    cardFree: {
        backgroundColor: tokens.colorPaletteLightGreenBackground2,
    },
    cardAboutToBeBusy: {
        backgroundColor: tokens.colorStatusWarningBackground2,
    },
    cardBusy: {
        backgroundColor: tokens.colorPaletteRedBackground2,
    }
});

export function ClassroomViewer() {

    const globalStyles = useGlobalStyles();
    const { theme } = useContext(ThemeContext);
    const themeStyles = theme === webLightTheme ? useLightStyles() : useDarkStyles();

    const { tokenData } = useContext(TokenContext);

    const [now] = useState(new Date("2023-12-04T13:55:00"));
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
        }, 10000000);

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

        const getBackgroundColor = (item: ClassroomStatus) => {
            if (!item.status.isFree) {
                return themeStyles.cardBusy;
            }
            else if (item.status.currentOrNextEvent &&
                item.status.currentOrNextEvent.start.getDate() === now.getDate() &&
                (now.getTime() >= (item.status.currentOrNextEvent.start.getTime() - 10 * 60 * 1000)) &&
                (now.getTime() <= item.status.currentOrNextEvent.start.getTime())) {
                return themeStyles.cardAboutToBeBusy;
            } else {
                return themeStyles.cardFree;
            }
        };

        return filtered.map((item) => {

            const getDividerText = () => {
                if (!item.status.statusChangeAt || !item.status.currentOrNextEvent)
                    return "Libera";
                else if (item.status.statusChangeAt.getDate() == now.getDate())
                    return `${item.status.isFree ? "Libera" : "Occupata"} fino alle ${item.status.statusChangeAt.toLocaleTimeString([], { timeStyle: "short" })}`;
            }

            return (
                <Card key={item.classroom.id} className={mergeClasses(globalStyles.card, getBackgroundColor(item))}>
                    <CardHeader
                        header={<Title1>Aula {item.classroom.name.split(" ")[0]}</Title1>}
                    />
                    <div>
                        <Divider><Subtitle2>{getDividerText()}</Subtitle2></Divider>
                        {renderEvent(item.status.currentOrNextEvent, item.classroom)}
                    </div>
                </Card>
            );
        });

    };

    const renderEvent = (event: Omit<EventDto, "classroom"> | null, classroom: ClassroomDto) => {
        // TODO Return classroom object inside ClassroomStatus object
        const fixEvent = (event: Omit<EventDto, "classroom">, classroom: ClassroomDto) => {
            let result: EventDto = {
                id: event.id,
                start: event.start,
                end: event.end,
                subject: event.subject,
                teacher: event.teacher,
                course: event.course,
                classroom: classroom
            };

            return result;
        };

        if (!event || event.start.getDate() !== now.getDate() || event.end < now) {
            return <Title2>Nessuna Lezione</Title2>
        }

        return <EventDetails event={fixEvent(event, classroom)} titleType={"custom"} titleSize="large" subtitle={event.course.name} hide={["classroom", "course"]} title={event.course.code} />
    };

    return (
        <div className={globalStyles.container}>
            {classrooms ? renderFloor(currentFloor, classrooms) : <Spinner label="Caricamento..." />}
        </div>
    )

}