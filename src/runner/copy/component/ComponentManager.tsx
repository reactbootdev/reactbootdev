import React from 'react';


// return react component
function stringInputComponent<T extends string>(name: T) : React.FC<T>{
    return (
        <div>{name}</div>
    )
}

class ComponentManager {

    stringInputComponent = stringInputComponent;

    // constructor()
    constructor(option: {
        stringInputComponent: (args: unknown) => React.FC<unknown>,
    }) {

    }
}


function entityRenderer(
    entity: unknown,
    repository: unknown,
    renderType: unknown,
    refiner: (rep: unknown) => unknown
) {

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

    return (
        <div>{entity}</div>
    )
}