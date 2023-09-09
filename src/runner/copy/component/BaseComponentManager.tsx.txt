import React from 'react';
import {entityBeans, entityImportMap} from "src/reactbootdev/data/EntityBean";
import {NAME_DELIMITER} from "src/reactbootdev/config/config";
import {ClassType, ObjectType, ObjectTypeEnum} from "src/reactbootdev/interface/TaskBeansType";
import {CreateContainer} from "src/reactbootdev/component/CreateContainer";
import {StringInput} from "src/reactbootdev/component/StringInput";
import BaseRepository from "src/reactbootdev/repository/BaseRepository";
import BaseEntity from "src/reactbootdev/entity/BaseEntity";
import {BaseApi} from "src/reactbootdev/api/BaseApi";
import {StringOutput} from "src/reactbootdev/component/StringOutput";
import {Box} from "@mui/material";


export const ARRAY_TYPE_TEXT = 'Array'
export class ComponentManager {
    booleanInput = StringInput
    booleanOutput = StringOutput
    numberInput = StringInput
    numberOutput = StringOutput
    stringInput = StringInput
    stringOutput = StringOutput
    enumInput = StringInput
    enumOutput = StringOutput

    container = CreateContainer

    customMap = new Map<string, JSX.Element>
}

export enum RenderTypeEnum {
    CREATE = 'CREATE',
    READ_LIST = 'READ_LIST',
    READ_DETAIL = 'READ_DETAIL',
    UPDATE = 'UPDATE',
    DELETE = 'DELETE',
    RENDERER = 'RENDERER',
}

export type EntityType<T> = T extends BaseEntity ? T : never;
export type RepositoryType<T extends BaseEntity> = T extends BaseRepository<infer EntityType> ? BaseRepository<EntityType> : never;
export type BaseApiType<T> = T extends BaseApi ? T : never;
export type ApiType = BaseApiType<BaseApi>
export type RefinerType = {
    itemId?: number
}
export type IntRefinerType = {
    flattenObject: Record<string, string>
    itemId?: number
}

export function entityRenderer (
    entity: unknown,
    repository: RepositoryType<EntityType<any>>,
    api: ApiType,
    renderType: RenderTypeEnum,
    refiner: RefinerType = {}
) : JSX.Element {

    const beanInfo = findBean(entity)
    const flattenObj = flattenObject(beanInfo.bean, beanInfo.entityName);
    const intRefiner = {
        flattenObject: flattenObj,
        ...refiner,
    }

    const ElementComponents = getElementComponents(entity, repository, api, renderType, intRefiner)
    const ContainerComponent = getContainerComponent(entity, repository, api, renderType, intRefiner)

    return (
        <>
            <ContainerComponent
                repositoryKey={repository.repositoryKey}
                renderType={renderType}
                refiner={intRefiner}
            >
                {ElementComponents}
            </ContainerComponent>
        </>
    )
}

function findBean (entity: unknown) {
    let bean;
    let entityName;
    Object.entries(entityImportMap).find(([key, value]) => {
        if (value === entity) {
            const fileName = key.split(NAME_DELIMITER).shift();
            entityName = key.split(NAME_DELIMITER).pop();
            if (fileName === undefined || entityName === undefined) {
                return
            }
            bean = entityBeans[fileName].objects[entityName];
        }
    })

    if (bean === undefined || entityName === undefined) {
        throw new Error(`getGeneratedForm :: entity is not found in entityBeans. entity: ${entityName}`)
    }

    return {bean, entityName}
}

function getElementComponents (
    entity: unknown,
    repository: RepositoryType<EntityType<any>>,
    api: ApiType,
    renderType: RenderTypeEnum,
    refiner: IntRefinerType
) {

    let generatedForms
    if (refiner.itemId !== undefined) {
        generatedForms = getGeneratedForm(refiner.itemId, entity, repository, api, renderType, refiner)
        return (
            <Box
                sx={{ display: 'flex', p: 1, bgcolor: 'background.paper', borderRadius: 1 }}
            >
                {generatedForms}
            </Box>
        )
    }

    generatedForms = repository.entityList.map((entity: any, index: number) => {
        return (
            <Box
                sx={{ display: 'flex', p: 1, bgcolor: 'background.paper', borderRadius: 1 }}
            >
                {getGeneratedForm(index, entity, repository, api, renderType, refiner)}
            </Box>
        )
    })

    return (
        <>
            {generatedForms}
        </>
    )
}

function getGeneratedForm(
    itemId: number, entity: unknown,
    repository: RepositoryType<EntityType<any>>,
    api: ApiType, renderType: RenderTypeEnum, refiner: IntRefinerType
) {
    let generatedForm = Object.entries(refiner.flattenObject).map(([key, type]) => {
        const MappedComponent = getMappedComponent(renderType, type)
        const initValue = ``

        return (
            <MappedComponent
                key={itemId}
                itemId={itemId}
                repositoryKey={repository.repositoryKey}
                renderType={renderType}
                propertyKey={key}
                propertyType={type}
                initValue={initValue}
            />
        )
    })
    return generatedForm
}


function getContainerComponent (
    entity: unknown,
    repository: RepositoryType<EntityType<any>>,
    api: ApiType,
    renderType: RenderTypeEnum,
    refiner: IntRefinerType
) {
    const componentManager = new ComponentManager()
    let ContainerComponent
    switch (renderType) {
        case RenderTypeEnum.CREATE:
            ContainerComponent = componentManager.container
            break
        case RenderTypeEnum.READ_LIST:
            ContainerComponent = componentManager.container
            break
        case RenderTypeEnum.READ_DETAIL:
            ContainerComponent = componentManager.container
            break
        case RenderTypeEnum.UPDATE:
            ContainerComponent = componentManager.container
            break
        case RenderTypeEnum.DELETE:
            ContainerComponent = componentManager.container
            break
        default:
            ContainerComponent = componentManager.container
    }
    return ContainerComponent
}

function getMappedComponent (renderType: RenderTypeEnum, type: string) {
    let isOutput
    switch (renderType) {
        case RenderTypeEnum.CREATE:
        case RenderTypeEnum.UPDATE:
        case RenderTypeEnum.DELETE:
            isOutput = false
            break
        case RenderTypeEnum.READ_DETAIL:
        case RenderTypeEnum.READ_LIST:
            isOutput = true
            break
        default:
            isOutput = true
    }

    let componentManager = new ComponentManager()
    let MappedComponent;
    if (isOutput) {
        switch (type) {
            case 'string':
            case `string${ARRAY_TYPE_TEXT}`:
                MappedComponent = componentManager.stringOutput
                break
            case 'number':
            case `number${ARRAY_TYPE_TEXT}`:
                MappedComponent = componentManager.numberOutput
                break
            case 'boolean':
            case `boolean${ARRAY_TYPE_TEXT}`:
                MappedComponent = componentManager.booleanOutput
                break
            case 'enum':
            case `enum${ARRAY_TYPE_TEXT}`:
                MappedComponent = componentManager.enumOutput
                break
            default:
                MappedComponent = componentManager.stringOutput
        }
    } else {
        switch (type) {
            case 'string':
            case `string${ARRAY_TYPE_TEXT}`:
                MappedComponent = componentManager.stringInput
                break
            case 'number':
            case `number${ARRAY_TYPE_TEXT}`:
                MappedComponent = componentManager.numberInput
                break
            case 'boolean':
            case `boolean${ARRAY_TYPE_TEXT}`:
                MappedComponent = componentManager.booleanInput
                break
            case 'enum':
            case `enum${ARRAY_TYPE_TEXT}`:
                MappedComponent = componentManager.enumInput
                break
            default:
                MappedComponent = componentManager.stringInput
        }
    }
    return MappedComponent
}

function isPrimtiveType (type: string) {
    return type === 'string' || type === 'number' || type === 'boolean'
}


function flattenObject(obj: ObjectType, objName: string) {
    const flattened : Record<string, string> = {}

    Object.entries(obj.data).map(([propertyName, propertyInfo]) => {
        const flattenedKey = `${objName}${NAME_DELIMITER}${propertyName}`
        if (isPrimtiveType(propertyInfo.type)) {
            const flattenedType = propertyInfo.type
            const flattenedArrayType = propertyInfo.isArray ? ARRAY_TYPE_TEXT : ''
            flattened[flattenedKey] = `${flattenedType}${flattenedArrayType}`
        } else if (
            obj.type === ObjectTypeEnum.ENUM
        ) {
            const flattenedType = `enum`
            const flattenedArrayType = propertyInfo.isArray ? ARRAY_TYPE_TEXT : ''
            flattened[flattenedKey] = `${flattenedType}${flattenedArrayType}`
        } else if (
            propertyInfo.isTypeReferenceNode
            && propertyInfo.referenceNode !== undefined
            && propertyInfo.referenceNode.type === ObjectTypeEnum.CLASS
        ) {
            Object.assign(flattened, flattenObject(propertyInfo.referenceNode, `${flattenedKey}`))
        }
    })

    return flattened
}