import { Avatar, Option, Body1, Divider, Dropdown, Subtitle1, Subtitle2, makeStyles } from "@fluentui/react-components";
import { useContext } from "react";
import { AppTheme, ThemeContext } from "../context/ThemeContext";
import { UserContext } from "../context/UserContext";

const useStyles = makeStyles({
    userContainer: {
        display: "flex",
        flexDirection: "row",
        columnGap: "0.5rem",
        alignItems: "center",

        marginTop: "1rem",
        marginBottom: "1rem",
    },
    userInfo: {
        display: "grid"
    },
    profileMenu: {
        display: "flex",
        flexDirection: "column",
        rowGap: "0.5rem",

        marginTop: "1rem",
        marginBottom: "1rem",
    },
    displayRow: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        columnGap: "0.5rem",

        marginTop: "0.5rem",
    },
    displayColumn: {
        display: "flex",
        flexDirection: "column",
    },
    text: {
        display: "block",
        overflowX: "hidden",
        whiteSpace: "nowrap",
        textOverflow: "ellipsis",
    },
});

export const UserProfile: React.FC = () => {
    const styles = useStyles();
    const { name, email } = useContext(UserContext).user;
    const { course } = useContext(UserContext).course;
    const { theme, setTheme } = useContext(ThemeContext);

    const themeValues = {
        "auto": "Automatico",
        "light": "Chiaro",
        "dark": "Scuro",
    }

    return (
        <div>
            <div className={styles.userContainer}>
                <Avatar size={48} />
                <div className={styles.userInfo}>
                    <Subtitle1 className={styles.text}>{name}</Subtitle1>
                    <Body1 className={styles.text}>{email}</Body1>
                    <Body1 className={styles.text}>{course && `${course.name} - ${course.startYear}/${course.endYear}`}</Body1>
                </div>
            </div>
            <Divider />
            <div className={styles.profileMenu}>
                <div>
                    <Subtitle2>Tema</Subtitle2>
                    <div className={styles.displayRow}>
                        <Dropdown onOptionSelect={(_event, data) => setTheme(data.selectedOptions[0] as AppTheme)} value={themeValues[theme]} selectedOptions={[theme]} >
                            <Option value="auto" text="Automatico">Automatico</Option>
                            <Option value="light" text="Chiaro">Chiaro</Option>
                            <Option value="dark" text="Scuro">Scuro</Option>
                        </Dropdown>
                    </div>
                </div>
            </div>
        </div>
    );
};
