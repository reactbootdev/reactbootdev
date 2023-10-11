import "reflect-metadata";
import {ENTITY_PROPERTIES_KEY} from "@src/reactbootdev/decorator/Entity";
import {PRETTIER_DELIMITER} from "@src/reactbootdev/config/config";

export function property(recursiveType?: any) {
    return (target: any, propertyKey: string): void => {
        const existingProperties: Array<{
            name: string
            , type: any
        }> = Reflect.getMetadata(ENTITY_PROPERTIES_KEY, target) || [];

        const testType = Reflect.getMetadata("design:type", target, propertyKey);

        existingProperties.push({
            name: propertyKey,
            type: recursiveType,
        });

        Reflect.defineMetadata(ENTITY_PROPERTIES_KEY, existingProperties, target);
    };
}

export function extractProperties(
    cls: any
    , parentName?: string,
): any {
    let result: any = {};
    const properties: {
        name: string,
        type: any,
    }[] = Reflect.getMetadata(ENTITY_PROPERTIES_KEY, cls.prototype) || [];
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