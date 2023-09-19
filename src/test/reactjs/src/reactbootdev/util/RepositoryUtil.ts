import BaseEntity from "@src/reactbootdev/entity/BaseEntity";
import {DOUBLE_NAME_DELIMITER, NAME_DELIMITER} from "@src/reactbootdev/config/config";
import {produce} from "immer";
import {ObjectType} from "@src/reactbootdev/interface/TaskBeansType";
import {entityBeans, entityImportMap} from "@src/reactbootdev/data/EntityBean";
import BaseRepository from "@src/reactbootdev/repository/BaseRepository";
import {extractShortKeyFromLongKey, isPrimtiveType} from "@src/reactbootdev/component/BaseComponentManager";

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


export function getEntityKey<T extends BaseEntity>
(classType: new () => T): ResultObject {
    const classInstance = new classType() as T;
    console.log(`classInstance: ${classInstance}`, classInstance)

    console.log(classInstance.constructor.name)
    const structure = createObjectStructure(classInstance)
    return structure;
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


export const updateByDelimiterKey = <T extends BaseEntity>(
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

export const updateByDelimiterKeyForArray = <T extends BaseEntity>(
    list: T[],
    idx: number,
    newValue: unknown,
    multiKeys: string,
): T[] => {

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


// Helper export function to update nested properties safely
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


// Helper export function to update nested properties safely
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
            current[key] = [...current[key]]
            if (typeof value === `undefined`) {
                current[key][keys[keys.length - 1]] = undefined
                current[key] = [...(current[key].filter((v: undefined) => v !== undefined))]
                return result
            }
            current = current[key];
            break
        }
        current[key] = {...current[key]};
        current = current[key];
    }
    current[keys[keys.length - 1]] = value;
    // current = Array.from(Object.values(current)).slice(0, -1);

    // current.push(value);
    // current = Array.from(Object.values(current));

    return result;
}

export function createOrSetProperty<T, K extends keyof T>(
    obj: T | undefined,
    key: string,
    value: unknown
): T {
    if (!obj) {
        // If obj is undefined, create a new object with the property and return it.
        const newObj = {[key]: value} as T;
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

export function createOrSetPropertyForArray<T, K extends keyof T>(
    obj: T | undefined,
    key: string,
    value: unknown
): T {
    if (!obj) {
        // If obj is undefined, create a new object with the property and return it.
        const newObj = {[key]: value} as T;
        return newObj;
    }

    // plain object
    const newObj = Object.assign({}, obj);

    // If obj exists, ensure key is a string and then split it to set the nested property.
    // remove empty string
    const keys = key.split(NAME_DELIMITER).filter((key) => key.length > 0)

    // Use the helper export function to update the nested property safely
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

export function extractEntityKeyWithFullPath(result: any = {}, parentKey: string, depth: number = 0, maxDepth: number = 5) {
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

export function getEntitiKeyByType<T extends BaseEntity>(entityType: new () => T): T {
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


export function getEntityTypeyByType<T extends BaseEntity>(entityType: new () => T): T {
    const result = extractEntityTypeWithFullPath({}, "")
    console.log(`getEntityTypeyByType: ${result}`)
    console.log(result)
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

export function extractEntityTypeWithFullPath(result: any = {}, parentKey: string, depth: number = 0, maxDepth: number = 5) {
    Object.entries(entityBeans).map(([fullFilePath, fileDetail]) => {
        const objects = fileDetail.objects
        Object.entries(objects).map(([objectName, objectDetail]) => {
            const newFileNameQEntity = `${fullFilePath}${DOUBLE_NAME_DELIMITER}${objectName}`
            console.log(`newFileNameQEntity: ${newFileNameQEntity}`)
            console.log(newFileNameQEntity)

            result[newFileNameQEntity] = extractEntityType(objectDetail, objectName, objectName)
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
    maxDepth: number = 100
) {
    const totalKey = `${totalParentKey}${NAME_DELIMITER}${myKey}`
        .split(NAME_DELIMITER)
        .filter(v => v.length > 0)
        .join(NAME_DELIMITER)

    // const value = {
    //     totalKey: totalKey,
    //     type: obj.type,
    //     isArray: obj.isArray,
    //     realType: obj.realType,
    // }
    const value = obj.realType

    if (depth > maxDepth) {
        result = createOrSetPropertyForType(result, totalParentKey, value)
        return result
    }

    const isDataOwned = obj.data !== undefined
    if (!isDataOwned) {
        result = createOrSetPropertyForType(result, totalParentKey, value)
        return result
    }

    Object.entries(obj.data).map((entry: [string, any]) => {
        const [subObjKey, subObj] = entry;
        const isReferenceNode = subObj.referenceNode !== undefined
        const newTotalParentKey = `${totalParentKey}${NAME_DELIMITER}${subObjKey}`
        if (isReferenceNode) {
            result = extractEntityType(subObj.referenceNode, subObjKey, newTotalParentKey, result, depth + 1, maxDepth)
            return result
        }

        result = extractEntityType(subObj, subObjKey, newTotalParentKey, result, depth + 1, maxDepth)
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
        const newObj = {[key]: value} as T;
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

export function getFlattenObjForArray<T extends BaseEntity>(baseRepository: BaseRepository<T>): TableDataForArray[] {
    console.log(`baseRepository.entityList`)
    console.log(baseRepository.entityList)
    const baseEntityList = baseRepository.entityList
    const flattenObj = baseEntityList.map((entity: T, idx: number) => {
        return flattenBaseEntityForArray(baseRepository, entity, String(idx))
    }).filter((entity: T) => typeof entity !== 'undefined') as TableDataForArray[]
    return flattenObj
}

// TODO :: 01 :: remove Element
// TODO :: 02 :: add Element
// TODO :: 03 :: update Element

export function flattenBaseEntityForArray<T extends BaseEntity>(
    baseRepository: BaseRepository<T>
    , obj: T
    , objName: string
): TableDataForArray | undefined {

    if (typeof obj === 'undefined') {
        return undefined
    }

    if (isPrimtiveType(typeof obj)) {
        // Case 01 :: Primtive Type
        const tableData: TableDataForArray = {
            fullKey: objName,
            shortKey: extractShortKeyFromLongKey(objName),
            type: convertTableDataForArrayType(obj),
            value: obj,
            valueString: String(obj),
            tableData: undefined,
            updateFunction: function (value: any) {
                return function (e) {
                    console.log(`### updateFunction`, objName, value)
                    const entityNumber = objName.split(NAME_DELIMITER).filter((v) => v.length > 0).shift()
                    const entityNumberInt = Number(entityNumber)
                    const entityKey = objName
                        .split(NAME_DELIMITER)
                        .filter((v, index) => index > 0 && v.length > 0)
                        .join(NAME_DELIMITER)
                    console.log(`entityNumber: ${entityNumber}, entityKey: ${entityKey}`)
                    baseRepository.updateEntityByDelimiterKey(entityNumberInt, value, entityKey)
                }
            },
            removeFunction: (idx: number) => (e) => {
                const entityNumber = objName.split(NAME_DELIMITER).filter((v) => v.length > 0).shift()
                if (entityNumber === undefined) {
                    console.error(`entityNumber === undefined`)
                    return
                }
                const entityKey = objName
                    .split(NAME_DELIMITER)
                    .filter((v, index) => index > 0 && v.length > 0)
                    .join(NAME_DELIMITER)
                console.log(`entityNumber: ${idx}, entityKey: ${entityKey}`)
                // TODO :: deleteBydelimiterKey 구현
                baseRepository.updateEntityByDelimiterKeyForArray(Number(entityNumber), undefined, entityKey)
            }
        }
        return tableData
    }

    const mainTableData: TableDataForArray[] = Object.entries(obj).map(([propertyName, propertyInfo]) => {
        if (propertyInfo === null) {
            return undefined
        }

        const flattenedKey =
            typeof objName !== 'undefined' ? `${objName}${NAME_DELIMITER}${propertyName}` : propertyName


        if (isPrimtiveType(typeof propertyInfo)) {
            // Case 01 :: Primtive Type
            const tableData: TableDataForArray = {
                fullKey: flattenedKey,
                shortKey: extractShortKeyFromLongKey(flattenedKey),
                type: convertTableDataForArrayType(propertyInfo),
                value: propertyInfo,
                valueString: String(propertyInfo),
                tableData: undefined,
                updateFunction: function (value: any) {
                    return function (e) {
                        console.log(`### updateFunction`, flattenedKey, value)
                        const entityNumber = flattenedKey.split(NAME_DELIMITER).filter((v) => v.length > 0).shift()
                        const entityNumberInt = Number(entityNumber)
                        const entityKey = flattenedKey
                            .split(NAME_DELIMITER)
                            .filter((v, index) => index > 0 && v.length > 0)
                            .join(NAME_DELIMITER)
                        console.log(`entityNumber: ${entityNumber}, entityKey: ${entityKey}`)
                        baseRepository.updateEntityByDelimiterKey(entityNumberInt, value, entityKey)
                    }
                },

                removeFunction: (idx: number) => (e) => {
                    console.log(`### removeFunction`, flattenedKey)
                    const entityNumber = flattenedKey.split(NAME_DELIMITER).filter((v) => v.length > 0).shift()
                    if (entityNumber === undefined) {
                        console.error(`entityNumber === undefined`)
                        return
                    }
                    const entityKey = flattenedKey
                        .split(NAME_DELIMITER)
                        .filter((v, index) => index > 0 && v.length > 0)
                        .join(NAME_DELIMITER)
                    console.log(`entityNumber: ${idx}, entityKey: ${entityKey}`)
                    // TODO :: deleteBydelimiterKey 구현
                    baseRepository.updateEntityByDelimiterKey(Number(entityNumber), undefined, entityKey)
                }
            }
            return tableData
        } else if (Array.isArray(propertyInfo)) {
            // Case 02 :: Array Type
            const subTableData = propertyInfo.map((entity, idx) => {
                const subFlattenedKey = `${flattenedKey}${NAME_DELIMITER}${idx}`
                return flattenBaseEntityForArray(baseRepository, entity, subFlattenedKey)
            }).filter((entity) => typeof entity !== 'undefined') as TableDataForArray[]

            const tableData: TableDataForArray = {
                fullKey: flattenedKey,
                shortKey: extractShortKeyFromLongKey(flattenedKey),
                type: TableDataForArrayType.ARRAY,
                value: undefined,
                valueString: String(undefined),
                tableData: subTableData,
                addFunction: (value: any) => (e) => {
                    console.log(`### addFunction`)
                    const entityNumber = flattenedKey.split(NAME_DELIMITER).filter((v) => v.length > 0).shift()
                    const entityNumberInt = Number(entityNumber)
                    const entityKey = flattenedKey
                        .split(NAME_DELIMITER)
                        .filter((v, index) => index > 0 && v.length > 0)
                        .join(NAME_DELIMITER)
                    console.log(`entityNumber: ${entityNumber}, entityKey: ${entityKey}`)
                    console.log(
                        baseRepository.getValueById(entityNumberInt, entityKey)
                    )
                    const entityArray =
                        baseRepository.getValueById(entityNumberInt, entityKey) as T[]
                    const entityArrayLength = entityArray.length


                    const entityTypeMap = baseRepository.getEntityType()
                    const entityFlattenTypeMap = baseRepository.getFlattenEntityType()

                    console.log(`realType: ${entityKey}`)
                    console.log(entityTypeMap)
                    console.log(entityFlattenTypeMap)

                    if (entityFlattenTypeMap[entityKey] === undefined) {
                        console.error(`entityFlattenTypeMap['${entityKey}'] === undefined`)
                    }

                    // const realType = baseRepository.getFlattenEntityType()[entityKey].realType as new () => T
                    //
                    //
                    // const realTypeInstance = new realType()
                    // TODO :: implement add function > default value
                    const realTypeInstance = String()

                    //
                    // // TODO :: implement add function > default value
                    // baseRepository.addEntity(realTypeInstance)
                    baseRepository.updateEntityByDelimiterKeyForArray(
                        entityNumberInt
                        , realTypeInstance
                        , `${entityKey}${NAME_DELIMITER}${entityArrayLength}`
                    )

                },
                removeFunction: (idx: number) => (e) => {
                    console.log(`### removeFunction`, flattenedKey)
                    const entityKey = flattenedKey
                        .split(NAME_DELIMITER)
                        .filter((v, index) => index > 0 && v.length > 0)
                        .join(NAME_DELIMITER)
                    console.log(`entityNumber: ${idx}, entityKey: ${entityKey}`)
                    // TODO :: deleteBydelimiterKey 구현
                    baseRepository.updateEntityByDelimiterKey(idx, undefined, entityKey)
                }
            }

            return tableData
        } else {
            const baseEntityForArray = flattenBaseEntityForArray(baseRepository, propertyInfo, flattenedKey)
            if (typeof baseEntityForArray !== 'undefined') {
                baseEntityForArray.type = TableDataForArrayType.OBJECT
            }

            // Case 03 :: Object Type
            return baseEntityForArray
        }
    }).filter((entity) => typeof entity !== 'undefined') as TableDataForArray[]

    const mainTableDataForArray = {
        fullKey: objName,
        shortKey: extractShortKeyFromLongKey(objName),
        value: undefined,
        valueString: String(undefined),
        tableData: mainTableData,
    } as TableDataForArray

    return mainTableDataForArray
}

// 순회하는 메소드
export function exploreForEachTableData(data: TableDataForArray[], callback: (item: TableDataForArray) => void) {
    for (const item of data) {
        // 사용자가 제공한 콜백 함수 호출
        callback(item);

        // 내부 tableData 배열도 순회
        if (item.tableData) {
            exploreForEachTableData(item.tableData, callback);
        }
    }
}