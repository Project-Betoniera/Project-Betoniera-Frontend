import { ModuleDto } from "./ModuleDto";

/**
 * Contains information about a grade.
 */
export type GradeDto = {
    /**
     * The module this grade belongs to.
     */
    module: ModuleDto,
    grade: number | null,
};

export type GradeGroupDto = {
    code: string;
    displayName: string;
};
