import { useContext, useEffect, useState } from "react";
import { apiUrl } from "../config";
import axios from "axios";
import { TokenContext } from "../context/TokenContext";
import { ClassroomStatus } from "../dto/ClassroomStatus";

import DateTimePicker from 'react-datetime-picker'
import '../style/DateTimePicker.css';
import '../style/Calendar.css';

export function Classroom() {
    const { tokenData } = useContext(TokenContext);

    const [classrooms, setClassrooms] = useState<ClassroomStatus[]>([]);

    const [dateTime, setDateTime] = useState(new Date());

    useEffect(() => {
        if (!dateTime) return; // dateTime è null se l'utente preme sulla X per cancellare la data. Soluzione migliore??
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
                <h1>🏫 Stato aule</h1>
                <DateTimePicker onChange={(value: any) => setDateTime(value)} value={dateTime} locale='it-IT' disableClock={true} autoFocus={true} />
            </div>
            <div className="flex-h align-left wrap">
                {
                    // Possibile problema: Se l'utente seleziona una data MOLTO, MOLTO PASSATA, tutte le aule si visualizzeranno come "Libere, fino alle 18:00".
                    // Non è possibile mettere un controllo per verificare se la data è passata, perchè il Backend ritorna indietro sempre qualcosa... (Si potrebbe verificare se la data di cambio dello stato è avanti di due/tre/quattro giorni rispetto alla data selezionata dall'utente, ma non è una soluzione molto elegante... e può dare fastidio alle feste e ai weekend...)
                    classrooms.map((item) => {
                        const status = item.status.isFree ? "🟢 Libera" : "🔴 Occupata";
                        let changeTime = "⌚ Fino alle ";

                        // Anche qui messo "... && dateTime" per evitare che dia errore se dateTime è null. Vedere commento linea 19...
                        if (item.status.statusChangeAt && dateTime && item.status.statusChangeAt.getDay() == dateTime.getDay())
                            changeTime += item.status.statusChangeAt.toLocaleString([], { hour: "2-digit", minute: "2-digit" });
                        else
                            changeTime += "18:00";

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
