import React from "react";
import {NAME_DELIMITER} from "src/reactbootdev/config/config";
import BaseRepository from "src/reactbootdev/repository/BaseRepository";
import {useRecoilState} from "recoil";
import {RenderTypeEnum} from "src/reactbootdev/component/BaseComponentManager";

export interface StringOutputProps {
    itemId: number
    renderType: RenderTypeEnum
    repositoryKey: string
    propertyKey: string
    propertyType: string
    initValue: string
}

export const StringOutput = (props: StringOutputProps) => {
    // remove first element and join again
    const refinedRepository = props.propertyKey.split(NAME_DELIMITER).slice(1).join(NAME_DELIMITER)

    const baseRepository = new BaseRepository(props.repositoryKey);
    const [entityList, setEntityList] = useRecoilState(baseRepository.entityListState);
    baseRepository.init(entityList, setEntityList)

    const itemId = props.itemId
    // const testInit = baseRepository.getValuesByDelimiterKey(itemId, props.propertyKey)
    const testInit = baseRepository.getValuesByDelimiterKey(itemId, refinedRepository)

    return (
        <div>
            <hr/>
            <div>{props.renderType}</div>
            <div>{props.propertyKey}</div>
            <div>{refinedRepository}</div>
            <div>{JSON.stringify(testInit)}</div>
            <hr/>
        </div>
    )
}