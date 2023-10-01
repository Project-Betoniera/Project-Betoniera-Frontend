import { makeStyles, shorthands, tokens } from "@fluentui/react-components";

export const useGlobalStyles = makeStyles({
    card: {
        ...shorthands.borderRadius(tokens.borderRadiusXLarge),
    },
    main: {
        display: "flex",
        flexDirection: "column",
        alignItems: "stretch",
        justifyContent: "stretch",
        flexGrow: 1,
    },
    container: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "stretch",
        ...shorthands.margin("1rem"),
        ...shorthands.padding("1rem"),
    },
    titleBar: {
        display: "flex",
        flexDirection: "column",
        alignSelf: "stretch",
        ...shorthands.borderRadius(tokens.borderRadiusXLarge),
        ...shorthands.padding("1rem"),
        "& h3": {
            ...shorthands.margin("0"),
            ...shorthands.padding("0"),
        },
    },
    grid: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(16rem, 1fr))",

        ...shorthands.gap("1rem"),
        ...shorthands.margin("1rem"),
    },
    list: {
        display: "flex",
        flexDirection: "column",
        marginBottom: "1rem",
        ...shorthands.gap("1rem"),
    },
    footer: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        ...shorthands.margin("0.5rem"),
        ...shorthands.padding("1rem"),
        ...shorthands.borderRadius(tokens.borderRadiusXLarge),
    }
});