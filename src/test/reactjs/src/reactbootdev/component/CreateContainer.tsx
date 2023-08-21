import {BaseApi} from "src/reactbootdev/api/BaseApi";
import BaseRepository from "src/reactbootdev/repository/BaseRepository";
import {useRecoilState} from "recoil";
import React from "react";
import {IntRefinerType, RenderTypeEnum} from "src/reactbootdev/component/BaseComponentManager";
import {Box, BoxProps, Button, Grid, Tooltip} from "@mui/material";
import {NAME_DELIMITER} from "src/reactbootdev/config/config";

export interface CreateContainerProps {
    children: any
    repositoryKey: string
    renderType: RenderTypeEnum
    refiner: IntRefinerType
}

export type BoxPropsExt = BoxProps & {
    tooltipText: string
}

export function Item(props: BoxPropsExt) {
    const { sx, ...other } = props;
    return (
        <Tooltip
            title={props.tooltipText}
        >
            <Box
                sx={{
                    p: 1,
                    m: 1,
                    bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#101010' : 'grey.100'),
                    color: (theme) => (theme.palette.mode === 'dark' ? 'grey.300' : 'grey.800'),
                    border: '1px solid',
                    borderColor: (theme) =>
                        theme.palette.mode === 'dark' ? 'grey.800' : 'grey.300',
                    borderRadius: 2,
                    fontSize: '0.875rem',
                    fontWeight: '700',
                    ...sx,
                }}
                {...other}
            />
        </Tooltip>
    );
}


export const CreateContainer = (props: CreateContainerProps) => {

    // BaseApi
    const baseApi = new BaseApi()
    const handleCreate = baseApi.handleCreate

    const baseRepository = new BaseRepository(props.repositoryKey);
    const [entityList, setEntityList] = useRecoilState(baseRepository.entityListState);
    baseRepository.init(entityList, setEntityList)

    const renderType = props.renderType
    const renderReadDetail = () => {
        return (
            <div>
                <hr/>
                <div>{props.renderType}</div>
                <div>repositoryKey : {props.repositoryKey}</div>
                <div>entityList : {JSON.stringify(entityList)}</div>
                <hr/>
                <div>{props.children}</div>
                <hr/>
            </div>
        )
    }

    const keyNameList = () => {
        const keyGrid = Object.keys(props.refiner.flattenObject).map((propKeyName: string, idx: number) => {
            const shortPropKeyName = propKeyName.split(NAME_DELIMITER).slice(-1)[0]

            return (
                <Item
                    key={idx}
                    tooltipText={propKeyName}
                >
                    {shortPropKeyName}
                </Item>
            )
        })

        return (
            <Box
                sx={{ display: 'flex', p: 1, bgcolor: 'background.paper', borderRadius: 1 }}
            >
                {keyGrid}
            </Box>
        )
    }

    const renderReadList = () => {
        return (
            <div>
                <hr/>
                <div>{props.renderType}</div>
                <div>repositoryKey : {props.repositoryKey}</div>
                <div>entityList : {JSON.stringify(entityList)}</div>
                <hr/>

                <div>{keyNameList()}</div>


                <hr/>

                {props.children}

                <hr/>
            </div>
        )
    }
    const renderCreate = () => {
        return (
            <div>
                <hr/>
                <div>{props.renderType}</div>
                <div>repositoryKey : {props.repositoryKey}</div>
                <div>entityList : {JSON.stringify(entityList)}</div>
                <hr/>
                <div>{props.children}</div>
                <hr/>
                <button onClick={() => {
                    handleCreate(entityList)
                }}>create
                </button>
            </div>
        )
    }
    const renderUpdate = () => {
        return (
            <div>
                <hr/>
                <div>{props.renderType}</div>
                <div>repositoryKey : {props.repositoryKey}</div>
                <div>entityList : {JSON.stringify(entityList)}</div>
                <hr/>
                <div>{props.children}</div>
                <hr/>
            </div>
        )
    }
    const renderDelete = () => {
        return (

            <div>
                <hr/>
                <div>{props.renderType}</div>
                <div>repositoryKey : {props.repositoryKey}</div>
                <div>entityList : {JSON.stringify(entityList)}</div>
                <hr/>
                <div>{props.children}</div>
                <hr/>
            </div>
        )
    }

    switch (renderType) {
        case RenderTypeEnum.READ_DETAIL:
            return renderReadDetail()
        case RenderTypeEnum.READ_LIST:
            return renderReadList()
        case RenderTypeEnum.CREATE:
            return renderCreate()
        case RenderTypeEnum.UPDATE:
            return renderUpdate()
        case RenderTypeEnum.DELETE:
            return renderDelete()
        default:
            return renderReadDetail()
    }

}