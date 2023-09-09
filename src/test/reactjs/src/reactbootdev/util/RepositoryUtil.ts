import BaseEntity from "@src/reactbootdev/entity/BaseEntity";
import {NAME_DELIMITER} from "@src/reactbootdev/config/config";
import {produce} from "immer";

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

    // If obj exists, ensure key is a string and then split it to set the nested property.
    const keys = key.split(NAME_DELIMITER);

    // Use the helper export function to update the nested property safely
    return produce(obj, (draft) => {
        return updateNestedProperty(draft, keys, value);
    });
}
