import {
  Body1,
  Card,
  CardHeader,
  Divider,
  Spinner,
  Subtitle2,
  Title1,
  makeStyles,
  mergeClasses,
  tokens,
  webLightTheme,
} from "@fluentui/react-components";
import { useContext, useEffect, useState } from "react";
import { ClassroomStatus } from "../dto/ClassroomStatus";
import { useGlobalStyles } from "../globalStyles";
import { EventDto } from "../dto/EventDto";
import EventDetails from "../components/EventDetails";
import { ThemeContext } from "../context/ThemeContext";
import useRequests from "../libraries/requests/requests";
import { TimekeeperContext } from "../context/TimekeeperContext";

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
  },
});

export function ClassroomViewer() {
  const theme = useContext(ThemeContext).themeValue;
  const globalStyles = useGlobalStyles();
  const themeStyles = theme === webLightTheme ? useLightStyles() : useDarkStyles();
  const { timekeeper } = useContext(TimekeeperContext);

  const requests = useRequests();

  const now = new Date();
  const [classrooms, setClassrooms] = useState<ClassroomStatus[] | null>(null);
  const [nextClassrooms, setNextClassrooms] = useState<ClassroomStatus[] | null>(null);
  const [currentFloor, setCurrentFloor] = useState(1);

  useEffect(() => {
    // First data fetch
    getClassroomsStatus();

    // Change displayed floor every 15 seconds
    const interval = setInterval(() => {
      setCurrentFloor((oldValue) => {
        return oldValue === 3 ? 1 : oldValue + 1;
      });
    }, 15000);

    // Update classrooms every minute
    timekeeper.addListener("minute", getClassroomsStatus);

    return () => {
      clearInterval(interval);
      timekeeper.removeListener(getClassroomsStatus);
    };
  }, []);

  // Move nextClassrooms to classrooms when the floor changes
  useEffect(() => {
    if (nextClassrooms) {
      setClassrooms(nextClassrooms);
      setNextClassrooms(null);
    }
  }, [currentFloor]);

  // Move nextClassrooms to classrooms when there is no current classroom data (initial load)
  useEffect(() => {
    if (!classrooms) {
      setClassrooms(nextClassrooms);
      setNextClassrooms(null);
    }
  }, [nextClassrooms]);

  const getClassroomsStatus = () => {
    requests.classroom.status(new Date()).then(setNextClassrooms).catch(console.error);
  };

  const renderFloor = (floor: number, classrooms: ClassroomStatus[]) => {
    const filtered = classrooms.filter((item) => item.classroom.name[0] === floor.toString());

    return (
      <>
        <Card className={globalStyles.card}>
          <CardHeader header={<Title1>🏢 {floor}° Piano</Title1>} />
        </Card>
        <div className={globalStyles.grid}>{renderClassrooms(filtered)}</div>
      </>
    );
  };

  const renderClassrooms = (filtered: ClassroomStatus[]) => {
    const getBackgroundColor = (item: ClassroomStatus) => {
      if (!item.status.isFree) {
        return themeStyles.cardBusy;
      } else if (
        item.status.currentOrNextEvent &&
        item.status.currentOrNextEvent.start.getDate() === now.getDate() &&
        now.getTime() >= item.status.currentOrNextEvent.start.getTime() - 10 * 60 * 1000 &&
        now.getTime() <= item.status.currentOrNextEvent.start.getTime()
      ) {
        return themeStyles.cardAboutToBeBusy;
      } else {
        return themeStyles.cardFree;
      }
    };

    return filtered.map((item) => {
      const getDividerText = () => {
        if (item.status.statusChangeAt && item.status.statusChangeAt.getDate() === now.getDate())
          return `${item.status.isFree ? "Libera" : "Occupata"} fino alle ${item.status.statusChangeAt.toLocaleTimeString([], { timeStyle: "short" })}`;
        else return "Libera";
      };

      return (
        <Card key={item.classroom.id} className={mergeClasses(globalStyles.card, getBackgroundColor(item))}>
          <CardHeader header={<Title1>Aula {item.classroom.name.split(" ")[0]}</Title1>} />
          <div>
            <Divider>
              <Body1>{getDividerText()}</Body1>
            </Divider>
            {renderEvent(item.status.currentOrNextEvent)}
          </div>
        </Card>
      );
    });
  };

  const renderEvent = (event: EventDto | null) => {
    if (event && event.start.getDate() === now.getDate() && event.end > now) {
      return (
        <EventDetails
          event={event}
          titleSize="large"
          subtitle={event.course.name}
          hide={["classroom", "course"]}
          title="custom"
          customTitle={event.course.code}
        />
      );
    } else {
      return <Subtitle2>Nessuna lezione</Subtitle2>;
    }
  };

  return (
    <div className={globalStyles.container}>
      {classrooms ? renderFloor(currentFloor, classrooms) : <Spinner label="Caricamento..." />}
    </div>
  );
}
