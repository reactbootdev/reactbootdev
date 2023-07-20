import {entity} from "src/reactbootdev/decorator/Entity";
import {SubProject} from "src/entity/SubProject";

@entity
export class Project {

    testcol1?: string
    testcol2?: string

    subProject?: SubProject

}