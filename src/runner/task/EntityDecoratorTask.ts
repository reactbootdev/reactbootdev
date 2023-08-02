import path from 'path';
import * as ts from 'typescript';
import * as glob from 'glob';
import {
    TaskBeansType,
    ObjectsType,
    DecoratorType,
    FileType,
    ObjectTypeEnum,
    EnumType,
    ObjectType,
    ClassPropertyType,
    ClassType,
    EnumDataType,
    ClassDataType,
    ImportPathType,
} from "../copy/interface/TaskBeansType";
import {
    convertToAbsolutePath,
    findTypeLocation,
    getDecoratorInfo, getDirectoryPath, hasRecursiveFormDecorator,
    isArrayElementTypeReferenceNode, resolvePropertyType,
    // resolveRecursiveTypes
} from "../util/NodeUtil";


// const PRE_SOURCE_PATH = 'src/source';
// const SOURCE_PATH = `${PRE_SOURCE_PATH}/**/*.ts?(x)`;
//
// const fileNames = glob.sync(SOURCE_PATH, {
//     ignore: ['**/node_modules/**/*.ts', '**/*.spec.ts'],
// });

// console.log(fileNames);
//
// const compilerOptions: ts.CompilerOptions = {
//     target: ts.ScriptTarget.ES2015,
//     module: ts.ModuleKind.CommonJS,
//     setParentNodes: true,
// };
//
//
// const program = ts.createProgram(fileNames, compilerOptions);
// const typeChecker = program.getTypeChecker();


export function entityDecoratorPreTask(sourceFile: ts.SourceFile, program: ts.Program, checker: ts.TypeChecker, fileObjects: TaskBeansType): TaskBeansType {

    const objects: ObjectsType = {};
    const importPaths: ImportPathType = {};
    // console.log(111 + `sourceFile.fileName: ${sourceFile.fileName} || path.resolve(__dirname): ${path.resolve(__dirname)}`)
    const currFileAbsolutePath = convertToAbsolutePath(sourceFile.fileName);

    // Check if any decorator has the target name
    const TARGET_DECORATOR_NAME = '@entity';

    ts.forEachChild(sourceFile, visitNode);

    function visitNode(node: ts.Node) {
        // const classData: ClassDataType = {};
        // const enumData: EnumDataType = {};

        // if enum
        if (ts.isEnumDeclaration(node)) {
            const targetName = node.name.getText(sourceFile);
            const properties: Record<string, string | number> = {};

            node.members.forEach((member: ts.EnumMember, idx) => {
                const propertyName = member.name.getText(sourceFile);
                const propertyValue = member.initializer?.getText(sourceFile) ?? idx;

                properties[propertyName] = propertyValue;
            });

            // enumInfo[targetName] = properties;
            // objectValueType[nName] = classInfo;
            const enumObject: EnumType = {
                type: ObjectTypeEnum.ENUM,
                data: properties,
            }
            objects[targetName] = enumObject;
        }

        if (ts.isClassDeclaration(node)) {
            if (!node.name?.text) return;

            if (!hasRecursiveFormDecorator(node, sourceFile, TARGET_DECORATOR_NAME)) {
                return;
            }

            const targetName = node.name.text;
            const properties: ClassDataType = {};


            node.members.forEach((member: ts.ClassElement) => {
                if (ts.isPropertyDeclaration(member)) {
                    const propertyName = member.name.getText(sourceFile);
                    const property = resolvePropertyType(member, sourceFile, program);

                    if (!property) return;
                    properties[propertyName] = property;


                    // const decorators: DecoratorType[] = [];
                    let decorators = ts.canHaveDecorators(member) ? ts.getDecorators(member) : [];
                    if (!decorators) return

                    let tobeMemberDecorators: any[] = []
                    decorators.forEach(d => {
                        let decoratorInfo = getDecoratorInfo(d, checker, sourceFile)
                        if (decoratorInfo == null) return
                        tobeMemberDecorators.push(decoratorInfo);
                    });
                    property.decorators = tobeMemberDecorators;
                }
            });
            // classInfo[targetName] = properties;

            const classObject: ClassType = {
                type: ObjectTypeEnum.CLASS,
                data: properties,
                decorators: [],
            }
            objects[targetName] = classObject;
        }

        if (ts.isImportDeclaration(node)) {
            let importPath = node.moduleSpecifier.getText(sourceFile);
            importPath = importPath.replace(/['"]/g, '');
            // console.log(222 + `currFileAbsolutePath: ${currFileAbsolutePath} || importPath: ${importPath}`)
            importPath = convertToAbsolutePath(importPath, getDirectoryPath(currFileAbsolutePath));
            // ext with ts if not exist ext
            if (!path.extname(importPath)) {
                importPath += '.ts';
            }
            const importName = node.importClause?.getText(sourceFile);
            if (importName) {
                const importNameArr = importName.split(',');
                importNameArr.forEach((name) => {
                    const importName = name.trim().replace(/[{}]/g, '');
                    if (importName) {
                        importPaths[importName] = importPath;
                    }
                });
            }
        }

        ts.forEachChild(node, visitNode);
    }

    const fileType: FileType = {
        importPaths: importPaths,
        objects: objects,
    }

    if (Object.keys(objects).length == 0) return fileObjects;

    // console.log(`currFileAbsolutePath: ${currFileAbsolutePath} || sourceFile.fileName: ${sourceFile.fileName}`)
    fileObjects[currFileAbsolutePath] = fileType;


    // TODO :: 모든 Path 절대경로 치환.
    // TODO :: importPaths 데이터 형태 유효성 확인
    return fileObjects;
}




export const KEY_DELIMITER = '/////'


export function recursiveUpdate(fileObjects: TaskBeansType, joinKey: string | undefined, maxDepth: number = 2, depth: number = 0): any {
    const files = Object.entries(fileObjects)
    const filePathClassNameObjects: {
        [filePathClassName: string]: {
            joinKey: string;
            classObject: ClassType | EnumType;
            filePath: string;
            className: string;
            importPaths: ImportPathType;
        }
    } = files.reduce((acc, file: [string, FileType]) => {
        const filePath = file[0]
        const fileValue = file[1]
        return {
            ...acc,
            ...(Object.entries(fileValue.objects)
                // .filter(([key, value]) => value.type === ObjectTypeEnum.CLASS)
                .reduce((innerAcc, [className, value]) => {
                    return {
                        ...innerAcc,
                        [`${filePath}${KEY_DELIMITER}${className}`]: {
                            joinKey: `${filePath}${KEY_DELIMITER}${className}`,
                            className: className,
                            filePath: filePath,
                            importPaths: fileValue.importPaths,
                            classObject: value
                        },
                    };
                }, {})),
        };
    }, {});

    // if(limit <= 0) throw new Error('limit exceeded')
    if (
        maxDepth != -1
        && depth > maxDepth
    ) throw new Error('depth exceeded')

    let joinKeys
    if (!!joinKey) {
        joinKeys = [joinKey]
    } else {
        joinKeys = Object.values(filePathClassNameObjects).map(el => el.joinKey)
    }

    if (!joinKeys || joinKeys.length === 0) return

    joinKeys.forEach(joinKey => {
        const classInfoObject = filePathClassNameObjects[joinKey];
        // console.log(`classInfoObject : ${classInfoObject} ||| joinKey : ${joinKey}`)
        const importPaths = classInfoObject?.importPaths;
        if(!importPaths) return
        // const filePath = classInfoObject.filePath;

        Object.keys(classInfoObject.classObject.data).forEach(propertyName => {
            // @ts-ignore
            const classProperty: ClassPropertyType = classInfoObject.classObject.data[propertyName];

            // console.log(classProperty)
            const typeName = classProperty.type
            const isTypeReferenceNode = classProperty.isTypeReferenceNode
            const referenceNode = classProperty.referenceNode
            // const isEnum = classProperty.isEnum // TODO :: ?

            // console.log(typeName, isTypeReferenceNode, referenceNode, isEnum)

            if (!typeName) return
            if (!!referenceNode) return

            const targetFilePath = importPaths[typeName]

            // TODO :: referenceNode 에 class, enum  구분할 수 있도록 해야하는데. 외부에 설
            // TODO :: 가장 공수가 적은 건 모든 class, enum naming 유니크로 제약 거는 것. 중복시 컴파일타임에 에러 띄우기.
            // TODO :: 문제는 enum에 데코레이터 적용이 안되서 프로젝트 규모가 커질수록.. 개발자가 일일히 네이밍 체크가 불가능해져.
            // TODO :: 가능하면 파일 경로까지 체크해서 네이밍 체크를 해야할듯.

            // TODO :: "classPath": "src/page/BasePage.tsx", > 문제는 멤버 변수들의 타입 Path 로딩이 가능한지인데.

            // if (!!enumTypeObjects[typeName]) {
            //     return classProperty.referenceNode = enumTypeObjects[typeName]
            // }
            const targetFileObjectKey = `${targetFilePath}${KEY_DELIMITER}${typeName}`
            const filePathClassNameObject = filePathClassNameObjects[targetFileObjectKey]
            // TODO :: ?
            if (!filePathClassNameObject) return
            const isClassType = filePathClassNameObject.classObject.type === ObjectTypeEnum.CLASS

            if (isTypeReferenceNode) {
                if (isClassType) {
                    entityDecoratorPostTask(fileObjects, targetFileObjectKey, maxDepth, depth)
                }
                // TODO :: type > importPaths
                return classProperty.referenceNode = filePathClassNameObject.classObject
            }
        })

    });
}


// const resJson = {}
// default depth 0
export function entityDecoratorPostTask(fileObjects: TaskBeansType, joinKey: string | undefined, maxDepth: number = 2, depth: number = 0): any {
    // console.log(`depth : ${depth} / limit : ${maxDepth} / className : ${joinKey}`)
    depth++

    recursiveUpdate(fileObjects, joinKey, maxDepth, depth)

    const fileContent =
        `import { FileObjectsType } from "../interface/EntityBeanInterface";`
        + `\n\n`
        + `export const entityBeans: FileObjectsType = `
        + JSON.stringify(fileObjects, null, 2)

    return fileContent;
}