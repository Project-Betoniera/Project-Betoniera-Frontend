import { Button, Drawer, DrawerBody, DrawerHeader, DrawerHeaderTitle, Tab, TabList, TabListProps, makeStyles, shorthands, tokens } from '@fluentui/react-components';
import { FunctionComponent, useContext, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CalendarFilled, HomeFilled, BuildingFilled, InfoFilled, ArrowExitFilled, PersonFilled, DismissRegular } from "@fluentui/react-icons";
import { TokenContext } from '../context/TokenContext';
import { CourseContext } from '../context/CourseContext';
import { UserProfile } from './UserProfile';

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
        displayName: 'About',
        path: '/about',
        icon: <InfoFilled />,
    }
];

const RouterMenu: FunctionComponent<TabListProps> = (props, iconsOnly: boolean) => {
    const styles = useStyles();
    const { setToken, setRemember, setIsInvalid } = useContext(TokenContext);
    const { setCourse } = useContext(CourseContext);

    const logout = () => {
        setToken(null);
        setRemember(false);
        setIsInvalid(false);
        setCourse(null);
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

                <Button appearance="primary" style={{ alignSelf: 'center' }} icon={<PersonFilled />} onClick={() => setIsUserDrawerOpen(true)} aria-description="user-profile">{!iconsOnly ? "User Profile" : ""}</Button>
            </TabList>

            <Drawer type={"overlay"} open={isUserDrawerOpen} onOpenChange={(_, { open }) => setIsUserDrawerOpen(open)} position="end" className={styles.drawer}>
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
                    <Button appearance="primary" style={{ alignSelf: 'center' }} icon={<ArrowExitFilled />} onClick={logout} aria-description="logout">Logout</Button>
                </DrawerBody>
            </Drawer>
        </>
    );
};

export default RouterMenu;
