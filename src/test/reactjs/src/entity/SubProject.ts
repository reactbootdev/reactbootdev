import {entity} from "src/reactbootdev/decorator/Entity";

@entity
export class SubProject {

    testcol1?: string
    testcol2?: string

}


export interface SubProjectInterface {

    testcol1: string
    testcol2: string

}


