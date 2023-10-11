import BaseEntity from "../entity/BaseEntity";
import {atom, RecoilState, useRecoilState} from 'recoil';
import {
    addItem,
    addItems,
    deleteItem,
    getByDelimiterKey,
    getEntitiKeyByType,
    getEntityTypeyByType,
    updateByDelimiterKeyForArray
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

    init(entityList: any, setEntityList: any) {
        this.state = entityList;
        this.setState = setEntityList;
    }
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

    getRepositoryKey = () => {
        return this.repositoryKey;
    }

    updateEntity = (newItem: T) => {
        const multiKeys = ``
        this.updateEntityByKey(newItem, multiKeys)
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

    updateEntityByKey = (newItem: unknown, multiKeys: string) => {
        const updatedList = updateByDelimiterKeyForArray(this.state, 0, newItem, multiKeys);
        this.setState(updatedList);
    }
    updateListByKey = (itemId: number, newItem: unknown, multiKeys: string) => {
        const updatedList = updateByDelimiterKeyForArray(this.state, itemId, newItem, multiKeys);
        this.setState(updatedList);
    };
    getListValueByKey = (itemId: number, multiKeys: string) => {
        return getByDelimiterKey(this.state, itemId, multiKeys);
    }
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

    updateList = (itemId: number, newItem: T) => {
        const multiKeys = ``
        this.updateListByKey(itemId, newItem, multiKeys)
    };

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
    new (repositoryKey: string): U;
    defaultRepositoryKey: string;
    defaultEntityClass: new () => T;
}