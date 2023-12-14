import { FunctionComponent } from "react";
import { EventDto } from "../dto/EventDto";
import { Body1, Body2, Subtitle2, makeStyles } from "@fluentui/react-components";
import getClockEmoji from "../libraries/clockEmoji/clockEmoji";
import { RouterLink } from "./RouterLink";

export type EventDetailsProps = {
    /**
     * The event to be displayed.
     */
    event: EventDto;
    /**
     * The property to use as title. If `custom` is used, the `customTitle` property should be provided.
    */
    title: "time" | "subject" | "classroom" | "teacher" | "course" | "custom";
    /**
     * The title to be displayed if the `title` property is set to `custom`.
    */
    customTitle?: string;
    /**
     * Whether to make the course label a link to see the calendar of the course. Defaults to `false`.
    */
    linkToCalendar?: boolean;
    /**
     * The properties to hide. If not provided, all properties will be displayed.
    */
    hide?: ("time" | "subject" | "classroom" | "teacher" | "course")[];
    /**
     * The current date. Used to display "Ongoing" badge if the event is ongoing.
     */
    now?: Date;
};

const useStyles = makeStyles({
    root: {
        display: "flex",
        flexDirection: "column",
        rowGap: "0.5rem"
    },
    body: {
        display: "flex",
        flexDirection: "column"
    },
    blinkAnimation: {
        animationDuration: "1s",
        animationIterationCount: "infinite",
        animationDirection: "alternate",
        animationName: [
            {
                from: {
                    opacity: 0,
                },
                to: {
                    opacity: 1,
                },
            }
        ],
    },
    removeLinkStyle: {
        color: "inherit",
        ":hover": {
            color: "inherit",
        },
    }
});

/**
 * Configurable component used to display the details of an event.
 * @param props the properties of the component.
 */
const EventDetails: FunctionComponent<EventDetailsProps> = (props: EventDetailsProps) => {
    const styles = useStyles();

    const time = `${getClockEmoji(props.event.start)} ${props.event.start.toLocaleString([], { timeStyle: "short" })} - ${props.event.end.toLocaleString([], { timeStyle: "short" })}`;
    const subject = `\u{1F4BC} ${props.event.subject}`;
    const classroom = `\u{1F4CD} Aula ${props.event.classroom.name}`;
    const teacher = props.event.teacher ? `\u{1F9D1}\u{200D}\u{1F3EB} ${props.event.teacher}` : "";
    const course = `\u{1F4DA} ${props.event.course.code} ${props.event.course.name}`;

    let title: string;
    switch (props.title) {
        case "subject":
            title = subject;
            break;
        case "classroom":
            title = classroom;
            break;
        case "custom":
            title = props.customTitle || "eventDetails";
            break;
        default:
            title = "eventDetails";
    }

    return (
        <div className={styles.root}>
            <Subtitle2>{title}</Subtitle2>
            {props.now && props.event.start <= props.now && props.event.end > props.now && <Body2 className={styles.blinkAnimation}>{"\u{1F534}"} In corso</Body2>}
            <div className={styles.body}>
                {props.title !== "time" && !props.hide?.includes("time") && <Body1>{time}</Body1>}
                {props.title !== "subject" && !props.hide?.includes("subject") && <Body1>{subject}</Body1>}
                {props.title !== "course" && !props.hide?.includes("course") ? props.linkToCalendar ? <RouterLink as="a" className={styles.removeLinkStyle} href={"/calendar?course=" + props.event.course.id}>{course}</RouterLink> : <Body1>{course}</Body1> : null}
                {props.title !== "classroom" && !props.hide?.includes("classroom") && <Body1>{classroom}</Body1>}
                {props.title !== "teacher" && !props.hide?.includes("teacher") && <Body1>{teacher}</Body1>}
            </div>
        </div>
    );
};

export default EventDetails;
