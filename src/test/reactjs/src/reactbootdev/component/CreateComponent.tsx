import {BaseApi} from "src/reactbootdev/api/BaseApi";
import BaseRepository from "src/reactbootdev/repository/BaseRepository";
import {useRecoilState} from "recoil";
import React from "react";

export interface CreateContainerProps {
    children: any;
    repositoryKey: string
}

export const CreateContainer = (props: CreateContainerProps) => {

    // BaseApi
    const baseApi = new BaseApi()
    const handleCreate = baseApi.handleCreate

    const baseRepository = new BaseRepository(props.repositoryKey);
    const [entityList, setEntityList] = useRecoilState(baseRepository.entityListState);
    baseRepository.init(entityList, setEntityList)

    return (
        <div>
            <div>상위</div>
            {/*포함된 자식 컨테이너*/}
            {props.children}
            <div>하위</div>
            <button onClick={() => {
                handleCreate(entityList)
            }}>create
            </button>

        </div>
    )
}