import React from "react";
import {NAME_DELIMITER} from "src/reactbootdev/config/config";
import BaseRepository from "src/reactbootdev/repository/BaseRepository";
import {useRecoilState} from "recoil";

export interface StringOutputProps {
    repositoryKey: string
    propertyKey: string
    initValue: string
}

export const StringOutput = (props: StringOutputProps) => {
    // remove first element and join again
    const refinedRepository = props.propertyKey.split(NAME_DELIMITER).slice(1).join(NAME_DELIMITER)

    const baseRepository = new BaseRepository(props.repositoryKey);
    const [entityList, setEntityList] = useRecoilState(baseRepository.entityListState);
    baseRepository.init(entityList, setEntityList)

    const itemId = 0
    const testInit = baseRepository.getValuesByDelimiterKey(itemId, props.propertyKey)


    return (
        <div>
            <hr/>
            <div>{props.propertyKey}</div>
            <div>{refinedRepository}</div>
            <div>{JSON.stringify(testInit)}</div>
            <hr/>
        </div>
    )
}