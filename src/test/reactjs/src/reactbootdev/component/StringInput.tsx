import React from "react";
import {NAME_DELIMITER} from "src/reactbootdev/config/config";
import BaseRepository from "src/reactbootdev/repository/BaseRepository";
import {useRecoilState} from "recoil";
import {RenderTypeEnum} from "src/reactbootdev/component/BaseComponentManager";
import {TextField} from "@mui/material";

export interface StringInputProps {
    itemId: number
    renderType: RenderTypeEnum
    repositoryKey: string
    propertyKey: string
    propertyType: string
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

    const itemId = props.itemId

    const value = baseRepository.getValueByDelimiterKey(itemId, props.propertyKey) ?? ""
    const refinedValue = String(value)

    return (
        <div>
            <div>{props.renderType}</div>
            <div>{props.initValue}</div>
            <div>{refinedRepository}</div>
            <div>{JSON.stringify(value)}</div>
            <div>{JSON.stringify(baseRepository.entityList)}</div>
            <TextField
                id="outlined-basic" label="Outlined" variant="outlined"
                value={refinedValue}
                onChange={(e) => {
                    baseRepository.updateEntityByDelimiterKey(0, e.target.value, props.propertyKey)
                    // setInputValue(e.target.value);
                }}
            />
            {/*adwf : {props.testValue}*/}
        </div>
    )
}