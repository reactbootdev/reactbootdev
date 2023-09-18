import {entity} from "@src/reactbootdev/decorator/Entity";
import BaseEntity from "@src/reactbootdev/entity/BaseEntity";

@entity
export class SubProject extends BaseEntity {

    testcol1b?: string
    testcol2b?: string
    testcol3b?: boolean
    testcol4b?: number
    subStringArray?: string[]
    subNumberArray?: number[]

}

