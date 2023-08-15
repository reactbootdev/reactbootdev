import BaseEntity from "../entity/BaseEntity";
import {RecoilRoot, atom, selector, useRecoilState, useRecoilValue, RecoilState} from 'recoil';
import produce, { Draft } from 'immer';
import {NAME_DELIMITER} from "src/reactbootdev/config/config";
import { v4 as uuidv4 } from 'uuid';


export default class BaseRepository<T extends BaseEntity> {

    static defaultRepositoryKey: string = uuidv4();

    repositoryKey: string;
    isDetailRepository: boolean;
    entityListState: RecoilState<T[]>;
    entityList: any;
    setEntityList: any;

    static repositoryKeyMap: Map<string, any> = new Map<string, any>();

    init(entityList: any, setEntityList: any) {
        this.entityList = entityList;
        this.setEntityList = setEntityList;
    }

    addEntity = (newItem: T) => {
        const updatedList = addItem(this.entityList, newItem);
        this.setEntityList(updatedList);
    };

    addEntities = (newItems: T[]) => {
        const updatedList = addItems(this.entityList, newItems);
        this.setEntityList(updatedList);
    }

    updateEntity =  (itemId: number, newItem: T) => {
        const updatedList = updateItem(this.entityList, itemId, newItem);
        this.setEntityList(updatedList);
    };

    updateEntityByDelimiterKey =  (itemId: number, newItem: unknown, multiKeys: string) => {
        const updatedList = updateByDelimiterKey(this.entityList, itemId, newItem, multiKeys);
        this.setEntityList(updatedList);
    };

    deleteEntity = (itemId: number) => {
        const updatedList = deleteItem(this.entityList, itemId);
        this.setEntityList(updatedList);
    };

    getValuesByDelimiterKey = (itemId: number, multiKeys: string) => {
        console.log(`this.entityList, itemId, multiKeys`, this.entityList, itemId, multiKeys)

        return getByDelimiterKey(this.entityList, itemId, multiKeys);
    }


    constructor(repositoryKey: string = uuidv4()) {
        this.repositoryKey = repositoryKey
        // 상세 값. 관련해서 저장 방법.
        this.isDetailRepository = false;

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
    idx: number,
    multiKeys: string,
) => {
    let keys = multiKeys.split(NAME_DELIMITER);
    let result: unknown = undefined;
    const item = list[idx];
    result = getNestedProperty(item, keys);

    return result
}


// Helper function to update nested properties safely
function getNestedProperty<T, K extends keyof T>(
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


// updateByDelimiterKey
const updateByDelimiterKey =  <T extends BaseEntity> (
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
