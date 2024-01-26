import { Card, CardHeader, Spinner, Title2, DataGrid, createTableColumn, DataGridBody, DataGridHeader, DataGridRow, DataGridCell, DataGridHeaderCell, TabList, Tab, Subtitle2 } from "@fluentui/react-components";
import { useGlobalStyles } from "../globalStyles";
import { useEffect, useState } from "react";
import { GradeDto, GradeGroupDto } from "../dto/GradeDto";
import useRequests from "../libraries/requests/requests";

export function Grade() {
    const requests = useRequests();
    const globalStyles = useGlobalStyles();

    const [groups, setGroups] = useState<GradeGroupDto[] | undefined>(undefined);
    const [selectedGroup, setSelectedGroup] = useState<GradeGroupDto | undefined>({ code: "PRI", displayName: "Primo Anno" });
    const [grades, setGrades] = useState<GradeDto[] | undefined>(undefined);

    useEffect(() => {
        requests.grade.groups()
            .then(g => new Promise<GradeGroupDto[]>(r => setTimeout(() => r(g), 100)))
            .then(setGroups)
    }, []);

    useEffect(() => {
        setGrades(undefined);

        if (selectedGroup !== undefined)
            requests.grade.forGroup(selectedGroup.code)
                .then(setGrades);
    }, [selectedGroup]);

    const dataGridColumns = [
        createTableColumn<GradeDto>({
            columnId: "moduleCode",
            compare: (a, b) => {
                return a.module.code.localeCompare(b.module.code);
            },
            renderHeaderCell: () => {
                return <Subtitle2>Codice modulo</Subtitle2>;
            },
            renderCell: (item) => {
                return item.module.code;
            },
        }),
        createTableColumn<GradeDto>({
            columnId: "moduleName",
            compare: (a, b) => {
                return a.module.name.localeCompare(b.module.name);
            },
            renderHeaderCell: () => {
                return <Subtitle2>Modulo</Subtitle2>;
            },
            renderCell: (item) => {
                return item.module.name;
            },
        }),
        createTableColumn<GradeDto>({
            columnId: "grade",
            compare: (a, b) => {
                const aGrade = a.grade === null ? 0 : a.grade;
                const bGrade = b.grade === null ? 0 : b.grade
                return aGrade - bGrade;
            },
            renderHeaderCell: () => {
                return <Subtitle2>Valutazione</Subtitle2>;
            },
            renderCell: (item) => {
                if (item.grade === null) {
                    return (<i>Nessuna valutazione</i>);
                } else {
                    return item.grade + " / " + 30;
                }
            },
        }),
    ];

    return (
        <>
            <div className={globalStyles.container}>
                <Card className={globalStyles.titleBar}>
                    <CardHeader
                        header={<Title2>💯 Voti</Title2>}
                        description={<Subtitle2>Visualizza i tuoi voti</Subtitle2>}
                    />
                    <TabList
                        disabled={groups === null}
                        selectedValue={selectedGroup ? selectedGroup.displayName : undefined}
                        onTabSelect={(_, option) => {
                            if (option.value === undefined)
                                setSelectedGroup(undefined);
                            else
                                setSelectedGroup(groups?.find(g => g.displayName === option.value));
                        }}
                    >
                        {groups !== undefined && groups.map(group => (
                            <Tab key={group.code} value={group.displayName}>{group.displayName}</Tab>
                        ))}
                    </TabList>
                </Card>
                <div className={globalStyles.list}>
                    {(selectedGroup !== undefined || grades !== undefined) && (
                        <Card className={globalStyles.card}>
                            {
                                grades === undefined ? (
                                    <Spinner size="huge" />
                                ) : (
                                    <DataGrid
                                        items={grades}
                                        columns={dataGridColumns}
                                        sortable
                                    >
                                        <DataGridHeader>
                                            <DataGridRow>
                                                {({ renderHeaderCell }) => (
                                                    <DataGridHeaderCell>{renderHeaderCell()}</DataGridHeaderCell>
                                                )}
                                            </DataGridRow>
                                        </DataGridHeader>
                                        <DataGridBody<GradeDto>>
                                            {({ item, rowId }) => (
                                                <DataGridRow<GradeDto>
                                                    key={rowId}
                                                >
                                                    {({ renderCell }) => (
                                                        <DataGridCell>{renderCell(item)}</DataGridCell>
                                                    )}
                                                </DataGridRow>
                                            )}
                                        </DataGridBody>
                                    </DataGrid>
                                )
                            }
                        </Card>
                    )}
                </div>
            </div>
        </>
    );
}
