import { OptionOnSelectData, SelectionEvents } from "@fluentui/react-combobox";
import { Body1, Combobox, Option, Select, SelectOnChangeData, makeStyles, shorthands } from "@fluentui/react-components";
import { ChangeEvent, FunctionComponent, useContext, useEffect, useState } from "react";
import { CourseContext } from "../../context/CourseContext";
import useRequests from "../../libraries/requests/requests";

/**
 * The available calendar types.
 */
export type CalendarType = "course" | "classroom" | "teacher";

/**
 * A calendar selection is a calendar that can be selected by the user.
 * This type is used to populate the calendar selection list.
 */
export type CalendarSelection = {
    /**
     * The internal ID used by the API to identify the calendar.
     */
    id: string,
    /**
     * The type of the calendar.
     */
    type: CalendarType,
    /**
     * A short name for the calendar. This is the text that will be displayed in the combobox when the option is selected.
     */
    shortName: string,
    /**
     * The full name of the calendar. This is the text that will be displayed in the combobox when browsing the options.
     */
    fullName: string,
};

/**
 * Properties for the `CalendarSelector` component.
 */
export type CalendarSelectorProps = {
    /**
     * Called when a new calendar is selected
     * @param selection The new selection
     * @returns 
     */
    onSelectionChange: (selection: CalendarSelection) => void;
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

/**
 * A component that allows the user to select a calendar.  
 * When a new calendar is selected, the `onSelectionChange` callback is called,
 * passing the new selection as a parameter.
 */
export const CalendarSelector: FunctionComponent<CalendarSelectorProps> = (props: CalendarSelectorProps) => {
    const styles = useStyles();

    const { course: userCourse } = useContext(CourseContext);
    const requests = useRequests();

    // The available calendar types
    const [calendarTypes] = useState<{ code: CalendarType, name: string; }[]>(() => [
        { code: "course", name: "Corso", },
        { code: "classroom", name: "Aula" },
        { code: "teacher", name: "Docente" },
    ]);

    // Available calendars for the current selected type (If the type is "course", the list will be populated with all the available courses, and so on)
    const [calendarSelections, setCalendarSelections] = useState<CalendarSelection[]>([]);

    // The current selected calendar type
    const [currentType, setCurrentType] = useState<{ code: CalendarType, name: string; }>(calendarTypes[0]);

    // The current selected calendar
    const [currentSelection, setCurrentSelection] = useState<CalendarSelection>({
        id: userCourse?.id.toString() || "" /* TODO Fix course type to not be null */,
        type: "course",
        shortName: userCourse?.code || "",
        fullName: `${userCourse?.code} - ${userCourse?.name}` || ""
    });

    // Call the callback when the selection changes
    useEffect(() => {
        props.onSelectionChange(currentSelection);
    }, [currentSelection]);

    /**
     * Based on the current selected type, requests the available calendars.  
     * This function handles which properties of the various calendar types are used to construct each calendar selection.
     * Example:
     * - If the current type is "course", the calendar selections will be constructed 
     * using the course code as the `shortName` property and the course name as the `fullName` property, and so on.
     * 
     * All of this is necessary because each type ("course", "classroom" and "teacher") has different properties,
     * but we need to use the same `CalendarSelection` type when populating the calendar selections list.
    */
    const updateCalendarSelections = () => {
        // Clear available selections, but only if the list is already populated (so always but the first time)
        if (calendarSelections.length > 0) {
            setCurrentSelection({ id: "", type: "course", shortName: "", fullName: "" });
            setCalendarSelections([]);
        }

        switch (currentType.code) {
            case "course":
                requests.course.all()
                    .then(courses => {
                        setCalendarSelections(courses.map(course => ({
                            id: course.id.toString(),
                            type: "course",
                            shortName: course.code,
                            fullName: `${course.code} - ${course.name}`
                        })));
                    })
                    .catch(console.error);
                break;
            case "classroom":
                requests.classroom.all()
                    .then(classrooms => {
                        setCalendarSelections(classrooms.map(classroom => ({
                            id: classroom.id.toString(),
                            type: "classroom",
                            shortName: classroom.name,
                            fullName: `Aula ${classroom.name}`
                        })));
                    })
                    .catch(console.error);
                break;
            case "teacher":
                requests.teacher.all()
                    .then(teachers => {
                        setCalendarSelections(teachers.map(teacher => ({
                            id: teacher.name,
                            type: "teacher",
                            shortName: teacher.name,
                            fullName: teacher.name
                        })));
                    })
                    .catch(console.error);
                break;
            default:
                console.error("Invalid calendar selector");
                break;
        }
    };

    // Update available calendar selections list
    useEffect(() => updateCalendarSelections(), [currentType]);

    const onCurrentCalendarTypeChange = (_event: ChangeEvent<HTMLSelectElement>, data: SelectOnChangeData) => {
        setCurrentType(calendarTypes.find(item => item.code === data.value)!);
    };

    const onCurrentCalendarSelectionChange = (_event: SelectionEvents, data: OptionOnSelectData) => {
        setCurrentSelection(calendarSelections.find(selection => selection.id === data.optionValue)!);
    };

    return (
        <div className={styles.main}>
            <Body1>Calendario per</Body1>
            <Select value={currentType.code} onChange={onCurrentCalendarTypeChange}>
                {calendarTypes.map(item => <option key={item.code} value={item.code}>{item.name}</option>)}
            </Select>

            <Body1>Scegli {currentType.name.toLowerCase()}</Body1>
            <Combobox placeholder={`Cerca ${currentType.name.toLowerCase()}`} defaultValue={currentSelection.shortName} defaultSelectedOptions={[currentSelection.id]} onOptionSelect={onCurrentCalendarSelectionChange}>
                {calendarSelections.map(selection => <Option key={selection.id} value={selection.id} text={selection.shortName}>{selection.fullName}</Option>)}
            </Combobox>
        </div>
    );
};
