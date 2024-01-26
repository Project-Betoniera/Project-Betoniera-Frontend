import { Avatar, Body1, Button, Divider, Dropdown, Option, Subtitle1, Subtitle2, makeStyles } from "@fluentui/react-components";
import { CheckmarkStarburstFilled } from "@fluentui/react-icons";
import { useContext } from "react";
import { AppTheme, ThemeContext } from "../context/ThemeContext";
import { UserContext } from "../context/UserContext";
import AdminPanel from "./AdminPanel";
import { MessagesContext } from '../context/MessagesContext';

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
    const { name, email, isAdmin } = useContext(UserContext).user;
    const { course } = useContext(UserContext).course;
    const { theme, setTheme } = useContext(ThemeContext);
    const { reloadMessages } = useContext(MessagesContext);

    const themeValues = {
        "auto": "Automatico",
        "light": "Chiaro",
        "dark": "Scuro",
    };

    return (
        <div>
            <div className={styles.userContainer}>
                <Avatar size={48} badge={isAdmin ? { icon: <CheckmarkStarburstFilled color="gold" />, size: "medium" } : undefined} />
                <div className={styles.userInfo}>
                    <Subtitle1 className={styles.text}>{name}</Subtitle1>
                    <Body1 className={styles.text}>{email}</Body1>
                    <Body1 className={styles.text}>{course && `${course.name} - ${course.startYear}/${course.endYear}`}</Body1>
                </div>
            </div>
            <Divider />
            <div className={styles.profileMenu}>
                <div style={{ display: isAdmin ? "unset" : "none" }}>
                    <AdminPanel />
                </div>
                <Subtitle2>Tema</Subtitle2>
                <div className={styles.displayRow}>
                    <Dropdown onOptionSelect={(_event, data) => setTheme(data.selectedOptions[0] as AppTheme)} value={themeValues[theme]} selectedOptions={[theme]} >
                        <Option value="auto" text="Automatico">Automatico</Option>
                        <Option value="light" text="Chiaro">Chiaro</Option>
                        <Option value="dark" text="Scuro">Scuro</Option>
                    </Dropdown>
                </div>
                <Button onClick={() => {
                    localStorage.removeItem("dismissedMessages");
                    reloadMessages();
                }}>Reimposta messaggi ignorati</Button>
            </div>
        </div>
    );
};
