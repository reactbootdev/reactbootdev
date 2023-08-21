import React from "react";
import {NAME_DELIMITER} from "src/reactbootdev/config/config";
import BaseRepository from "src/reactbootdev/repository/BaseRepository";
import {useRecoilState} from "recoil";
import {RenderTypeEnum} from "src/reactbootdev/component/BaseComponentManager";
import {Item} from "src/reactbootdev/component/CreateContainer";

export interface StringOutputProps {
    itemId: number
    renderType: RenderTypeEnum
    repositoryKey: string
    propertyKey: string
    propertyType: string
    initValue: string
}

export type StringOutputValueType = string | string[]

export const StringOutput = (props: StringOutputProps) => {

    const baseRepository = new BaseRepository(props.repositoryKey);
    const [entityList, setEntityList] = useRecoilState(baseRepository.entityListState);
    baseRepository.init(entityList, setEntityList)

    const itemId = props.itemId
    // remove first element and join again
    const refinedRepository = props.propertyKey.split(NAME_DELIMITER).slice(1).join(NAME_DELIMITER)
    const outputValue = baseRepository.getValuesByDelimiterKey(itemId, refinedRepository) as StringOutputValueType
    const valueComponent = Array.isArray(outputValue) ? outputValue.join(", ") : outputValue

    const renderType = props.renderType
    const renderReadDetail = () => {
        return (
            <div>
                <div>{props.renderType}</div>
                <div>{props.propertyKey}</div>
                <div>{refinedRepository}</div>
                <div>{valueComponent}</div>
                <hr/>
            </div>
        )
    }

    // const shortPropKeyName = props.propertyKey.split(NAME_DELIMITER).slice(-1)[0]

    const renderReadList = () => {
        return (
            <Item
                tooltipText={refinedRepository}
            >
                {valueComponent}
            </Item>
        )
    }

    switch (renderType) {
        case RenderTypeEnum.READ_DETAIL:
            return renderReadDetail()
        case RenderTypeEnum.READ_LIST:
            return renderReadList()
        default:
            return renderReadDetail()
    }

}