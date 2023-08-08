import React from "react";
import {NAME_DELIMITER} from "src/reactbootdev/config/config";
import BaseRepository from "src/reactbootdev/repository/BaseRepository";
import {useRecoilState} from "recoil";

export interface StringInputProps {
    repositoryKey: string
    propertyKey: string
    initValue: string
}

export const StringInput = (props: StringInputProps) => {
    // useState
    const [inputValue, setInputValue] = React.useState(props.initValue);
    // remove first element and join again
    const refinedRepository = props.propertyKey.split(NAME_DELIMITER).slice(1).join(NAME_DELIMITER)

    const baseRepository = new BaseRepository(props.repositoryKey);
    const [entityList, setEntityList] = useRecoilState(baseRepository.entityListState);
    baseRepository.init(entityList, setEntityList)

    const updateRepository = (value: string) => {
        setInputValue(value)
    }

    const testInit = baseRepository.getValuesByDelimiterKey(0, refinedRepository)


    return (
        <div>
            <div>{props.initValue}</div>
            <div>{refinedRepository}</div>
            <div>{JSON.stringify(testInit)}</div>
            <div>{JSON.stringify(baseRepository.entityList)}</div>
            <input
                type="text"
                value={JSON.stringify(testInit)}
                onChange={(e) => {
                    baseRepository.updateEntityByDelimiterKey(0, e.target.value, props.propertyKey)
                    // setInputValue(e.target.value);
                }}/>
            {/*adwf : {props.testValue}*/}
        </div>
    )
}