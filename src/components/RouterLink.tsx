import { RefAttributes, FunctionComponent } from "react";
import { Link as FluentLink, LinkProps } from "@fluentui/react-components";
import { useNavigate } from "react-router";

export const RouterLink: FunctionComponent<LinkProps & RefAttributes<HTMLAnchorElement> & { as?: 'a'; }> = (props) => {
    const navigate = useNavigate();

    return (
        <FluentLink {...props} as="a" onClick={(e) => {
            if (props.target) return;

            const url = new URL(props.href || '', window.location.href);
            if (url.origin === window.location.origin) {
                e.preventDefault();
                navigate(url.href.substring(url.origin.length));
            }
        }} />
    );
};