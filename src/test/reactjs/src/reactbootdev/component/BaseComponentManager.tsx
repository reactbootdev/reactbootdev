import React from 'react';
import {entityBeans, entityImportMap} from "src/reactbootdev/data/EntityBean";
import {NAME_DELIMITER} from "src/reactbootdev/config/config";
import {ClassType, ObjectTypeEnum} from "src/reactbootdev/interface/TaskBeansType";
import {CreateContainer} from "src/reactbootdev/component/CreateContainer";
import {StringInput} from "src/reactbootdev/component/StringInput";
import BaseRepository from "src/reactbootdev/repository/BaseRepository";
import BaseEntity from "src/reactbootdev/entity/BaseEntity";
import {BaseApi} from "src/reactbootdev/api/BaseApi";
import {StringOutput} from "src/reactbootdev/component/StringOutput";


interface BaseComponentTypeMapInterface {
    [key: string]: (args: any) => JSX.Element;
}

export const baseComponentTypeMap : BaseComponentTypeMapInterface= {
    booleanInput: StringInput,
    booleanArrayInput: StringInput,
    booleanOutput: StringOutput,
    booleanArrayOutput: StringOutput,
    numberInput: StringInput,
    numberArrayInput: StringInput,
    numberOutput: StringOutput,
    numberArrayOutput: StringOutput,
    stringInput: StringInput,
    stringArrayInput: StringInput,
    stringOutput: StringOutput,
    stringArrayOutput: StringOutput,

    createContainer: CreateContainer,
    readListContainer: CreateContainer,
    readDetailContainer: CreateContainer,
    updateContainer: CreateContainer,
    deleteContainer: CreateContainer,
}


export const IS_ARRAY_TYPE_TEXT = 'Array'


export enum RenderTypeEnum {
    CREATE = 'CREATE',
    READ_LIST = 'READ_LIST',
    READ_DETAIL = 'READ_DETAIL',
    UPDATE = 'UPDATE',
    DELETE = 'DELETE',
}

export type EntityType<T> = T extends BaseEntity ? T : never;

export type RepositoryType<T extends BaseEntity> = T extends BaseRepository<infer EntityType> ? BaseRepository<EntityType> : never;
// export type RepositoryType = BaseRepositoryType<EntityType>

// export type BaseEntityType<T> = T extends BaseEntity ? T : never;
// export type EntityType = BaseEntityType<BaseEntity>
//
// export type BaseRepositoryType<T extends BaseEntity> = T extends BaseRepository<infer BaseEntityType> ? BaseRepository<BaseEntityType> : never;
// export type RepositoryType = BaseRepositoryType<EntityType>

export type BaseApiType<T> = T extends BaseApi ? T : never;
export type ApiType = BaseApiType<BaseApi>

export function entityRenderer (
    entity: unknown,
    repository: RepositoryType<EntityType<any>>,
    api: ApiType,
    renderType: RenderTypeEnum,
    refiner: BaseComponentTypeMapInterface
) : JSX.Element {

    // TODO :: entityBean. repository 둘 다 평문화 시켜서 렌더링 하는 수외에는 없다고 봐.
    // 각 key랑, [type, value] 에 따라 component mapping
    // delimiter `////`
    // 데이터 정제 및 custom component render용 callback 함수 인자
    // 우선 CREATE 부터.
    // isAppend option
    // repository 부터 recoil
    // https://rjsf-team.github.io/react-jsonschema-form/

    // TODO :: render 연결 방법.. 문제는 여러 개 복합 칼럼 일 때. > 같은 name인 것들을 전부 해당 renderer로 전송?
    // class 정의 시. @outer("name")
    // class properties > @out("name")
    // class 정의 시. @inner("name")
    // class properties > @in("name")

    // 문제는 반환된 state-repository mapping. react hook form?
    // inner component에 update callback 세팅?

    const REPOSITORY_KEY = repository.repositoryKey
    const ElementComponents = getElementComponents(entity, repository, api, renderType, refiner)
    const ContainerComponent = getContainerComponent(entity, repository, api, renderType, refiner)

    return (
        <>
            <ContainerComponent
                repositoryKey={REPOSITORY_KEY}
            >
                {ElementComponents}
            </ContainerComponent>
        </>
    )
}

function getContainerComponent (
    entity: unknown,
    repository: RepositoryType<EntityType<any>>,
    api: ApiType,
    renderType: RenderTypeEnum,
    refiner: BaseComponentTypeMapInterface
) {
    let ContainerComponent
    switch (renderType) {
        case RenderTypeEnum.CREATE:
            ContainerComponent = baseComponentTypeMap['createContainer']
            break
        case RenderTypeEnum.READ_LIST:
            ContainerComponent = baseComponentTypeMap['readListContainer']
            break
        case RenderTypeEnum.READ_DETAIL:
            ContainerComponent = baseComponentTypeMap['readDetailContainer']
            break
        case RenderTypeEnum.UPDATE:
            ContainerComponent = baseComponentTypeMap['updateContainer']
            break
        case RenderTypeEnum.DELETE:
            ContainerComponent = baseComponentTypeMap['deleteContainer']
            break
        default:
            ContainerComponent = baseComponentTypeMap['createContainer']
    }
    return ContainerComponent
}

function getElementComponents (
    entity: unknown,
    repository: RepositoryType<EntityType<any>>,
    api: ApiType,
    renderType: RenderTypeEnum,
    refiner: BaseComponentTypeMapInterface
) {
    const REPOSITORY_KEY = repository.repositoryKey

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

    const flattedObject = flattenObject(bean, entityName);

    let generatedForm
    // if renderType
    if (renderType === RenderTypeEnum.READ_DETAIL) {
        generatedForm = Object.entries(flattedObject).map(([key, type]) => {
            const compKey = `${type}Output`
            const MappedComponent = baseComponentTypeMap[compKey]
            const initValue = ``

            return (
                <div>
                    <MappedComponent
                        repositoryKey={REPOSITORY_KEY}
                        propertyKey={key}
                        initValue={initValue}
                    />
                </div>
            )
        })
    } else if (renderType === RenderTypeEnum.READ_LIST) {
        generatedForm = Object.entries(flattedObject).map(([key, type]) => {
            const compKey = `${type}Input`
            const MappedComponent = baseComponentTypeMap[compKey]
            const initValue = ``

            return (
                <div>
                    <MappedComponent
                        repositoryKey={REPOSITORY_KEY}
                        propertyKey={key}
                        initValue={initValue}
                    />
                </div>
            )
        })
    } else if (renderType === RenderTypeEnum.CREATE) {
        generatedForm = Object.entries(flattedObject).map(([key, type]) => {
            const compKey = `${type}Input`
            const MappedComponent = baseComponentTypeMap[compKey]
            const initValue = ``

            return (
                <div>
                    <MappedComponent
                        repositoryKey={REPOSITORY_KEY}
                        propertyKey={key}
                        initValue={initValue}
                    />
                </div>
            )
        })
    } else if (renderType === RenderTypeEnum.UPDATE) {
        generatedForm = Object.entries(flattedObject).map(([key, type]) => {
            const compKey = `${type}Input`
            const MappedComponent = baseComponentTypeMap[compKey]
            const initValue = ``

            return (
                <div>
                    <MappedComponent
                        repositoryKey={REPOSITORY_KEY}
                        propertyKey={key}
                        initValue={initValue}
                    />
                </div>
            )
        })
    } else if (renderType === RenderTypeEnum.DELETE) {
        generatedForm = Object.entries(flattedObject).map(([key, type]) => {
            const compKey = `${type}Input`
            const MappedComponent = baseComponentTypeMap[compKey]
            const initValue = ``

            return (
                <div>
                    <MappedComponent
                        repositoryKey={REPOSITORY_KEY}
                        propertyKey={key}
                        initValue={initValue}
                    />
                </div>
            )
        })
    }

    return (
        <>
            {generatedForm}
        </>
    )
}


function isPrimtiveType (type: string) {
    return type === 'string' || type === 'number' || type === 'boolean'
}

function flattenObject(obj: ClassType, objName: string) {
    const flattened : Record<string, string> = {}

    Object.entries(obj.data).map(([propertyName, propertyInfo]) => {
        const flattenedKey = `${objName}${NAME_DELIMITER}${propertyName}`
        if (isPrimtiveType(propertyInfo.type)) {
            const flattenedType = propertyInfo.type
            const flattenedArrayType = propertyInfo.isArray ? IS_ARRAY_TYPE_TEXT : ''
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