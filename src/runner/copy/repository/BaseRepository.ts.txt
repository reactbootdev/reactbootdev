import BaseEntity from "../entity/BaseEntity";
import {atom, RecoilState} from 'recoil';
import {v4 as uuidv4} from 'uuid';
import {
    addItem,
    addItems,
    deleteItem,
    getByDelimiterKey,
    getEntitiKeyByType,
    getEntityTypeyByType,
    updateByDelimiterKey,
    updateByDelimiterKeyForArray,
    updateItem
} from "@src/reactbootdev/util/RepositoryUtil";


export default class BaseRepository<T extends BaseEntity> {

    static defaultRepositoryKey: string = uuidv4();

    entityClass: new () => T;
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

    getRepositoryKey = () => {
        return this.repositoryKey;
    }

    truncate = () => {
        const updatedList = addItem([], {} as T);
        this.setEntityList([]);
    }
    setEntity = (entity: T) => {
        const updatedList = addItem([], entity);
        this.setEntityList([entity]);
    }
    setEntities = (entities: T[]) => {
        const updatedList = addItems([], entities);
        this.setEntityList(updatedList);
    }
    getEntity = () => {
        return this.entityList[0] ?? undefined;
    }
    getEntityById = (itemId: number) => {
        return this.entityList[itemId];
    }
    getEntities = () => {
        return this.entityList;
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

    updateEntityByDelimiterKeyForArray = (itemId: number, newItem: unknown, multiKeys: string) => {
        const updatedList = updateByDelimiterKeyForArray(this.entityList, itemId, newItem, multiKeys);
        this.setEntityList(updatedList);
    };

    deleteEntity = (itemId: number) => {
        const updatedList = deleteItem(this.entityList, itemId);
        this.setEntityList(updatedList);
    };
    getValue = (multiKeys: string) => {
        const itemId = 0
        return getByDelimiterKey(this.entityList, itemId, multiKeys);
    }
    getValueById = (itemId: number, multiKeys: string) => {
        return getByDelimiterKey(this.entityList, itemId, multiKeys);
    }
    getValues = (multiKeys: string) => {
        let idxs = this.entityList.map((item: any, idx: number) => idx);
        let result = idxs.map((idx: number) => {
            let itemId = idx;
            return getByDelimiterKey(this.entityList, itemId, multiKeys);
        })
        return result;
    }
    getEntityKey = () => {
        const result = getEntitiKeyByType(this.entityClass) as T
        return result
    }

    getEntityType = () => {
        const result = getEntityTypeyByType(this.entityClass)
        return result
    }

    constructor(entityClass: new () => T, repositoryKey: string = uuidv4()) {
        this.entityClass = entityClass;

        this.repositoryKey = repositoryKey
        this.isDetailRepository = false;

        if (BaseRepository.repositoryKeyMap.has(repositoryKey)) {
            this.entityListState = BaseRepository.repositoryKeyMap.get(repositoryKey);
        } else {
            this.entityListState = atom<T[]>({
                key: repositoryKey,
                default: [],
            })
            BaseRepository.repositoryKeyMap.set(repositoryKey, this.entityListState);
        }
    }

}
