import { makeStyles } from "@fluentui/react-components";
import { useContext, useEffect, useState } from "react";
import { ClassroomStatus } from "../dto/ClassroomStatus";
import axios from "axios";
import { apiUrl } from "../config";
import { TokenContext } from "../context/TokenContext";
import { useGlobalStyles } from "../globalStyles";

const useStyles = makeStyles({
    
});

export function ClassroomFullScreen() {

    const globalStyles = useGlobalStyles();
    const styles = useStyles();

    const { tokenData } = useContext(TokenContext);

    const [now] = useState(new Date());
    const [classrooms, setClassrooms] = useState<ClassroomStatus[] | null>(null);

    useEffect(() => {
        setClassrooms(null);
        axios.get(new URL(`classroom/status`, apiUrl).toString(), {
            headers: { Authorization: "Bearer " + tokenData.token },
            params: { time: now.toISOString(), }
        }).then(response => {
            let result: ClassroomStatus[] = response.data;

            const exclude = [5, 19, 26, 31, 33];
            result = result.filter((item) => !exclude.includes(item.classroom.id));

            result = result.map((item) => {
                item.status.statusChangeAt = item.status.statusChangeAt ? new Date(item.status.statusChangeAt) : null;
                return item;
            });

            setClassrooms(result);
        }).catch((error) => {
            console.log(error);
        });

    }, []);

    useEffect(() => {
        // Hide header and footer
        document.getElementsByTagName("header")[0].style.display = "none";
        document.getElementsByTagName("footer")[0].style.display = "none";

        return () => {
            // Restore header and footer
            document.getElementsByTagName("header")[0].style.display = "block";
            document.getElementsByTagName("footer")[0].style.display = "block";
        };

    }, []);

    return(
        <div className={globalStyles.container}>
            <h1>Classroom Full Screen</h1>
        </div>
    )

}