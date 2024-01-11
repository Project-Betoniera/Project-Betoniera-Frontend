import { Avatar, Subtitle1, Subtitle2, makeStyles } from "@fluentui/react-components";

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
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
    },
    profileMenu: {
        display: "flex",
        flexDirection: "column",
        rowGap: "0.5rem",
    }
});

export const UserProfile: React.FC = () => {
    const styles = useStyles();

    return (
        <div>
            <div className={styles.userContainer}>
                <Avatar size={36} />
                <div className={styles.userInfo}>
                    <Subtitle1>Nome Cognome</Subtitle1>
                    <Subtitle2>Email</Subtitle2>
                </div>
            </div>
            <div className={styles.profileMenu}>
                <Subtitle2>Impostazioni</Subtitle2>
                <Subtitle2>Impostazioni</Subtitle2>
                <Subtitle2>Impostazioni</Subtitle2>
            </div>
        </div>
    );
};