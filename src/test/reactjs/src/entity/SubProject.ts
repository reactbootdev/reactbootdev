import {entity} from "@src/reactbootdev/decorator/Entity";
import BaseEntity from "@src/reactbootdev/entity/BaseEntity";

@entity
export class SubProject extends BaseEntity {

    testcol1b?: string
    testcol2b?: string
    subStringArray?: string[]
    subNumberArray?: number[]

    constructor() {
        super();
        this.id = Math.random()
        this.testcol1b = "con1"
        this.testcol2b = "con2"
        this.subStringArray = ["con1", "con2"]

    }
}

