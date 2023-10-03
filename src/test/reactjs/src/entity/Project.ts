import {entity} from "@src/reactbootdev/decorator/Entity";
import {SubProject} from "@src/entity/SubProject";
import BaseEntity from "@src/reactbootdev/entity/BaseEntity";

@entity
export class Project extends BaseEntity {
    id: number | null = null;
    name?: string
    description?: string
    startDate?: string
    endDate?: string

    testcol1a?: string
    testcol2a?: string
    testcol3a?: boolean
    testcol4a?: number
    testArray?: string[]
    testcol5a?: TestEnum
    testcol6a?: TestEnum[]

    subProject?: SubProject
    subProjectArray?: SubProject[]

}

export enum TestEnum {
    test1 = "test1",
    test2 = "test2",
    test3 = "test3",
}