import {entity} from "src/reactbootdev/decorator/Entity";
import {SubProject} from "src/entity/SubProject";
import BaseEntity from "src/reactbootdev/entity/BaseEntity";

@entity
export class Project extends BaseEntity {

    testcol1?: string
    testcol2?: string

    subProject?: SubProject

}