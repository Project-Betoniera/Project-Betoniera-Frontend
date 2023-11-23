import { makeStyles } from "@fluentui/react-components";
import CalendarJs from "calendar-js";

type DetailedCalendar = {
    calendar: CalendarDay[][];
};

type CalendarDay = {
    date: Date,
    day: number,
    isInPrimaryMonth: boolean,
    isInLastWeekOfPrimaryMonth: boolean,
    index: { day: number, week: number; };
};

const useStyles = makeStyles({
    calendar: {
        display: "grid",
        gridTemplateColumns: "repeat(7, 1fr)",
    }
});

export function Calendar() {
    const styles = useStyles();
    const result: DetailedCalendar = (CalendarJs() as any).detailed(2023, 10);
    console.log(result);

    return (
        <div className={styles.calendar}>
            {result.calendar.flat().map((day) =>
                <div key={day.date.getTime()}>
                    {day.date.toLocaleString()}
                </div>
            )}
        </div>
    );
}
