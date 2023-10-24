import {BaseTaskResultInterface} from "./BaseTaskResultInterface";

export interface BeanInterface extends BaseTaskResultInterface {
    className: string,
    classPath: string | undefined,
    decorators: DecoratorInfoInterface[],

    superClasses: {
        className: string,
        classPath: string | undefined,
    }[],
    members: {
        name: string,
        type: string,
        dataType: string,
        decorators: DecoratorInfoInterface[],
    }[]
}

export interface DecoratorInfoInterface {
    name: string;
    definition: string;
    arguments: { txt: string; type: string; value?: any }[];
}

