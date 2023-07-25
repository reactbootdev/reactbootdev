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
    
    return (
        <div>{entity}</div>
    )
}