import { Button, Input, Subtitle2, makeStyles, mergeClasses } from "@fluentui/react-components";
import { ArrowLeftFilled, ArrowRightFilled, CalendarTodayRegular } from "@fluentui/react-icons";
import { useContext, useEffect, useState } from 'react';
import { TimekeeperContext } from '../context/TimekeeperContext';
import { TimekeeperListener } from '../libraries/timekeeper/timekeeper';

type DateSelectorProps = {
    autoUpdate: boolean;
    dateTime: Date;
    setDateTime: (dateTime: Date, autoUpdated: boolean) => void;
    inputType: "date" | "datetime-local" | "month";
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
            case "datetime-local": // compare with minute precision
                setIsToday(
                    now.getHours() === dateTime.getHours() &&
                    now.getMinutes() === dateTime.getMinutes() &&
                    now.getDate() === dateTime.getDate() &&
                    now.getMonth() === dateTime.getMonth() &&
                    now.getFullYear() === dateTime.getFullYear()
                );
                break;
            case "date": // compare with day precision
                setIsToday(
                    now.getDate() === dateTime.getDate() &&
                    now.getMonth() === dateTime.getMonth() &&
                    now.getFullYear() === dateTime.getFullYear()
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
                inputType === 'datetime-local' ? 'minute' : 'hour',
                callback
            );
            return () => {
                timekeeper.removeListener(callback);
            }
        }
    }, [autoUpdate, isToday, inputType]);

    /**
     * Handles the click event of the arrow buttons
     * @param value The amount of days to add or remove to the current date
     */
    const onArrowButtonClick = (value: number) => {

        let result: Date = new Date(dateTime);

        inputType === "month" ?
            result.setMonth(result.getMonth() + value) :
            result.setDate(result.getDate() + value);

        // If the date is today, set the time to now, else set it to 00:00
        const now = new Date();
        if (inputType === "date") result.toDateString() == now.toDateString() ?
            result.setHours(now.getHours(), now.getMinutes(), now.getSeconds(), now.getMilliseconds()) :
            result.setHours(0, 0, 0, 0);

        setDateTime(result, false);
    };

    const onTodayButtonClick = () => { if (!isToday) setDateTime(new Date(), false); };

    const selectorValue = inputType === "date" ?
        new Date(dateTime.getTime() - (dateTime.getTimezoneOffset() * 60000)).toISOString().split('T')[0] :
        new Date(dateTime.getTime() - (dateTime.getTimezoneOffset() * 60000)).toISOString().split('.')[0].slice(0, -3);

    const firstCharUppercase = (string: string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    };

    return (
        <div className={styles.root}>
            <div className={styles.dateSelector}>
                <Button className={mergeClasses(styles.arrowButton, styles.hideOnMobile)} icon={<ArrowLeftFilled />} onClick={() => onArrowButtonClick(-1)}></Button>
                <Button className={mergeClasses(styles.arrowButton, styles.hideOnMobile)} icon={<ArrowRightFilled />} onClick={() => onArrowButtonClick(1)}></Button>
                <Button className={styles.arrowButton} disabled={isToday} onClick={onTodayButtonClick} icon={<CalendarTodayRegular />}></Button>
                {inputType === "month" ?
                    <Subtitle2>{firstCharUppercase(dateTime.toLocaleString([], { month: "long", year: "numeric" }))}</Subtitle2> :
                    <Input className={styles.growOnMobile} type={inputType} onChange={(_event, data) => { data.value && setDateTime(new Date(data.value), false); }} value={selectorValue}></Input>}
            </div>
            <div className={mergeClasses(styles.dateSelector, styles.hideOnDesktop)}>
                <Button className={mergeClasses(styles.arrowButton, styles.growOnMobile)} icon={<ArrowLeftFilled />} onClick={() => onArrowButtonClick(-1)}></Button>
                <Button className={mergeClasses(styles.arrowButton, styles.growOnMobile)} icon={<ArrowRightFilled />} onClick={() => onArrowButtonClick(1)}></Button>
            </div>
        </div>
    );
};