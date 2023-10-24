import "reflect-metadata";
import {PRETTIER_DELIMITER} from "@src/reactbootdev/config/config";
import {getSymbolForEntity} from "@src/reactbootdev/decorator/Entity";

export function property(recursiveType?: any) {
    return (target: any, propertyKey: string): void => {

        const classType = target.constructor
        // const testType = Reflect.getMetadata("design:type", target, propertyKey);

        const symbol = getSymbolForEntity(classType);
        const existingProperties: Array<{
            name: string
            , type: any
        }> = Reflect.getMetadata(symbol, target) || [];

        existingProperties.push({
            name: propertyKey,
            type: recursiveType,
        });

        Reflect.defineMetadata(symbol, existingProperties, target);
    };
}
export function extractProperties(
    cls: any
    , parentName?: string
    , depth: number = 0
    , maxDepth: number = 99,
): any {
    let result: any = {};

    const properties: {
        name: string,
        type: any,
    }[] = Reflect.getMetadata(getSymbolForEntity(cls), cls.prototype) || [];
    depth++;
    if (depth > maxDepth) {
        throw new Error(`extractProperties() > maxDepth(${maxDepth}) exceeded!`);
        return result;
    }
    const delimiter = PRETTIER_DELIMITER; // "."

    for (let property of properties) {
        const fullName = parentName ? parentName + delimiter + property.name : property.name;
        if (property.type) {
            result[property.name] = extractProperties(property.type, fullName);
        } else {
            result[property.name] = fullName
        }
    }
    return result;
}
