import BaseEntity from "../entity/BaseEntity";
import {RecoilRoot, atom, selector, useRecoilState, useRecoilValue, RecoilState} from 'recoil';

export default class BaseRepository<T extends BaseEntity> {

    entityListState: RecoilState<T[]>;
    entityList: any;
    setEntityList: any;


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

    // 항목 삭제
    deleteEntity = (itemId: number) => {
        const updatedList = deleteItem(this.entityList, itemId);
        this.setEntityList(updatedList);
    };



    constructor(stateName: string) {
        // 상태를 저장하는 Recoil atom 정의
        this.entityListState = atom<T[]>({
            key: stateName,
            default: [],
        })

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

// 항목을 제거하는 함수
//
const deleteItem = <T extends BaseEntity>(list: T[], itemId: number): T[] => {
    return list.filter(item => item.id !== itemId);
};