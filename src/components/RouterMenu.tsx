import { Button, Tab, TabList, TabListProps } from '@fluentui/react-components';
import { FunctionComponent, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CalendarFilled, HomeFilled, BuildingFilled, InfoFilled, ArrowExitFilled, TaskListSquareLtrFilled } from "@fluentui/react-icons";
import { TokenContext } from '../context/TokenContext';
import { CourseContext } from '../context/CourseContext';

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
    },
    {
        displayName: 'About',
        path: '/about',
        icon: <InfoFilled />,
    }
];

const RouterMenu: FunctionComponent<TabListProps> = (props, iconsOnly: boolean) => {
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

    return (
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

            <Button appearance="primary" style={{ alignSelf: 'center' }} icon={<ArrowExitFilled />} onClick={logout} aria-description="logout">{!iconsOnly ? "Logout" : ""}</Button>
        </TabList>
    );
};

export default RouterMenu;
