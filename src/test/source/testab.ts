import {Person, TestEnum} from "./testab2";
import {column} from "../../runner/copy/decorator/Column";
import {entity} from "../../runner/copy/decorator/Entity";


@entity
export class Address {

    @column({group: 'a'})
    street?: string;
    city?: string;
    postalCode?: number;
    aaa?: "aab" | "adf" | "3434";
    bbb?: TestEnum;

    testtest?: {
        a: number
        bc: string
    };


    constructor(address: Partial<Address>) {
        Object.assign(this, address);
    }

}

@entity
class Company {
    persons?: Person[];

}

