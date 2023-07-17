import {BaseTaskResultInterface} from "./BaseTaskResultInterface";


export type DecoratorType = {
    name: string,
    definition: string,
    arguments: {
        type: string,
        value: any,
        txt: string,
    }[],
}

export type ClassPropertyType = {
    type: string,
    isArray: boolean,
    isTypeReferenceNode: boolean,
    isEnum: boolean,
    referenceNode?: object,
    decorators?: DecoratorType[],
    // isLiteral: boolean,
    // isStringLiteral: boolean,

}
export type ClassDataType = Record<string, ClassPropertyType>;
// type ClassDataType = Record<string, ClassPropertiesType>;
export type EnumDataType = Record<string, string | number>;

export enum ObjectTypeEnum {
    CLASS = 'class',
    ENUM = 'enum',
}

export type ClassType = {
    type: ObjectTypeEnum.CLASS,
    data: ClassDataType,
}
export type EnumType = {
    type: ObjectTypeEnum.ENUM,
    data: EnumDataType,
}

export type ObjectType = ClassType | EnumType
export type ObjectsType = Record<string, ObjectType>
export type ImportPathType = Record<string, string>
export type FileType = {
    importPaths: ImportPathType
    objects: ObjectsType,
}

export type EntityBeanType = Record<string, FileType>

