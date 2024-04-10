import { OptionOnSelectData, SelectionEvents } from "@fluentui/react-combobox";
import {
  Body1,
  Combobox,
  Option,
  Select,
  SelectOnChangeData,
  makeStyles,
  shorthands,
} from "@fluentui/react-components";
import { ChangeEvent, FunctionComponent, useContext, useEffect, useState } from "react";
import { UserContext } from "../../context/UserContext";
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
  id: string;
  /**
   * The type of the calendar.
   */
  type: CalendarType;
  /**
   * A short name for the calendar. This is the text that will be displayed in the combobox when the option is selected.
   */
  shortName: string;
  /**
   * The full name of the calendar. This is the text that will be displayed in the combobox when browsing the options.
   */
  fullName: string;
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
  },
});

const selectionCache: { [type in CalendarType]: CalendarSelection[] | Promise<CalendarSelection[]> | undefined } = {
  course: undefined,
  classroom: undefined,
  teacher: undefined,
};

/**
 * Requests the available calendars for a specific calendar type.
 * This function handles which properties of the various calendar types are used to construct each calendar selection.
 * Example:
 * - If the current type is "course", the calendar selections will be constructed
 * using the course code as the `shortName` property and the course name as the `fullName` property, and so on.
 *
 * All of this is necessary because each type ("course", "classroom" and "teacher") has different properties,
 * but we need to use the same `CalendarSelection` type when populating the calendar selections list.
 *
 * This function will return cached values if they have already been generated, and it ensures that values are loaded and generated only once even if called multiple times in a short timeframe.
 */
export function getCalendarSelections(
  requests: ReturnType<typeof useRequests>,
  type: CalendarType,
): Promise<CalendarSelection[]> {
  const existingCache = selectionCache[type];
  if (existingCache instanceof Promise) {
    return existingCache;
  } else if (existingCache !== undefined) {
    return Promise.resolve(existingCache);
  } else {
    return (selectionCache[type] = (async () => {
      let result: CalendarSelection[];

      switch (type) {
        case "course":
          result = await requests.course.all().then((courses) =>
            courses.map((course) => ({
              id: course.id.toString(),
              type: "course",
              shortName: course.code,
              fullName: `${course.code} - ${course.name}`,
            })),
          );
          break;
        case "classroom":
          result = await requests.classroom.all().then((classrooms) =>
            classrooms.map((classroom) => ({
              id: classroom.id.toString(),
              type: "classroom",
              shortName: classroom.name,
              fullName: `Aula ${classroom.name}`,
            })),
          );
          break;
        case "teacher":
          result = await requests.teacher.all().then((teachers) =>
            teachers.map((teacher) => ({
              id: teacher.name,
              type: "teacher",
              shortName: teacher.name,
              fullName: teacher.name,
            })),
          );
          break;
        default:
          throw new Error("Invalid calendar selector");
      }

      selectionCache[type] = result;
      return result;
    })());
  }
}

/**
 * A component that allows the user to select a calendar.
 * When a new calendar is selected, the `onSelectionChange` callback is called,
 * passing the new selection as a parameter.
 */
export const CalendarSelector: FunctionComponent<CalendarSelectorProps> = (props: CalendarSelectorProps) => {
  const styles = useStyles();

  const course = useContext(UserContext).data?.course;
  const requests = useRequests();

  // The available calendar types
  const [types] = useState<{ code: CalendarType; name: string }[]>(() => [
    { code: "course", name: "Corso" },
    { code: "classroom", name: "Aula" },
    { code: "teacher", name: "Docente" },
  ]);

  // Available calendars for the current selected type (If the type is "course", the list will be populated with all the available courses, and so on)
  const [selections, setSelections] = useState<CalendarSelection[]>([]);

  // The current selected calendar type
  const [currentType, setCurrentType] = useState<{ code: CalendarType; name: string }>(types[0]);

  // The current selected calendar
  const [currentSelection, setCurrentSelection] = useState<CalendarSelection>({
    id: course?.id.toString() || "" /* TODO Fix course type to not be null */,
    type: "course",
    shortName: course?.code || "",
    fullName: `${course?.code} - ${course?.name}` || "",
  });

  /**
   * Retrieves and updates the available calendar selections for the current selected type.
   */
  function updateAvailableSelections() {
    // Clear available selections, but only if the list is already populated (so always but the first time)
    if (selections.length > 0) {
      setCurrentSelection({ id: "", type: "course", shortName: "", fullName: "" });
      setSelections([]);
    }

    getCalendarSelections(requests, currentType.code).then(setSelections).catch(console.error);
  }

  /**
   * Called when a new calendar is selected in the combobox.
   * If the selection is not valid, it doesn't get set,
   * and the old selection is kept.
   */
  function onCurrentSelectionChange(_event: SelectionEvents, data: OptionOnSelectData) {
    const selection = selections.find((selection) => selection.id === data.optionValue);
    if (!selection) return;
    setCurrentSelection(selection);
  }

  /**
   * Called when the user selects a new calendar type in the combobox.
   * If for some reason the current selection is not valid,
   * the selection is reset to the first available one.
   */
  function onCurrentTypeChange(_event: ChangeEvent<HTMLSelectElement>, data: SelectOnChangeData) {
    setCurrentType(types.find((item) => item.code === data.value) || types[0]);
  }

  // Update available calendar selections list
  useEffect(updateAvailableSelections, [currentType]);

  // Calls the callback function if a new valid calendar selection is selected
  useEffect(() => {
    // Ignore empty selection
    if (currentSelection.id === "" && currentSelection.shortName === "" && currentSelection.fullName === "") return;

    // If selection is not empty, call the callback
    props.onSelectionChange(currentSelection);
  }, [currentSelection]);

  return (
    <div className={styles.main}>
      <Body1>Calendario per</Body1>
      <Select value={currentType.code} onChange={onCurrentTypeChange}>
        {types.map((item) => (
          <option key={item.code} value={item.code}>
            {item.name}
          </option>
        ))}
      </Select>

      <Body1>Scegli {currentType.name.toLowerCase()}</Body1>
      <Combobox
        placeholder={`Cerca ${currentType.name.toLowerCase()}`}
        defaultValue={currentSelection.shortName}
        defaultSelectedOptions={[currentSelection.id]}
        onOptionSelect={onCurrentSelectionChange}>
        {selections.map((selection) => (
          <Option key={selection.id} value={selection.id} text={selection.shortName}>
            {selection.fullName}
          </Option>
        ))}
      </Combobox>
    </div>
  );
};
