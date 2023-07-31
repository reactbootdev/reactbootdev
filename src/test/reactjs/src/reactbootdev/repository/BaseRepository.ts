import BaseEntity from "../entity/BaseEntity";
import {RecoilRoot, atom, selector, useRecoilState, useRecoilValue, RecoilState} from 'recoil';
import produce, { Draft } from 'immer';
import {NAME_DELIMITER} from "src/reactbootdev/config/config";

export default class BaseRepository<T extends BaseEntity> {

    isDetailRepository: boolean;
    entityListState: RecoilState<T[]>;
    entityList: any;
    setEntityList: any;

    static repositoryKeyMap: Map<string, any> = new Map<string, any>();


    addEntity = (newItem: T) => {
        const updatedList = addItem(this.entityList, newItem);
        this.setEntityList(updatedList);
    };

    addEntities = (newItems: T[]) => {
        const updatedList = addItems(this.entityList, newItems);
        this.setEntityList(updatedList);
    }


    // 항목 업데이트
    updateEntity =  (itemId: number, newItem: T) => {
        const updatedList = updateItem(this.entityList, itemId, newItem);
        this.setEntityList(updatedList);
    };

    updateEntityByDelimiterKey =  (itemId: number, newItem: unknown, multiKeys: string) => {
        const updatedList = updateByDelimiterKey(this.entityList, itemId, newItem, multiKeys);
        console.log("newItem", newItem);
        console.log("updatedList", updatedList);
        this.setEntityList(updatedList);
    };

    // 항목 삭제
    deleteEntity = (itemId: number) => {
        const updatedList = deleteItem(this.entityList, itemId);
        this.setEntityList(updatedList);
    };

    getValuesByDelimiterKey = (itemId: number, multiKeys: string) => {
        return getByDelimiterKey(this.entityList, itemId, multiKeys);
    }


    constructor(repositoryKey: string) {

        // 상세 값. 관련해서 저장 방법.
        this.isDetailRepository = false;

        // TODO :: delimiter key 값에 의한 update method.


        // repositoryKeyMap > key 값이 존재할 경우 기존 값에서 참고. static.
        if (BaseRepository.repositoryKeyMap.has(repositoryKey)) {
            this.entityListState = BaseRepository.repositoryKeyMap.get(repositoryKey);
        } else {
            // 상태를 저장하는 Recoil atom 정의
            this.entityListState = atom<T[]>({
                key: repositoryKey,
                default: [],
            })
            BaseRepository.repositoryKeyMap.set(repositoryKey, this.entityListState);
        }

        // const [ entityList, setEntityList ] = useRecoilState(this.entityListState);

        // this.entityList = entityList
        // this.addEntity = addEntity
        // this.updateEntity = updateEntity
        // this.deleteEntity = deleteEntity

    }

}

// 새 항목을 추가하는 함수
const addItem = <T extends BaseEntity>(list: T[], newItem: T): T[] => {
    return [...list, newItem];
};

// 새 항목을 추가하는 함수
const addItems = <T extends BaseEntity>(list: T[], newItems: T[]): T[] => {
    return [...list, ...newItems];
};
// 항목을 제거하는 함수
const deleteItem = <T extends BaseEntity>(list: T[], itemId: number): T[] => {
    return list.filter(item => item.id !== itemId);
};

// 항목을 업데이트하는 함수
const updateItem = <T extends BaseEntity>(list: T[], itemId: number, newItem: T): T[] => {
    const updatedList = list.map(item => {
        if (item.id === itemId) {
            return { ...item, ...newItem };
        }
        return item;
    });
    return updatedList;
};


// getByDelimiterKey
const getByDelimiterKey = <T extends BaseEntity> (
    list: T[],
    itemId: number,
    multiKeys: string,
): unknown => {
    let keys = multiKeys.split(NAME_DELIMITER);

    let result: unknown = undefined;
    list.forEach(item => {
        if (item.id === itemId) {
            result = getNestedProperty(item, keys);
        }
    });

    return result
}


// Helper function to update nested properties safely
function getNestedProperty<T, K extends keyof T>(
    obj: T,
    keys: string[]
): T {
    const result = { ...obj };
    let current: any = result;
    for (let i = 0; i < keys.length - 1; i++) {
        const key = keys[i];
        current[key] = { ...current[key] };
        current = current[key];
    }
    return current[keys[keys.length - 1]]
}


// updateByDelimiterKey
const updateByDelimiterKey =  <T extends BaseEntity> (
        list: T[],
        itemId: number,
        newValue: unknown,
        multiKeys: string,
    ): T[] => {

    console.log("1", itemId);
    if (list.length === 0) {
        const newItem = createOrSetProperty({} as T, multiKeys, newValue);
        // console.log("newItem", newItem);
        console.log("11");
        return [newItem];
    }

    const updatedList = list.map((item, idx) => {
        if (idx === itemId) {
            console.log("111");
            const newItem = createOrSetProperty(item, multiKeys, newValue);
            return newItem;
        }
        return item;
    });
    console.log("1111");
    // console.log("updatedList", updatedList);
    return updatedList;
}


// Helper function to update nested properties safely
function updateNestedProperty<T, K extends keyof T>(
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

function createOrSetProperty<T, K extends keyof T>(
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

    // Use the helper function to update the nested property safely
    return produce(obj, (draft) => {
        return updateNestedProperty(draft, keys, value);
    });
}

// function getValueByPath(data: unknown, path: string, delimiter: string = '.') {
//     const keys = path.split(delimiter);
//     let value = data;
//
//     for (const key of keys) {
//         if (typeof value === 'undefined') {
//             return undefined;
//         }
//
//         value = value[key];
//     }
//
//     return value;
// }