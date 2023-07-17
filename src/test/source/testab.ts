import {Person, TestEnum} from "./test2";
import {column, entity} from "../decorator/decorator";



@entity
export class Address {

    @column({group: 'a'})
    street?: string;
    city?: string;
    postalCode?: number;
    aaa?: "aab" | "adf" | "3434";
    bbb?: TestEnum;

    // TODO :: 순환 오류 > generator 시에 > decorator naming 지정으로 recusive 제약 가능.
    // TODO :: 그럼에도 초과하면 오류로 알려주기.
    // reg?: Person;

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

