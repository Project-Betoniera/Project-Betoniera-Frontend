import { makeStyles, shorthands, tokens } from "@fluentui/react-components";

export const useGlobalStyles = makeStyles({
    card: {
        display: "flex",
        flexShrink: "0",
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
        "@media screen and (max-width: 578px)": {
            ...shorthands.margin("1rem", "0"),
        }
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
        "@media screen and (max-width: 578px)": {
            ...shorthands.margin("1rem", "0"),
        }
    },
    list: {
        display: "flex",
        flexDirection: "column",
        ...shorthands.gap("1rem"),
        ...shorthands.margin("1rem"),

        "@media screen and (max-width: 578px)": {
            ...shorthands.margin("1rem", "0"),
        },
    },
    horizontalList: {
        display: "flex",
        alignItems: "center",
        ...shorthands.gap("1rem"),

        "@media screen and (max-width: 514px)": {
            flexDirection: "column",
            alignItems: "flex-start",
        },
    },
    ongoing: {
        backgroundColor: tokens.colorPaletteLightGreenBackground2,
    },
    blink: {
        animationDuration: "1s",
        animationIterationCount: "infinite",
        animationDirection: "alternate",
        animationName: [
            {
                from: {
                    opacity: 0,
                },
                to: {
                    opacity: 1,
                },
            }
        ],
    },
    betaBadge: {
        backgroundImage: "linear-gradient(30deg, hsl(40, 100%, 50%) , hsl(50, 100%, 50%))",
        textAlign: "center",
        fontWeight: "bold",
        "@media screen and (prefers-color-scheme: dark)": {
            backgroundImage: "linear-gradient(30deg, hsl(40, 100%, 45%) , hsl(50, 100%, 45%))",
        },
        ...shorthands.borderRadius("2rem"),
        ...shorthands.padding("0", "0.5rem"),
        marginLeft: "0.5rem",
        verticalAlign: "middle",
    }
});