import { makeStyles, shorthands, tokens } from "@fluentui/react-components";

export const useGlobalStyles = makeStyles({
    card: {
        backgroundColor: tokens.colorNeutralBackground2,
    },
    main: {
        display: "flex",
        flexDirection: "column",
        alignItems: "stretch",
        flexGrow: 1,
    },
    container: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        ...shorthands.margin("1rem"),
        ...shorthands.padding("1rem"),
    },
    footer: {
        display: "flex",
        justifyContent: "space-between",
        ...shorthands.margin("0.5rem"),
        ...shorthands.padding("1rem"),
        ...shorthands.borderRadius("1rem"),
        color: tokens.colorNeutralForeground2,
        backgroundColor: tokens.colorNeutralBackground2
    },
});