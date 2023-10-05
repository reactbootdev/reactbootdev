import BaseEntity from "../entity/BaseEntity";
import {atom, RecoilState, useRecoilState} from 'recoil';
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
import {v4} from "uuid";


export default class BaseRepository<T extends BaseEntity> {

    static defaultRepositoryKey: string = v4();
    static defaultEntityClass: new () => BaseEntity = BaseEntity;

    repositoryKey: string;
    static repositoryKeyMap: Map<string, any> = new Map<string, any>();
    state: any;
    setState: any;
    recoilState: RecoilState<T[]>;

    constructor(repositoryKey: string = v4()) {
        this.repositoryKey = repositoryKey

        if (BaseRepository.repositoryKeyMap.has(repositoryKey)) {
            this.recoilState = BaseRepository.repositoryKeyMap.get(repositoryKey);
        } else {
            this.recoilState = atom<T[]>({
                key: repositoryKey,
                default: [],
            })
            BaseRepository.repositoryKeyMap.set(repositoryKey, this.recoilState);
        }
    }
    getRepositoryKey = () => {
        return this.repositoryKey;
    }

    init(entityList: any, setEntityList: any) {
        this.state = entityList;
        this.setState = setEntityList;
    }

    truncate = () => {
        const updatedList = addItem([], {} as T);
        this.setState([]);
    }

    setEntity = (entity: T) => {
        const updatedList = addItem([], entity);
        this.setState([entity]);
    }

    getEntity = () => {
        return this.state[0] ?? undefined;
    }

    deleteEntity = () => {
        return this.truncate();
    }

    updateEntity = (newItem: T) => {
        const updatedList = updateItem(this.state, 0, newItem);
        this.setState(updatedList);
    }

    updateEntityByKey = (newItem: unknown, multiKeys: string) => {
        const updatedList = updateByDelimiterKey(this.state, 0, newItem, multiKeys);
        this.setState(updatedList);
    }

    getEntityValueByKey = (multiKeys: string) => {
        const itemId = 0;
        return getByDelimiterKey(this.state, itemId, multiKeys);
    }

    setList = (entities: T[]) => {
        const updatedList = addItems([], entities);
        this.setState(updatedList);
    }

    getList = () => {
        return this.state;
    }

    addList = (newItems: T[]) => {
        const updatedList = addItems(this.state, newItems);
        this.setState(updatedList);
    }

    deleteList = (itemId: number) => {
        const updatedList = deleteItem(this.state, itemId);
        this.setState(updatedList);
    };

    updateList = (itemId: number, newItem: T) => {
        const updatedList = updateItem(this.state, itemId, newItem);
        this.setState(updatedList);
    };

    updateListByKey = (itemId: number, newItem: unknown, multiKeys: string) => {
        const updatedList = updateByDelimiterKeyForArray(this.state, itemId, newItem, multiKeys);
        this.setState(updatedList);
    };

    getListValueByKey = (itemId: number, multiKeys: string) => {
        return getByDelimiterKey(this.state, itemId, multiKeys);
    }

    // TODO :: check if this is needed
    // updateEntityByDelimiterKey = (itemId: number, newItem: unknown, multiKeys: string) => {
    //     const updatedList = updateByDelimiterKey(this.state, itemId, newItem, multiKeys);
    //     this.setState(updatedList);
    // };

    getListValuesByKey = (multiKeys: string) => {
        let idxs = this.state.map((item: any, idx: number) => idx);
        let result = idxs.map((idx: number) => {
            let itemId = idx;
            return getByDelimiterKey(this.state, itemId, multiKeys);
        })
        return result;
    }

    getEntityKey = () => {
        const entityClass
            = (this.constructor as typeof BaseRepository).defaultEntityClass
        const result = getEntitiKeyByType(entityClass) as T
        return result
    }

    getEntityType = () => {
        const entityClass
            = (this.constructor as typeof BaseRepository).defaultEntityClass
        const result = getEntityTypeyByType(entityClass)
        return result
    }

}

export function useRepository
<
    T extends BaseEntity
    , U extends BaseRepository<T>
>
(
    RepositoryClass: RepositoryType<T, U>
    , additionalRepositoryKey: string = ``
):
    U
{
    const repoUtil = new RepositoryClass(
        RepositoryClass.defaultRepositoryKey + additionalRepositoryKey
    )
    const [state, setState] = useRecoilState(repoUtil.recoilState);
    repoUtil.init(state, setState);

    return repoUtil;
}

export interface RepositoryType<T extends BaseEntity, U extends BaseRepository<T>> {
    defaultRepositoryKey: string;
    defaultEntityClass: new () => T;

    new (repositoryKey: string): U;
}