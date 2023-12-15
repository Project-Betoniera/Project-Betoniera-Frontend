import { Combobox, Label, Option, makeStyles, Select, SelectOnChangeData } from "@fluentui/react-components";
import { useGlobalStyles } from "../globalStyles";
import { ChangeEvent, FunctionComponent, useContext, useEffect, useState } from "react";
import { TokenContext } from "../context/TokenContext";
import { CourseContext } from "../context/CourseContext";
import { OptionOnSelectData, SelectionEvents } from "@fluentui/react-combobox";
import useRequests from "../libraries/requests/requests";

export type CalendarTypeCode = "course" | "classroom" | "teacher";
export type CalendarType = { code: CalendarTypeCode, name: string; };
export type CalendarSelection = { code: string, name: string; };

export type CalendarSelectorProps = {
    onSelectionChange: (type: CalendarType, selection: CalendarSelection) => void;
};

const useStyles = makeStyles({

});

export const CalendarSelector: FunctionComponent<CalendarSelectorProps> = (props: CalendarSelectorProps) => {
    const globalStyles = useGlobalStyles();
    const styles = useStyles();

    const token = useContext(TokenContext).token;
    const { course: userCourse } = useContext(CourseContext);
    const requests = useRequests();

    // Items for the various selectors
    const calendarTypes: { code: CalendarTypeCode, name: string; }[] = [
        { code: "course", name: "Corso", },
        { code: "classroom", name: "Aula" },
        { code: "teacher", name: "Docente" },
    ];
    const [calendarSelectors, setCalendarSelectors] = useState<{ code: string, name: string; fullName: string; }[]>([]);

    // Selected values
    const [calendarType, setCalendarType] = useState<CalendarType>(calendarTypes[0]);
    const [calendarSelector, setCalendarSelector] = useState<CalendarSelection>(userCourse ? { code: userCourse?.id.toString(), name: userCourse.code } : { code: "", name: "" });

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

    return (
        <div>
            <div className={globalStyles.horizontalList}>
                <Label>Calendario per</Label>
                <Select value={calendarType.code} onChange={onCalendarTypeChange}>
                    {calendarTypes.map(item => <option key={item.code} value={item.code}>{item.name}</option>)}
                </Select>
            </div>

            <div className={globalStyles.horizontalList}>
                <Label className={globalStyles.horizontalList}>Scegli {calendarType.name.toLowerCase()}</Label>
                <Combobox placeholder={`Cerca ${calendarType.name.toLowerCase()}`} defaultValue={calendarSelector.name} defaultSelectedOptions={[calendarSelector.code]} onOptionSelect={onCalendarSelectorChange}>
                    {calendarSelectors.map(item => <Option key={item.code} value={item.code} text={item.name}>{item.fullName}</Option>)}
                </Combobox>
            </div>
        </div>
    );
};
