import { FunctionComponent } from "react";
import { EventDto } from "../dto/EventDto";
import { Body1, Body2, Subtitle1, Subtitle2, Title1, Title2, Title3, makeStyles } from "@fluentui/react-components";
import getClockEmoji from "../libraries/clockEmoji/clockEmoji";

export type EventDetailsProps = {
    /**
     * The event to be displayed.
     */
    event: EventDto;
    /**
     * The property to use as title. If `custom` is used, the `customTitle` property should be provided.
    */
    titleType: "time" | "subject" | "classroom" | "teacher" | "course" | "custom";
    /**
     * The size of the title.
    */
    titleSize?: "small" | "medium" | "large" | "huge";
    /**
     * The title to be displayed if the `title` property is set to `custom`.
    */
    title?: string;
    /**
     * The subtitle to be displayed.
    */
    subtitle?: string;
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
    text: {
        display: "block",
        overflowX: "hidden",
        whiteSpace: "nowrap",
        textOverflow: "ellipsis",
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
});

/**
 * Configurable component used to display the details of an event.
 * @param props the properties of the component.
 */
const EventDetails: FunctionComponent<EventDetailsProps> = (props: EventDetailsProps) => {
    const styles = useStyles();

    let title: string;
    const titleSize = props.titleSize ?? "medium";

    const time = `${getClockEmoji(props.event.start)} ${props.event.start.toLocaleString([], { timeStyle: "short" })} - ${props.event.end.toLocaleString([], { timeStyle: "short" })}`;
    const subject = `\u{1F4BC} ${props.event.subject}`;
    const classroom = `\u{1F4CD} Aula ${props.event.classroom.name}`;
    const teacher = props.event.teacher ? `\u{1F9D1}\u{200D}\u{1F3EB} ${props.event.teacher}` : "";
    const course = `\u{1F4DA} ${props.event.course.code} ${props.event.course.name}`;

    switch (props.titleType) {
        case "classroom":
            title = classroom;
            break;
        case "course":
            title = course;
            break;
        case "teacher":
            title = teacher;
            break;
        case "time":
            title = time;
            break;
        case "subject":
            title = subject;
            break;
        default:
            title = props.title ?? "";
            break;
    }

    return (
        <div className={styles.root}>
            {titleSize === "huge" && <Title1 className={styles.text}>{title}</Title1>}
            {props.subtitle && titleSize === "huge" && <Title3 className={styles.text}>{props.subtitle}</Title3>}
            {titleSize === "large" && <Title2 className={styles.text}>{title}</Title2>}
            {props.subtitle && titleSize === "large" && <Subtitle1 className={styles.text}>{props.subtitle}</Subtitle1>}
            {titleSize === "medium" && <Subtitle1 className={styles.text}>{title}</Subtitle1>}
            {props.subtitle && titleSize === "medium" && <Body1 className={styles.text}>{props.subtitle}</Body1>}
            {titleSize === "small" && <Subtitle2 className={styles.text}>{title}</Subtitle2>}
            {props.subtitle && titleSize === "small" && <Body1 className={styles.text}>{props.subtitle}</Body1>}

            {props.now && props.event.start <= props.now && props.event.end > props.now && <Body2 className={styles.blinkAnimation}>{"\u{1F534}"} In corso</Body2>}
            <div className={styles.body}>
                {props.titleType !== "time" && !props.hide?.includes("time") && <Body1 className={styles.text}>{time}</Body1>}
                {props.titleType !== "subject" && !props.hide?.includes("subject") && <Body1 className={styles.text}>{subject}</Body1>}
                {props.titleType !== "course" && !props.hide?.includes("course") && <Body1 className={styles.text}>{course}</Body1>}
                {props.titleType !== "classroom" && !props.hide?.includes("classroom") && <Body1 className={styles.text}>{classroom}</Body1>}
                {props.titleType !== "teacher" && !props.hide?.includes("teacher") && <Body1 className={styles.text}>{teacher}</Body1>}
            </div>
        </div>
    );
};

export default EventDetails;
