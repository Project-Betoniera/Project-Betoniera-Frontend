import axios from "axios";
import { apiUrl } from "../config";
import { TokenContext } from "../context/TokenContext";
import { useContext, useEffect, useState } from "react";
import { ClassroomDto } from "../dto/ClassroomDto";

export function Classroom() {

    const { token } = useContext(TokenContext);

    const [classrooms, setClassrooms] = useState<ClassroomDto[]>([]);

    useEffect(() => {
        const start = new Date("2023-01-20 00:00:00Z"); // Now
        start.setMinutes(0, 0, 0); // Now, at the beginning of the current hour

        const end = new Date(start); // Tomorrow at 00:00
        end.setDate(end.getDate() + 1);
        end.setHours(0, 0, 0, 0);

        axios.get(new URL(`classroom/free`, apiUrl).toString(), {
            headers: {
                Authorization: "Bearer " + token
            },
            params: {
                start: start.toISOString(),
                end: end.toISOString()
            }
        }).then(response => {
            let result: ClassroomDto[] = response.data;

            setClassrooms(result);
        });
    }, [token]);

    const freeClassrooms = () => classrooms.length > 0 ?
        (
            <>
                {
                    classrooms.map((classroom) => (
                        <div key={classroom.id} className="container align-left" style={{ backgroundColor: classroom.color.substring(0, 7) + "20" }}>
                            <h3>🏫 {classroom.name}</h3>
                            <span>Verrà occupata alle / verrà liberata alle [data e ora]</span>
                        </div>
                    ))
                }
            </>
        ) : (
            <div className="container">
                <p>Nessuna aula libera al momento 😒</p>
            </div>
        );

    return (
        <div className="container align-left">
            <div className="container wide align-left">
                <h1>🏫 Aule libere</h1>
            </div>
            <div className="flex-h wide align-left">
                {freeClassrooms()}
            </div>
        </div>
    );
}