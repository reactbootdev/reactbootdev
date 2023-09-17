import BaseEntity from "@src/reactbootdev/entity/BaseEntity";
import {DOUBLE_NAME_DELIMITER, NAME_DELIMITER} from "@src/reactbootdev/config/config";
import {produce} from "immer";
import {ObjectType} from "@src/reactbootdev/interface/TaskBeansType";
import {entityBeans, entityImportMap} from "@src/reactbootdev/data/EntityBean";

export const addItem = <T extends BaseEntity>(list: T[], newItem: T): T[] => {
    return [...list, newItem];
};
export const addItems = <T extends BaseEntity>(list: T[], newItems: T[]): T[] => {
    return [...list, ...newItems];
};
export const setItem = <T extends BaseEntity>(list: T[], newItem: T): T[] => {
    return [newItem];
}
export const setItems = <T extends BaseEntity>(list: T[], newItems: T[]): T[] => {
    return [...newItems];
}
export const deleteItem = <T extends BaseEntity>(list: T[], itemId: number): T[] => {
    return list.filter(item => item.id !== itemId);
};
export const updateItem = <T extends BaseEntity>(list: T[], itemId: number, newItem: T): T[] => {
    const updatedList = list.map(item => {
        if (item.id === itemId) {
            return { ...item, ...newItem };
        }
        return item;
    });
    return updatedList;
};


export interface ResultObject {
    [key: string]: string | ResultObject;
}


export function  getEntityKey<T extends BaseEntity>
(classType: new () => T) : ResultObject {
    const classInstance= new classType() as T;
    console.log(`classInstance: ${classInstance}`, classInstance)

    console.log( classInstance.constructor.name)
    const structure = createObjectStructure(classInstance)
    return structure;
}

export function createObjectStructure(
    obj: any, parentKey = '', depth = 0, maxDepth = 5
) : ResultObject {
    if (depth > maxDepth) {
        throw new Error("Maximum call stack size exceeded ")
    }

    const result: ResultObject = {};
    const visitedObjects = new WeakSet();

    for (const key in obj) {
        if (!obj.hasOwnProperty(key)) {
            continue;
        }

        const fullPath = parentKey ? `${parentKey}.${key}` : key;

        if (typeof obj[key] === 'object' && obj[key] !== null) {
            if (visitedObjects.has(obj[key])) {
                result[key] = "Circular reference detected";
            } else {
                visitedObjects.add(obj[key]);
                result[key] = createObjectStructure(obj[key], fullPath, depth + 1, maxDepth);
            }
        } else {
            result[key] = fullPath;
        }
    }

    return result;
}


export const getByDelimiterKey = <T extends BaseEntity> (
    list: T[],
    idx: number,
    multiKeys: string,
) => {
    let keys = multiKeys.split(NAME_DELIMITER);
    let result: unknown = undefined;
    const item = list[idx];
    result = getNestedProperty(item, keys);

    return result
}


export function getNestedProperty<T, K extends keyof T>(
    obj: T,
    keys: string[]
) {
    const result = { ...obj };
    let current: any = result;
    for (let i = 0; i < keys.length - 1; i++) {
        const key = keys[i];
        current[key] = { ...current[key] };
        current = current[key];
    }
    return current[keys[keys.length - 1]]
}


export const updateByDelimiterKey =  <T extends BaseEntity> (
    list: T[],
    idx: number,
    newValue: unknown,
    multiKeys: string,
): T[] => {

    if (list.length === 0) {
        const newItem = createOrSetProperty({} as T, multiKeys, newValue);
        return [newItem];
    }

    const updatedList = list.map((item, listIdx) => {
        if (listIdx === idx) {
            const newItem = createOrSetProperty(item, multiKeys, newValue);
            return newItem;
        }
        return item;
    });
    return updatedList;
}


// Helper export function to update nested properties safely
export function updateNestedProperty<T, K extends keyof T>(
    obj: T,
    keys: string[],
    value: unknown
): T {
    const result = { ...obj };
    let current: any = result;
    for (let i = 0; i < keys.length - 1; i++) {
        const key = keys[i];
        current[key] = { ...current[key] };
        current = current[key];
    }
    current[keys[keys.length - 1]] = value;
    return result;
}

export function createOrSetProperty<T, K extends keyof T>(
    obj: T | undefined,
    key: string,
    value: unknown
): T {
    if (!obj) {
        // If obj is undefined, create a new object with the property and return it.
        const newObj = { [key]: value } as T;
        return newObj;
    }

    // plain object
    const newObj = Object.assign({}, obj);

    // If obj exists, ensure key is a string and then split it to set the nested property.
    // remove empty string
    const keys = key.split(NAME_DELIMITER).filter((key) => key.length > 0)

    // Use the helper export function to update the nested property safely
    return produce(newObj, (draft) => {
        return updateNestedProperty(draft, keys, value);
    });
}



export function extractEntityKey(
    obj: ObjectType,

    myKey: string,
    totalParentKey: string = ``,

    result: any = {},

    depth: number = 0,
    maxDepth: number = 10
) {
    const totalKey = `${totalParentKey}${NAME_DELIMITER}${myKey}`
        .split(NAME_DELIMITER)
        .filter(v => v.length > 0)
        .join(NAME_DELIMITER)

    if (depth > maxDepth) {
        result = createOrSetProperty(result, totalKey, totalKey)
        return result
    }

    const isDataOwned = obj.data !== undefined
    if (!isDataOwned) {
        result = createOrSetProperty(result, totalKey, totalKey)
        return result
    }

    Object.entries(obj.data).map((entry) => {
        const [subObjKey, subObj] = entry;
        const isReferenceNode = subObj.referenceNode !== undefined
        if(isReferenceNode) {
            totalParentKey = `${totalParentKey}${NAME_DELIMITER}${subObjKey}`
            result = extractEntityKey(subObj.referenceNode, subObjKey, totalParentKey, result, depth + 1, maxDepth)
            return result
        }

        result = extractEntityKey(subObj, subObjKey, totalParentKey, result, depth + 1, maxDepth)
        return result
    })

    return result
}

export function extractEntityKeyWithFullPath(result : any = {}, parentKey: string, depth : number = 0, maxDepth : number = 5) {
    Object.entries(entityBeans).map((entry) => {
        const [fullFilePath, fileDetail] = entry;
        const objects = fileDetail.objects
        Object.entries(objects).map((entry) => {
            const [objectName, objectDetail] = entry;
            const newFileNameQentity = `${fullFilePath}${DOUBLE_NAME_DELIMITER}${objectName}`

            result[newFileNameQentity] = extractEntityKey(objectDetail, objectName, objectName)
        })

    })
    return result
}

export function getEntitiKeyByType<T extends BaseEntity>(entityType : new () => T) : T {
    const result = extractEntityKeyWithFullPath({}, "")
    const toFind = Object.entries(entityImportMap).filter((entry) => {
        const [key, value] = entry

        return value === entityType
    })
    if (toFind.length === 0) {
        throw new Error(`entityType not found in entityImportMap`)
    }
    const toFindKey = toFind[0][0]

    const entityKeyMap = result[toFindKey]

    return mergeSubObjects(entityKeyMap) as T
}

export function mergeSubObjects(obj: any): any {
    const result: any = {};

    for (const key in obj) {
        if (typeof obj[key] === 'object' && obj[key] !== null) {
            Object.assign(result, obj[key]);
        }
    }

    return result;
}




export function getEntitiTypeyByType<T extends BaseEntity>(entityType : new () => T) : T {
    const result = extractEntityTypeWithFullPath({}, "")
    const toFind = Object.entries(entityImportMap).filter((entry) => {
        const [key, value] = entry

        return value === entityType
    })
    if (toFind.length === 0) {
        throw new Error(`entityType not found in entityImportMap`)
    }
    const toFindKey = toFind[0][0]

    const entityKeyMap = result[toFindKey]

    return mergeSubObjects(entityKeyMap) as T
}

export function extractEntityTypeWithFullPath(result : any = {}, parentKey: string, depth : number = 0, maxDepth : number = 5) {
    Object.entries(entityBeans).map((entry) => {
        const [fullFilePath, fileDetail] = entry;
        const objects = fileDetail.objects
        Object.entries(objects).map((entry) => {
            const [objectName, objectDetail] = entry;
            const newFileNameQentity = `${fullFilePath}${DOUBLE_NAME_DELIMITER}${objectName}`

            result[newFileNameQentity] = extractEntityType(objectDetail, objectName, objectName)
        })

    })
    return result
}


export function extractEntityType(
    // obj: ObjectType,
    obj: any,

    myKey: string,
    totalParentKey: string = ``,

    result: any = {},

    depth: number = 0,
    maxDepth: number = 10
) {
    const totalKey = `${totalParentKey}${NAME_DELIMITER}${myKey}`
        .split(NAME_DELIMITER)
        .filter(v => v.length > 0)
        .join(NAME_DELIMITER)

    const value = {
        totalKey: totalKey,
        type: obj.type,
        isArray: obj.isArray,
    }

    if (depth > maxDepth) {
        result = createOrSetPropertyForType(result, totalKey, value)
        return result
    }

    const isDataOwned = obj.data !== undefined
    if (!isDataOwned) {
        result = createOrSetPropertyForType(result, totalKey, value)
        return result
    }

    Object.entries(obj.data).map((entry : [string, any]) => {
        const [subObjKey, subObj] = entry;
        const isReferenceNode = subObj.referenceNode !== undefined
        if(isReferenceNode) {
            totalParentKey = `${totalParentKey}${NAME_DELIMITER}${subObjKey}`
            result = extractEntityType(subObj.referenceNode, subObjKey, totalParentKey, result, depth + 1, maxDepth)
            return result
        }

        result = extractEntityType(subObj, subObjKey, totalParentKey, result, depth + 1, maxDepth)
        return result
    })

    return result
}
export function createOrSetPropertyForType<T, K extends keyof T>(
    obj: T | undefined,
    key: string,
    value: unknown
): T {
    if (!obj) {
        // If obj is undefined, create a new object with the property and return it.
        const newObj = { [key]: value } as T;
        return newObj;
    }

    // plain object
    const newObj = Object.assign({}, obj);

    // If obj exists, ensure key is a string and then split it to set the nested property.
    // remove empty string
    const keys = key.split(NAME_DELIMITER).filter((key) => key.length > 0)

    // Use the helper export function to update the nested property safely
    return produce(newObj, (draft) => {
        return updateNestedPropertyForType(draft, keys, value);
    });
}

// Helper export function to update nested properties safely
export function updateNestedPropertyForType<T, K extends keyof T>(
    obj: T,
    keys: string[],
    value: unknown
): T {
    const result = { ...obj };
    let current: any = result;
    for (let i = 0; i < keys.length - 1; i++) {
        const key = keys[i];
        current[key] = { ...current[key] };
        current = current[key];
    }
    current[keys[keys.length - 1]] = value;
    return result;
}