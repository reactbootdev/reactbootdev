import "reflect-metadata";

export function entity(target: any) {
    Reflect.defineMetadata(ENTITY_MARKER_KEY, true, target);
    console.debug('@entity > ', target);
}


export const ENTITY_MARKER_KEY = Symbol('isEntity');
export const ENTITY_PROPERTIES_KEY = Symbol('entityProperties');

export function isEntity(target: Function): boolean {
    console.log(target)
    return !!Reflect.getMetadata(ENTITY_MARKER_KEY, target) || false;
}