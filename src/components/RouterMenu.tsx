import { Tab, TabList, TabListProps } from '@fluentui/react-components';
import { FunctionComponent } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CalendarFilled, HomeFilled, BuildingFilled, InfoFilled } from "@fluentui/react-icons";

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

const RouterMenu: FunctionComponent<TabListProps> = (props) => {
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
                    <Tab key={i} value={item.path} icon={item.icon}>{item.displayName}</Tab>
                );
            })}
        </TabList>
    );
};

export default RouterMenu;
