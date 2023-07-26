import React from 'react';
import {entityBeans, entityImportMap} from "src/reactbootdev/data/EntityBean";
import {NAME_DELIMITER} from "src/reactbootdev/config/config";
import {ClassType} from "src/reactbootdev/interface/TaskBeansType";
import {ObjectTypeEnum} from "src/reactbootdev/interface/TaskBeansType";


// return react component
export function stringInputComponent<T extends string>(name: T) : JSX.Element {
    return (
        <div>adf</div>
    )
}

export class ComponentManager {

    stringInputComponent = stringInputComponent;

    // constructor()
    constructor(option: {
        stringInputComponent: (args: unknown) => React.FC<unknown>,
    }) {

    }
}


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
        console.log(key, value);
        if (value === entity) {
            console.log(key);
            const fileName = key.split(NAME_DELIMITER).shift();
            entityName = key.split(NAME_DELIMITER).pop();
            if (fileName === undefined || entityName === undefined) {
                return
            }
            bean = entityBeans[fileName].objects[entityName];
            console.log(bean);
        }
    })

    if (bean === undefined || entityName === undefined) {
        return <div>error : bean undefined</div>
    }

    console.log(flattenObject(bean, entityName));

    return (
        <div>xxx</div>
    )
}

function isPrimtiveType (type: string) {
    return type === 'string' || type === 'number' || type === 'boolean'
}

// recursive 객체 단순화
function flattenObject(obj: ClassType, objName: string) {
    // console.log(`check`)
    // console.log(`check`, obj)
    const flattened : Record<string, string> = {}

    Object.entries(obj.data).map(([propertyName, propertyInfo]) => {
        // console.log(`check22`,  propertyInfo.type, propertyInfo.referenceNode !== undefined, propertyInfo.type == ObjectTypeEnum.CLASS)

        const flattenedKey = `${objName}${NAME_DELIMITER}${propertyName}`
        if (isPrimtiveType(propertyInfo.type)) {
            const flattenedType = propertyInfo.type
            const flattenedArrayType = propertyInfo.isArray ? '[]' : ''
            flattened[flattenedKey] = `${flattenedType}${flattenedArrayType}`
        } else if (
            propertyInfo.isTypeReferenceNode
            && propertyInfo.referenceNode !== undefined
            && propertyInfo.referenceNode.type === ObjectTypeEnum.CLASS
        ) {
            // console.log(`check33`)
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