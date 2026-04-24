/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { StudentRequest } from './StudentRequest';
import type { SupervisorRequest } from './SupervisorRequest';
export type SubmitProjectRequest = {
    semesterId: string;
    englishName: string;
    vietnameseName: string;
    abbreviation?: string | null;
    isResearchProject?: boolean;
    isEnterpriseProject?: boolean;
    context?: string | null;
    proposedSolutions?: string | null;
    functionalRequirements?: string | null;
    nonFunctionalRequirements?: string | null;
    theoryAndPractice?: string | null;
    products?: string | null;
    proposedTasks?: string | null;
    className?: string | null;
    durationFrom?: string | null;
    durationTo?: string | null;
    profession?: string | null;
    specialty?: string | null;
    registerKind?: string | null;
    supervisors?: Array<SupervisorRequest> | null;
    students?: Array<StudentRequest> | null;
};

