import {extractProperties} from "@src/reactbootdev/decorator/Property";

export default class BaseEntity {

    id: number | null = null;

    static extractProperties(): any {
        return extractProperties(this);
    }
}