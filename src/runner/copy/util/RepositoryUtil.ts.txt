import BaseEntity from "@src/reactbootdev/entity/BaseEntity";
import {DOUBLE_NAME_DELIMITER, NAME_DELIMITER, PRETTIER_DELIMITER} from "@src/reactbootdev/config/config";
import {produce} from "immer";
import {ObjectType, ObjectTypeEnum} from "@src/reactbootdev/interface/TaskBeansType";
import BaseRepository from "@src/reactbootdev/repository/BaseRepository";
import {BoxProps} from "@mui/material";

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
            return {...item, ...newItem};
        }
        return item;
    });
    return updatedList;
};


export interface ResultObject {
    [key: string]: string | ResultObject;
}

export function createObjectStructure(
    obj: any, parentKey = '', depth = 0, maxDepth = 5
): ResultObject {
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


export const getByDelimiterKey = <T extends BaseEntity>(
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
    const result = {...obj};
    let current: any = result;
    for (let i = 0; i < keys.length - 1; i++) {
        const key = keys[i];
        current[key] = {...current[key]};
        current = current[key];
    }
    return current[keys[keys.length - 1]]
}

export const updateByDelimiterKeyForArray = <T extends BaseEntity>(
    list: T[],
    idx: number,
    newValue: unknown,
    multiKeys: string,
): T[] => {
    if (multiKeys === "") {
        const newItem = newValue as T
        return [newItem];
    }

    multiKeys = multiKeys.split(PRETTIER_DELIMITER).join(NAME_DELIMITER)
    if (list.length === 0) {
        const newItem = createOrSetPropertyForArray({} as T, multiKeys, newValue);
        return [newItem];
    }

    const updatedList = list.map((item, listIdx) => {
        if (listIdx === idx) {
            const newItem = createOrSetPropertyForArray(item, multiKeys, newValue);
            return newItem;
        }
        return item;
    });
    return updatedList;
}


export function updateNestedProperty<T, K extends keyof T>(
    obj: T,
    keys: string[],
    value: unknown
): T {
    const result = {...obj};
    let current: any = result;
    for (let i = 0; i < keys.length - 1; i++) {
        const key = keys[i];
        current[key] = {...current[key]};
        current = current[key];
    }
    current[keys[keys.length - 1]] = value;
    return result;
}

export function updateNestedPropertyForArray<T, K extends keyof T>(
    draft: T,
    keys: string[],
    value: unknown
): T {
    const result = {...draft};
    let current: any = result;
    for (let i = 0; i < keys.length - 1; i++) {
        const key = keys[i];

        if (i === keys.length - 2) {
            const currentKey = current[key]
            if (Array.isArray(currentKey)) {
                current[key] = [...current[key]]

                if (typeof value === `undefined`) {
                    current[key][keys[keys.length - 1]] = undefined
                    current[key] = [...(current[key].filter((v: undefined) => v !== undefined))]
                    return result
                }
                current = current[key];
                break
            }
        }

        current[key] = {...current[key]};
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
        const newObj = {[key]: value} as T;
        return newObj;
    }

    const newObj = Object.assign({}, obj);
    const keys = key.split(NAME_DELIMITER).filter((key) => key.length > 0)

    return produce(newObj, (draft) => {
        return updateNestedProperty(draft, keys, value);
    });
}

export function createOrSetPropertyForArray<T, K extends keyof T>(
    obj: T | undefined,
    key: string,
    value: unknown
): T {
    if (!obj) {
        const newObj = {[key]: value} as T;
        return newObj;
    }

    const newObj = Object.assign({}, obj);
    const keys = key.split(NAME_DELIMITER).filter((key) => key.length > 0)

    return produce(newObj, (draft) => {
        return updateNestedPropertyForArray(draft, keys, value);
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
        if (isReferenceNode) {
            totalParentKey = `${totalParentKey}${NAME_DELIMITER}${subObjKey}`
            result = extractEntityKey(subObj.referenceNode, subObjKey, totalParentKey, result, depth + 1, maxDepth)
            return result
        }

        result = extractEntityKey(subObj, subObjKey, totalParentKey, result, depth + 1, maxDepth)
        return result
    })

    return result
}

export function prettierKey(ressult?: any){
    if (typeof ressult === 'undefined') {
        return undefined
    }
    return ressult.split(NAME_DELIMITER).filter((v: string | any[]) => v.length > 0)
        .splice(1)
        .join(PRETTIER_DELIMITER)
}

export type RecursiveObject = {
    [key: string]: string | RecursiveObject;
};

export function transform(obj: RecursiveObject): RecursiveObject {
    const newObj: RecursiveObject = {};

    for (const key in obj) {
        if (typeof obj[key] === 'string') {
            newObj[key] = prettierKey(obj[key]);
        } else {
            newObj[key] = transform(obj[key] as RecursiveObject);
        }
    }

    return newObj;
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



export function extractEntityType(
    // obj: ObjectType,
    obj: any,
    myKey: string,
    totalParentKey: string = ``,
    result: any = {},
    depth: number = 0,
    maxDepth: number = 100
) {
    const value = obj.realType

    if (depth > maxDepth) {
        result = createOrSetPropertyForTypeByFullkey(result, totalParentKey, value)
        return result
    }

    const isEnum = obj?.referenceNode?.type === ObjectTypeEnum.ENUM
    const isDataOwned = obj.data !== undefined
    if (!isDataOwned) {
        if (typeof value === 'string') {
            const values = value.split('|')
            const newRealType =
                values.includes('string') ? String :
                    values.includes('number') ? Number :
                        values.includes('boolean') ? Boolean :
                            values.includes('any') ? String :
                                undefined

            class anonymousClass {
                defaultValue
                value

                constructor() {
                    this.value = newRealType
                    this.defaultValue = newRealType ? newRealType() : undefined
                }
            }

            result = createOrSetPropertyForTypeByFullkey(result, totalParentKey, anonymousClass)
            return result
        }

        if (isEnum) {
            class anonymousClass {
                defaultValue
                value

                constructor() {
                    this.value = value
                    this.defaultValue = Object.values(value).shift()
                }
            }

            result = createOrSetPropertyForTypeByFullkey(result, totalParentKey, anonymousClass)
            return result
        }

        result = createOrSetPropertyForTypeByFullkey(result, totalParentKey, value)
        return result
    }

    Object.entries(obj.data).map((entry: [string, any]) => {
        const [subObjKey, subObj] = entry;
        const isReferenceNode = subObj.referenceNode !== undefined
        const newTotalParentKey = `${totalParentKey}${NAME_DELIMITER}${subObjKey}`

        result = extractEntityType(subObj, subObjKey, newTotalParentKey, result, depth + 1, maxDepth)

        if (isReferenceNode) {
            result = extractEntityType(subObj.referenceNode, subObjKey, newTotalParentKey, result, depth + 1, maxDepth)
            return result
        }

        return result
    })

    return result
}

export function createOrSetPropertyForTypeByFullkey<T, K extends keyof T>(
    result: any,
    key: string,
    value: unknown
): any {
    const keys = key.split(NAME_DELIMITER).filter((key) => key.length > 0)
    result[keys.join(NAME_DELIMITER)] = value
    return result
}

export function getFlattenObj<T extends BaseEntity>(readListEntityList: T[]) {
    const flattenObj = readListEntityList.map((entity) => {
        return Object.entries(flattenBaseEntity(entity)).map(([key, value]) => {
            return {
                fullKey: key,
                value: value,
            }
        })
    })
    return flattenObj
}

export function flattenBaseEntity<T extends BaseEntity>(obj: T, objName: string | undefined = undefined) {
    const flattened: Record<string, any> = {}

    if (typeof obj === 'undefined') {
        return flattened
    }

    Object.entries(obj).map(([propertyName, propertyInfo]) => {
        if (propertyInfo === null) {
            return flattened
        }

        const flattenedKey =
            typeof objName !== 'undefined' ? `${objName}${NAME_DELIMITER}${propertyName}` : propertyName

        if (isPrimtiveType(typeof propertyInfo)) {
            flattened[flattenedKey] = String(propertyInfo)
        } else {
            Object.assign(flattened, flattenBaseEntity(propertyInfo, `${flattenedKey}`))
        }
    })

    return flattened
}

export function isCanOutputType(type: string | undefined) {
    if (typeof type === 'undefined') {
        return false
    }
    return type !== 'object' && type !== 'undefined'
}

export enum TableDataForArrayType {
    NUMBER = "NUMBER",
    STRING = "STRING",
    BOOLEAN = "BOOLEAN",

    ARRAY = "ARRAY",
    OBJECT = "OBJECT",
}

export function convertTableDataForArrayType(obj: any) {
    if (Array.isArray(obj)) {
        return TableDataForArrayType.ARRAY
    } else if (typeof obj === 'undefined') {
        return TableDataForArrayType.STRING
    } else if (typeof obj === 'number') {
        return TableDataForArrayType.NUMBER
    } else if (typeof obj === 'string') {
        return TableDataForArrayType.STRING
    } else if (typeof obj === 'boolean') {
        return TableDataForArrayType.BOOLEAN
    } else if (typeof obj === 'object') {
        return TableDataForArrayType.OBJECT
    } else {
        return TableDataForArrayType.STRING
    }
}

export interface TableDataForArray {
    fullKey: string,
    shortKey: string,
    type?: string,
    realType?: any,
    value?: object,
    valueString?: string,
    tableData?: TableDataForArray[];
    addFunction?: (value: any) => (e: any) => void;
    removeFunction?: (value: any) => (e: any) => void;
    updateFunction?: (value: any) => (e: any) => void;
}

export function exploreForEachTableData(data: TableDataForArray[], callback: (item: TableDataForArray) => void) {
    for (const item of data) {
        callback(item);

        if (item.tableData) {
            exploreForEachTableData(item.tableData, callback);
        }
    }
}

export function transposeMatrix(matrix: any[][]) {
    if (!matrix.length) {
        return [];
    }
    const numRows = matrix.length;
    const numCols = matrix[0].length;

    const transposedMatrix: any[] = [];

    for (let j = 0; j < numCols; j++) {
        const newRow: any[] = [];
        for (let i = 0; i < numRows; i++) {
            newRow.push(matrix[i][j]);
        }
        transposedMatrix.push(newRow);
    }

    return transposedMatrix;
}

export function extractShortKeyFromLongKey(longKey: string) {
    const shortKey = longKey.split(NAME_DELIMITER).slice(-1)[0]
    return shortKey
}

export function prettierLongKey(longKey: string) {
    const prettierLongKey = longKey.replaceAll(NAME_DELIMITER, PRETTIER_DELIMITER)
    return prettierLongKey
}

export function removeFirstElementFromKey(longKey: string) {
    const refinedKey = longKey.split(NAME_DELIMITER).slice(1).join(NAME_DELIMITER)
    return refinedKey
}

export type BoxPropsExt = BoxProps & {
    tooltiptext: string
}

export type StringOutputValueType = string | string[]

export function isPrimtiveType(type: string) {
    return type === 'string' || type === 'number' || type === 'boolean'
}
