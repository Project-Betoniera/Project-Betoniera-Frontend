import { FunctionComponent } from "react";
import { Navigate, useLocation } from "react-router";

export const ProtocolHandler: FunctionComponent = () => {
    const nonmiricordocomechesirilevalarobadalrouter = useLocation();
    const search = new URLSearchParams(nonmiricordocomechesirilevalarobadalrouter.search);
    const rawProtocolUrl = search.get("protocol");

    if (typeof rawProtocolUrl === "string") {
        const protocolUrl = new URL(rawProtocolUrl);
        for (let [name, value] of search.entries()) {
            if (!protocolUrl.searchParams.has(name) && name.toLowerCase() !== "protocol") {
                protocolUrl.searchParams.set(name, value);
            }
        }
        console.log(protocolUrl);
        let pathname = protocolUrl.pathname;
        while (pathname[0] === "/") {
            pathname = pathname.substring(1);
        }
        let path = "/" + pathname + protocolUrl.search + protocolUrl.hash;
        return (<Navigate to={path} replace={true} />);
    }

    return null;
};
