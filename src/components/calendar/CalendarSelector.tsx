import { OptionOnSelectData, SelectionEvents } from "@fluentui/react-combobox";
import { Body1, Button, Combobox, Label, Option, Select, SelectOnChangeData, Tree, TreeItem, TreeItemLayout, makeStyles, shorthands } from "@fluentui/react-components";
import { BackpackFilled, BuildingFilled, PersonFilled, DismissFilled } from "@fluentui/react-icons";
import { ChangeEvent, FunctionComponent, useContext, useEffect, useState } from "react";
import { CourseContext } from "../../context/CourseContext";
import { TokenContext } from "../../context/TokenContext";
import { useGlobalStyles } from "../../globalStyles";
import useRequests from "../../libraries/requests/requests";

export type CalendarTypeCode = "course" | "classroom" | "teacher";
export type CalendarType = { code: CalendarTypeCode, name: string; };
export type CalendarSelection = { code: string, name: string; };

export type CalendarSelectorProps = {
    onSelectionChange: (type: CalendarType, selection: CalendarSelection) => void;
};

const useStyles = makeStyles({
    main: {
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        ...shorthands.gap("0.5rem"),
    },
    wide: {
        alignSelf: "stretch",
    }
});

export const CalendarSelector: FunctionComponent<CalendarSelectorProps> = (props: CalendarSelectorProps) => {
    const globalStyles = useGlobalStyles();
    const styles = useStyles();

    const token = useContext(TokenContext).token;
    const { course: userCourse } = useContext(CourseContext);
    const requests = useRequests();

    // Items for the various selectors
    const calendarTypes: CalendarType[] = [
        { code: "course", name: "Corso", },
        { code: "classroom", name: "Aula" },
        { code: "teacher", name: "Docente" },
    ];

    const [calendarSelectors, setCalendarSelectors] = useState<{ code: string, name: string; fullName: string; }[]>([]);

    // Selected values
    const [calendarType, setCalendarType] = useState<CalendarType>(calendarTypes[0]);
    const [calendarSelector, setCalendarSelector] = useState<CalendarSelection>(userCourse ? { code: userCourse?.id.toString(), name: userCourse.code } : { code: "", name: "" });

    const [calendars, setCalendars] = useState<{ code: string, name: string, color: string, type: string }[]>([]);

    // Call the callback when the selection changes
    useEffect(() => {
        props.onSelectionChange(calendarType, calendarSelector);
    }, [calendarType, calendarSelector]);

    // Get calendar selector list
    useEffect(() => {
        // Clear selectors, but only if the list is already populated (so always but the first time)
        if (calendarSelectors.length > 0) {
            setCalendarSelector({ code: "", name: "" });
            setCalendarSelectors([]);
        }

        switch (calendarType.code) {
            case "course":
                requests.course.all().then(courses => {
                    setCalendarSelectors(courses.map(item => ({ code: item.id.toString(), name: item.code, fullName: `${item.code} - ${item.name}` })));
                }).catch(() => {
                });
                break;
            case "classroom":
                requests.classroom.all().then(classrooms => {
                    setCalendarSelectors(classrooms.map(item => ({ code: item.id.toString(), name: item.name, fullName: `Aula ${item.name}` })));
                }).catch(() => {
                });
                break;
            case "teacher":
                requests.teacher.all().then(teachers => {
                    setCalendarSelectors(teachers.map(item => ({ code: item.teacher, name: item.teacher, fullName: item.teacher })));
                }).catch(() => {
                });
                break;
            default:
                console.error("Invalid calendar selector");
                break;
        }
    }, [calendarType, token]);

    const onCalendarTypeChange = (_event: ChangeEvent<HTMLSelectElement>, data: SelectOnChangeData) => {
        setCalendarType(calendarTypes.find(item => item.code === data.value) || calendarTypes[0]);
    };

    const onCalendarSelectorChange = (_event: SelectionEvents, data: OptionOnSelectData) => {
        setCalendarSelector({ code: data.selectedOptions[0] || "", name: data.optionText || "" });
    };

    const addCalendar = () => {
        // Check if the calendar is already present
        if (calendars.find(item => item.code === calendarSelector.code)) {
            return;
        }

        // Get a random color
        const color = `#${Math.floor(Math.random() * 16777215).toString(16)}`;

        // Add the calendar
        setCalendars([...calendars, { code: calendarSelector.code, name: calendarSelector.name, color: color, type: calendarType.code }]);
    };

    const getTreeIcon = (type: string) => {
        switch (type) {
            case "course":
                return(<BackpackFilled />);
            case "classroom":
                return(<BuildingFilled />);
            case "teacher":
                return(<PersonFilled />);
            default:
                return undefined;
        }
    };

    return (
        <div className={styles.main}>
            <Body1>Calendario per</Body1>
            <Select value={calendarType.code} onChange={onCalendarTypeChange}>
                {calendarTypes.map(item => <option key={item.code} value={item.code}>{item.name}</option>)}
            </Select>

            <Body1 className={globalStyles.horizontalList}>Scegli {calendarType.name.toLowerCase()}</Body1>
            <Combobox placeholder={`Cerca ${calendarType.name.toLowerCase()}`} defaultValue={calendarSelector.name} defaultSelectedOptions={[calendarSelector.code]} onOptionSelect={onCalendarSelectorChange}>
                {calendarSelectors.map(item => <Option key={item.code} value={item.code} text={item.name}>{item.fullName}</Option>)}
            </Combobox>
            <Button appearance="primary" onClick={addCalendar}>Aggiungi</Button>


            <Tree className={styles.wide}>
                <TreeItem itemType="branch">
                    <TreeItemLayout>Calendari</TreeItemLayout>
                    <Tree>
                        {calendars.map(item => <TreeItem itemType="leaf" key={item.code}><TreeItemLayout iconBefore={getTreeIcon(item.type)} actions={<Button appearance="subtle" icon={<DismissFilled/>} onClick={() => { setCalendars(calendars.filter((calendar) => calendar.code !== item.code)) }} />}>{item.name}</TreeItemLayout></TreeItem>)}
                    </Tree>
                </TreeItem>
            </Tree>
        </div>
    );
};
