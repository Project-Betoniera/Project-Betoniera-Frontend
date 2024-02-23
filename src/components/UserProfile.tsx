import { Avatar, Body1, Button, Divider, Dropdown, Option, Subtitle1, Subtitle2, makeStyles } from "@fluentui/react-components";
import { CheckmarkStarburstFilled, CommentDismissFilled } from "@fluentui/react-icons";
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
    text: {
        display: "block",
        overflowX: "hidden",
        whiteSpace: "nowrap",
        textOverflow: "ellipsis",
    },
});

export const UserProfile: React.FC = () => {
    const styles = useStyles();

    const { data } = useContext(UserContext);

    const user = data?.user || { name: "", email: "", year: 0, isAdmin: false };
    const course = data?.course || { id: "", code: "", name: "", startYear: 0, endYear: 0 };

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
                <Avatar size={48} badge={user.isAdmin ? { icon: <CheckmarkStarburstFilled color="gold" />, size: "medium" } : undefined} />
                <div className={styles.userInfo}>
                    <Subtitle1 className={styles.text}>{user.name}</Subtitle1>
                    <Body1 className={styles.text}>{user.email}</Body1>
                    <Body1 className={styles.text}>{course && `${course.name} - ${course.startYear}/${course.endYear}`}</Body1>
                </div>
            </div>
            <Divider />
            <div className={styles.profileMenu}>
                {user.isAdmin && <div>
                    <AdminPanel />
                </div>}
                <Subtitle2>Tema</Subtitle2>
                <Dropdown onOptionSelect={(_event, data) => setTheme(data.selectedOptions[0] as AppTheme)} value={themeValues[theme]} selectedOptions={[theme]} >
                    <Option value="auto" text="Automatico">Automatico</Option>
                    <Option value="light" text="Chiaro">Chiaro</Option>
                    <Option value="dark" text="Scuro">Scuro</Option>
                </Dropdown>
                <Subtitle2>Utilità</Subtitle2>
                <Button icon={<CommentDismissFilled />} onClick={() => {
                    localStorage.removeItem("dismissedMessages");
                    reloadMessages();
                }}>Reimposta messaggi ignorati</Button>
            </div>
        </div>
    );
};
