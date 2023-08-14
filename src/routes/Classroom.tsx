import { useContext, useEffect, useState } from "react";
import { apiUrl } from "../config";
import axios from "axios";
import { TokenContext } from "../context/TokenContext";
import { ClassroomStatus } from "../dto/ClassroomStatus";

export function Classroom() {
    const { tokenData } = useContext(TokenContext);

    const [classrooms, setClassrooms] = useState<ClassroomStatus[]>([]);

    const [dateTime, setDateTime] = useState(new Date());

    useEffect(() => {
        axios.get(new URL(`classroom/status`, apiUrl).toString(), {
            headers: {
                Authorization: "Bearer " + tokenData.token
            },
            params: {
                time: dateTime.toISOString(),
            }
        }).then(response => {
            let result: ClassroomStatus[] = response.data;

            const exclude = [5, 19, 20, 21, 22, 23, 24, 25, 26, 32, 33];
            result = result.filter((item) => !exclude.includes(item.classroom.id));

            result = result.map((item) => {
                item.status.statusChangeAt = item.status.statusChangeAt ? new Date(item.status.statusChangeAt) : null;
                return item;
            });

            setClassrooms(result);
        });
    }, [dateTime]);

    return (
        <div className="container align-left">
            <div className="container wide align-left">
                <h1>🏫 Stato Aule</h1>
                <h3>📅 {new Date().toLocaleDateString([], { year: "numeric", month: "numeric", day: "numeric", hour: "2-digit", minute: "2-digit"})}</h3>
                <input type="datetime-local" defaultValue={dateTime.toLocaleString()} min="2018-10-01T00:00" onChange={(e) => setDateTime(new Date(e.target.value))} />
            </div>
            <div className="flex-h align-left wrap">
                {
                    classrooms.map((item) => {
                        const status = item.status.isFree ? "🟢 Libera" : "🔴 Occupata";
                        let changeTime = "";

                        if (!item.status.statusChangeAt)
                            changeTime = "⌚ Fino a fine giornata.";
                        else if (item.status.statusChangeAt.getDate() == dateTime.getDate())
                            changeTime = "⌚ Fino alle " + item.status.statusChangeAt.toLocaleString([], { hour: "2-digit", minute: "2-digit" });
                        else if (item.status.statusChangeAt.getDate() == dateTime.getDate() + 1)
                            changeTime = "⌚ Fino alle 18:00";
                        else
                            changeTime = "⌚ " + item.status.statusChangeAt.toLocaleString([], { day: "2-digit", month: "2-digit", year: "2-digit", hour: "2-digit", minute: "2-digit" });

                        return (
                            <div key={item.classroom.id} className="container align-left" style={{ backgroundColor: item.status.isFree ? "#00FF0030" : "#FF000030" }}>
                                <h3>🏫 Aula {item.classroom.name}</h3>
                                <span>{status}</span>
                                <span>{changeTime}</span>

                            </div>
                        );
                    })
                }
            </div>
        </div>
    );
}
