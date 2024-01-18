import { Button, Drawer, DrawerBody, DrawerHeader, DrawerHeaderTitle, Subtitle2, Tab, TabList, TabListProps, makeStyles, shorthands, tokens } from '@fluentui/react-components';
import { FunctionComponent, useContext, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CalendarFilled, HomeFilled, BuildingFilled, InfoFilled, ArrowExitFilled, TaskListSquareLtrFilled, PersonFilled, DismissRegular } from "@fluentui/react-icons";
import { TokenContext } from '../context/TokenContext';
import { UserProfile } from './UserProfile';
import { UserContext } from '../context/UserContext';
import { RouterButton } from './RouterButton';

const useStyles = makeStyles({
    drawer: {
        ...shorthands.borderRadius(tokens.borderRadiusMedium)
    },
    drawerBody: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: '100%',

        marginBottom: '1rem',
    },
    displayColumn: {
        display: "flex",
        flexDirection: "column",
        rowGap: "0.5rem",
    }
});

const menuItems = [
    {
        displayName: 'Home',
        path: '/',
        icon: <HomeFilled />,
    },
    {
        displayName: 'Aule',
        path: '/classroom',
        icon: <BuildingFilled />,
    },
    {
        displayName: 'Calendario',
        path: '/calendar',
        icon: <CalendarFilled />,
    },
    {
        displayName: 'Voti',
        path: '/grade',
        icon: <TaskListSquareLtrFilled />,
    }
];

const RouterMenu: FunctionComponent<TabListProps> = (props, iconsOnly: boolean) => {
    const styles = useStyles();
    const { setToken, setRemember, setIsInvalid } = useContext(TokenContext);
    const { setCourse } = useContext(UserContext).course;
    const { setName: setUserName, setEmail: setUserEmail } = useContext(UserContext).user;

    const logout = () => {
        setToken(null);
        setRemember(false);
        setIsInvalid(false);
        setCourse(null);
        setUserName(null);
        setUserEmail(null);
    };

    useLocation();
    const url = new URL(window.location.href);
    const path = url.href.substring(url.origin.length);
    const navigate = useNavigate();

    const [isUserDrawerOpen, setIsUserDrawerOpen] = useState(false);

    return (
        <>
            <TabList
                {...props}
                appearance="transparent"
                size="large"

                onTabSelect={(_, data) => {
                    if (typeof data.value !== 'string')
                        throw new Error('Invalid tab value');

                    const url = new URL(data.value, window.location.href);
                    if (url.origin === window.location.origin) {
                        navigate(url.href.substring(url.origin.length));
                    } else {
                        window.open(url);
                    }
                }}
                selectedValue={path}
            >
                {menuItems.map((item, i) => {
                    return (
                        <Tab key={i} value={item.path} icon={item.icon} aria-description={item.displayName}>{!iconsOnly ? item.displayName : ""}</Tab>
                    );
                })}

                <Button appearance="primary" style={{ alignSelf: 'center' }} icon={<PersonFilled />} onClick={() => setIsUserDrawerOpen(true)} aria-description="user-profile">{!iconsOnly ? "Profilo" : ""}</Button>
            </TabList>

            <Drawer type={"overlay"} size={"medium"} open={isUserDrawerOpen} onOpenChange={(_, { open }) => setIsUserDrawerOpen(open)} position="end" className={styles.drawer}>
                <DrawerHeader>
                    <DrawerHeaderTitle
                        action={
                            <Button
                                appearance="subtle"
                                aria-label="Close"
                                icon={<DismissRegular />}
                                onClick={() => setIsUserDrawerOpen(false)}
                            />
                        }
                    > Profilo Utente
                    </DrawerHeaderTitle>
                </DrawerHeader>

                <DrawerBody className={styles.drawerBody}>
                    <UserProfile />
                    <div className={styles.displayColumn}>
                        {/* TO-FIND-A-SOLUTION: Find a way to close the drawer after clicking the about page RouterButton! Check mobile version for reason! */}
                        <RouterButton as="a" appearance="secondary" href="/about" icon={<InfoFilled />} aria-description="about">Informazioni</RouterButton>
                        <Button appearance="primary" icon={<ArrowExitFilled />} onClick={logout} aria-description="logout">Logout</Button>
                    </div>
                </DrawerBody>
            </Drawer>
        </>
    );
};

export default RouterMenu;
