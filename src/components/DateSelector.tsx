import { Button, Input, Subtitle2, makeStyles, mergeClasses } from "@fluentui/react-components";
import { ArrowLeftFilled, ArrowRightFilled, CalendarTodayRegular } from "@fluentui/react-icons";
import { useContext, useEffect, useState } from "react";
import { TimekeeperContext } from "../context/TimekeeperContext";
import { TimekeeperListener } from "../libraries/timekeeper/timekeeper";

type DateSelectorProps = {
    autoUpdate: boolean;
    dateTime: Date;
    setDateTime: (dateTime: Date, autoUpdated: boolean) => void;
    inputType: "month" | "week" | "shortWeek" | "day" | "hour";
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
    const { autoUpdate, dateTime, setDateTime, inputType } = props;
    const [isToday, setIsToday] = useState(false);
    useEffect(() => {
        const now = new Date();
        switch (props.inputType) {
            case "hour": // compare with minute precision
                setIsToday(
                    now.getHours() === dateTime.getHours() &&
                    now.getMinutes() === dateTime.getMinutes() &&
                    now.getDate() === dateTime.getDate() &&
                    now.getMonth() === dateTime.getMonth() &&
                    now.getFullYear() === dateTime.getFullYear()
                );
                break;
            case "day": // compare with day precision
                setIsToday(
                    now.getDate() === dateTime.getDate() &&
                    now.getMonth() === dateTime.getMonth() &&
                    now.getFullYear() === dateTime.getFullYear()
                );
                break;
            case "week": // compare with week precision
                const firstDayOfTheWeek = new Date(dateTime.getFullYear(), dateTime.getMonth(), dateTime.getDate() - dateTime.getDay() + 1, 0, 0, 0, 0);
                const lastDayOfTheWeek = new Date(dateTime.getFullYear(), dateTime.getMonth(), dateTime.getDate() - dateTime.getDay() + 8, 0, 0, 0, 0);

                setIsToday(
                    now.getTime() > firstDayOfTheWeek.getTime() &&
                    now.getTime() < lastDayOfTheWeek.getTime()
                );
                break;
            case "shortWeek": // compare with 3-day week precision
                const firstDayOfTheShortWeek = new Date(dateTime.getFullYear(), dateTime.getMonth(), dateTime.getDate(), 0, 0, 0, 0);
                const lastDayOfTheShortWeek = new Date(dateTime.getFullYear(), dateTime.getMonth(), dateTime.getDate() - dateTime.getDay() + 2, 0, 0, 0, 0);

                setIsToday(
                    now.getTime() > firstDayOfTheShortWeek.getTime() &&
                    now.getTime() < lastDayOfTheShortWeek.getTime()
                );
                break;
            case "month": // compare with month precision
                setIsToday(
                    now.getMonth() === dateTime.getMonth() &&
                    now.getFullYear() === dateTime.getFullYear()
                );
                break;
            default:
                throw new Error(`Invalid input type: ${props.inputType}`);
        }
    }, [dateTime]);

    const { timekeeper } = useContext(TimekeeperContext);
    useEffect(() => {
        // Register new listener ONLY if autoUpdate is enabled and the current value is today
        if (autoUpdate && isToday) {
            const callback: TimekeeperListener = (date) => {
                setDateTime(date, true);
            };
            timekeeper.addListener(
                // If the input type is datetime-local, update the time every minute, else update it every hour
                inputType === "hour" ? "minute" : "hour",
                callback
            );
            return () => {
                timekeeper.removeListener(callback);
            };
        }
    }, [autoUpdate, isToday, inputType]);

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
            case "shortWeek":
                result.setDate(result.getDate() + (value * 3));
                break;
            case "day":
            case "hour":
                result.setDate(result.getDate() + value);
                break;
            default:
                break;
        }

        // If the date is today, set the time to now, else set it to 00:00
        const now = new Date();
        if (inputType === "day") result.toDateString() == now.toDateString() ?
            result.setHours(now.getHours(), now.getMinutes(), now.getSeconds(), now.getMilliseconds()) :
            result.setHours(0, 0, 0, 0);

        setDateTime(result, false);
    };

    const onTodayButtonClick = () => { if (!isToday) setDateTime(new Date(), false); };

    const selectorValue = inputType === "day" ?
        new Date(dateTime.getTime() - (dateTime.getTimezoneOffset() * 60000)).toISOString().split("T")[0] :
        new Date(dateTime.getTime() - (dateTime.getTimezoneOffset() * 60000)).toISOString().split(".")[0].slice(0, -3);

    const firstCharUppercase = (string: string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    };

    const getInputType = () => {
        switch (inputType) {
            case "month":
                return "month";
            case "week":
            case "shortWeek":
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
                <Button className={styles.arrowButton} disabled={isToday} onClick={onTodayButtonClick} icon={<CalendarTodayRegular />}></Button>
                {inputType === "month" || inputType === "week" || inputType === "shortWeek" ?
                    <Subtitle2>{firstCharUppercase(dateTime.toLocaleString([], { month: "long", year: "numeric" }))}</Subtitle2> :
                    <Input
                        className={styles.growOnMobile}
                        type={getInputType()}
                        onChange={(_event, data) => { data.value && setDateTime(new Date(data.value), false); }}
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
