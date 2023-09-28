import { makeStyles, shorthands, tokens } from "@fluentui/react-components";

export const useGlobalStyles = makeStyles({
    main: {
        alignItems: "center",
        display: "flex",
        flexGrow: 1,
    },
    container: {
        display: "flex",
        flexGrow: 1,
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        ...shorthands.margin("1rem"),
        ...shorthands.padding("1rem"),
    },
    footer: {
        display: "flex",
        justifyContent: "space-between",
        ...shorthands.margin("1rem"),
        ...shorthands.padding("1rem"),
        ...shorthands.borderRadius("1rem"),
        color: tokens.colorNeutralForeground2,
        backgroundColor: tokens.colorNeutralBackground2
    },
});