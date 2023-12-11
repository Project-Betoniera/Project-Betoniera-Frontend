import { Button, Input, Subtitle2, makeStyles, mergeClasses } from "@fluentui/react-components";
import { ArrowLeftFilled, ArrowRightFilled, CalendarTodayRegular } from "@fluentui/react-icons";

type DateSelectorProps = {
    now: Date;
    dateTime: Date;
    setDateTime: (dateTime: Date) => void;
    inputType: "month" | "week" | "day" | "hour";
};

const useStyles = makeStyles({
    root: {
        display: "flex",
        flexDirection: "column",
        rowGap: "0.5rem",
    },
    dateSelector: {
        display: "flex",
        flexDirection: "row",
        alignSelf: "stretch",
        columnGap: "0.5rem",
        alignItems: "center",
        "@media screen and (max-width: 578px)": {
            justifyContent: "space-between",
        },
    },
    growOnMobile: {
        maxWidth: "unset",
        "@media screen and (max-width: 578px)": {
            flexGrow: 1,
            width: "unset",
        }
    },
    arrowButton: {
        width: "4rem",
        maxWidth: "unset",
    },
    hideOnMobile: {
        "@media screen and (max-width: 578px)": {
            display: "none",
        }
    },
    hideOnDesktop: {
        "@media screen and (min-width: 579px)": {
            display: "none",
        }
    }
});

export const DateSelector: React.FC<DateSelectorProps> = (props) => {
    const styles = useStyles();
    const { now, dateTime, setDateTime, inputType } = props;

    /**
     * Handles the click event of the arrow buttons
     * @param value The amount of days to add or remove to the current date
     */
    const onArrowButtonClick = (value: number) => {
        let result: Date = new Date(dateTime);

        switch (inputType) {
            case "month":
                result.setMonth(result.getMonth() + value);
                break;
            case "week":
                result.setDate(result.getDate() + (value * 7));
                break;
            case "day":
            case "hour":
                result.setDate(result.getDate() + value);
                break;
            default:
                break;
        }

        // If the date is today, set the time to now, else set it to 00:00
        if (inputType === "day") result.toDateString() == now.toDateString() ?
            result.setHours(now.getHours(), now.getMinutes(), now.getSeconds(), now.getMilliseconds()) :
            result.setHours(0, 0, 0, 0);

        setDateTime(result);
    };

    const onTodayButtonClick = () => { if (now.toDateString() !== dateTime.toDateString()) setDateTime(new Date(now)); };

    const selectorValue = inputType === "day" ?
        new Date(dateTime.getTime() - (dateTime.getTimezoneOffset() * 60000)).toISOString().split('T')[0] :
        new Date(dateTime.getTime() - (dateTime.getTimezoneOffset() * 60000)).toISOString().split('.')[0].slice(0, -3);

    const firstCharUppercase = (string: string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    };

    const getInputType = () => {
        switch (inputType) {
            case "month":
                return "month";
            case "week":
            case "day":
                return "date";
            case "hour":
                return "datetime-local";
            default:
                return "date";
        }
    };

    return (
        <div className={styles.root}>
            <div className={styles.dateSelector}>
                <Button className={mergeClasses(styles.arrowButton, styles.hideOnMobile)} icon={<ArrowLeftFilled />} onClick={() => onArrowButtonClick(-1)}></Button>
                <Button className={mergeClasses(styles.arrowButton, styles.hideOnMobile)} icon={<ArrowRightFilled />} onClick={() => onArrowButtonClick(1)}></Button>
                <Button className={styles.arrowButton} disabled={dateTime.toDateString() === now.toDateString()} onClick={onTodayButtonClick} icon={<CalendarTodayRegular />}></Button>
                {inputType === "month" || inputType === "week" ?
                    <Subtitle2>{firstCharUppercase(dateTime.toLocaleString([], { month: "long", year: "numeric" }))}</Subtitle2> :
                    <Input
                        className={styles.growOnMobile}
                        type={getInputType()}
                        onChange={(_event, data) => { data.value && setDateTime(new Date(data.value)); }}
                        value={selectorValue}
                    ></Input>}
            </div>
            <div className={mergeClasses(styles.dateSelector, styles.hideOnDesktop)}>
                <Button className={mergeClasses(styles.arrowButton, styles.growOnMobile)} icon={<ArrowLeftFilled />} onClick={() => onArrowButtonClick(-1)}></Button>
                <Button className={mergeClasses(styles.arrowButton, styles.growOnMobile)} icon={<ArrowRightFilled />} onClick={() => onArrowButtonClick(1)}></Button>
            </div>
        </div>
    );
};
