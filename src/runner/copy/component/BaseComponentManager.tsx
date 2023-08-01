import React from 'react';
import {entityBeans, entityImportMap} from "src/reactbootdev/data/EntityBean";
import {NAME_DELIMITER} from "src/reactbootdev/config/config";
import {ClassType} from "src/reactbootdev/interface/TaskBeansType";
import {ObjectTypeEnum} from "src/reactbootdev/interface/TaskBeansType";
import BaseRepository from "src/reactbootdev/repository/BaseRepository";
import {useRecoilState} from "recoil";


// return react component

export interface StringInputProps {
    children: any;
    repositoryKey: string
    initValue: string
}


export const StringInput = (props: StringInputProps) => {
    // useState
    const [inputValue, setInputValue] = React.useState(props.initValue);
    // remove first element and join again
    const refinedRepository = props.repositoryKey.split(NAME_DELIMITER).slice(1).join(NAME_DELIMITER)

    const baseRepository = new BaseRepository(`uuid`);
    const [entityList, setEntityList] = useRecoilState(baseRepository.entityListState);
    baseRepository.setEntityList = setEntityList;
    baseRepository.entityList = entityList;

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
                    baseRepository.updateEntityByDelimiterKey(0, e.target.value, refinedRepository)
                    // setInputValue(e.target.value);
                }}/>
            {/*adwf : {props.testValue}*/}
        </div>
    )
}


export const CreateContainer = (props: StringInputProps) => {

    return (
        <div>
            <div>상위</div>
            {/*포함된 자식 컨테이너*/}
            {props.children}
            <div>하위</div>
        </div>
    )
}


interface BaseComponentTypeMapInterface {
    [key: string]: (args: any) => JSX.Element;
}

export const baseComponentTypeMap : BaseComponentTypeMapInterface= {
    stringInput: StringInput,
    stringArrayInput: StringInput,
    stringOutput: StringInput,
    stringArrayOutput: StringInput,
    createContainer: CreateContainer,
}


export const IS_ARRAY_TYPE_TEXT = 'Array'

export function entityRenderer (
    entity: unknown,
    repository: unknown,
    renderType: unknown,
    refiner: (rep: unknown) => unknown
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

    let bean;
    let entityName;
    Object.entries(entityImportMap).find(([key, value]) => {
        // console.log(key, value);
        if (value === entity) {
            // console.log(key);
            const fileName = key.split(NAME_DELIMITER).shift();
            entityName = key.split(NAME_DELIMITER).pop();
            if (fileName === undefined || entityName === undefined) {
                return
            }
            bean = entityBeans[fileName].objects[entityName];
            // console.log(bean);
        }
    })

    if (bean === undefined || entityName === undefined) {
        return <div>error : bean undefined</div>
    }

    const flattedObject = flattenObject(bean, entityName);
    // console.log(flattedObject);

    const generatedForm = Object.entries(flattedObject).map(([key, type]) => {
        const compKey = `${type}Input`
        const MappedComponent = baseComponentTypeMap[compKey]
        const initValue = ``

        return (
            <div>
                {/*<div>{key}</div>*/}
                {/*<div>{type}</div>*/}
                <MappedComponent
                    repositoryKey={key}
                    initValue={initValue}
                />

            </div>
        )
    })

    // TODO :: `flat info`로 @form 생성 @repository 자동 update

    const CreateContainer = baseComponentTypeMap['createContainer']

    return (
        <>
            <CreateContainer>
                {generatedForm}
            </CreateContainer>
        </>
    )
}

function isPrimtiveType (type: string) {
    return type === 'string' || type === 'number' || type === 'boolean'
}


// recursive 객체 단순화
function flattenObject(obj: ClassType, objName: string) {
    // // console.log(`check`)
    // // console.log(`check`, obj)
    const flattened : Record<string, string> = {}

    Object.entries(obj.data).map(([propertyName, propertyInfo]) => {
        // // console.log(`check22`,  propertyInfo.type, propertyInfo.referenceNode !== undefined, propertyInfo.type == ObjectTypeEnum.CLASS)

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
            // // console.log(`check33`)
            Object.assign(flattened, flattenObject(propertyInfo.referenceNode, `${flattenedKey}`))
        }
    })

    // Object.keys(obj).forEach((key) => {
    //     if (typeof obj[key] === 'object' && obj[key] !== null) {
    //         Object.assign(flattened, flattenObject(obj[key]))
    //     } else {
    //         flattened[key] = obj[key]
    //     }
    // })

    return flattened
}