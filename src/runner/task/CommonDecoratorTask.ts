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
    getDecoratorInfo, getDirectoryPath, getDirectoryPathByDelimiter, hasRecursiveFormDecorator,
    isArrayElementTypeReferenceNode, removeExtension, resolveFilePath, resolvePropertyType,
    // resolveRecursiveTypes
} from "../util/NodeUtil";
import {BeanInterface} from "../copy/interface/BeanInterface";
import {entityDecoratorPostTask} from "./EntityDecoratorTask";
import {KEY_DELIMITER} from "../config/config";


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


export interface TaskArgsInterface {
    decoratorNames: string[],
    resultFileName: string,
    isRecursiveConnection: boolean,
    maxDepthRecursiveConnection: number,
    taskBeans: TaskBeansType,
}


export function commonDecoratorPreTask(sourceFile: ts.SourceFile, program: ts.Program, checker: ts.TypeChecker, taskBeans: TaskBeansType): TaskBeansType {

    const objects: ObjectsType = {};
    const importPaths: ImportPathType = {};
    // console.log(111 + `sourceFile.fileName: ${sourceFile.fileName} || path.resolve(__dirname): ${path.resolve(__dirname)}`)

    // Check if any decorator has the target name
    const TARGET_DECORATOR_NAME = '@page';
    // const TARGET_DECORATOR_NAME = '@entity';
    // const currFileAbsolutePath = convertToAbsolutePath(sourceFile.fileName);
    const currFileAbsolutePath = sourceFile.fileName.replace(/.*src\//, 'src/');


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

            const decorators = ts.canHaveDecorators(node) ? ts.getDecorators(node) : [];
            if (!decorators) return
            // 데코레이터
            const tobeDecorators: any[] = []
            decorators.forEach(d => {
                let decoratorInfo = getDecoratorInfo(d, checker, sourceFile)
                if (decoratorInfo == null) return
                tobeDecorators.push(decoratorInfo);
            });



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
                decorators: tobeDecorators,
            }
            objects[targetName] = classObject;
        }

        if (ts.isImportDeclaration(node)) {
            let importPath = node.moduleSpecifier.getText(sourceFile);
            importPath = importPath.replace(/['"]/g, '');
            // console.log(222 + `currFileAbsolutePath: ${currFileAbsolutePath} || importPath: ${importPath}`)

            // importPath = convertToAbsolutePath(importPath, getDirectoryPath(currFileAbsolutePath));
            // importPath = convertToAbsolutePath(importPath, getDirectoryPathByDelimiter(currFileAbsolutePath, '/'))

            importPath = resolveFilePath(currFileAbsolutePath, importPath)

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

    if (Object.keys(objects).length == 0) return taskBeans;

    console.log(`currFileAbsolutePath: ${currFileAbsolutePath} || sourceFile.fileName: ${sourceFile.fileName} || baseDir: ${path.resolve(__dirname)}`)
    // how to get only absolute path

    const srcDir = path.resolve(__dirname, '../src');
    console.log(`srcDir: ${srcDir}`)


    // fileObjects[currFileAbsolutePath] = fileType;
    // get after src in filepath by sourceFile.fileName

    // fileObjects[reFileName] = fileType;
    taskBeans[currFileAbsolutePath] = fileType;


    // TODO :: 모든 Path 절대경로 치환.
    // TODO :: importPaths 데이터 형태 유효성 확인
    return taskBeans;
}




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
        const importPaths = classInfoObject?.importPaths;
        if(!importPaths) return

        Object.keys(classInfoObject.classObject.data).forEach(propertyName => {
            // @ts-ignore
            const classProperty: ClassPropertyType = classInfoObject.classObject.data[propertyName];
            const typeName = classProperty.type
            const isTypeReferenceNode = classProperty.isTypeReferenceNode
            const referenceNode = classProperty.referenceNode

            if (!typeName) return
            if (!!referenceNode) return

            const targetFilePath = importPaths[typeName]

            const targetFileObjectKey = `${targetFilePath}${KEY_DELIMITER}${typeName}`
            const filePathClassNameObject = filePathClassNameObjects[targetFileObjectKey]
            if (!filePathClassNameObject) return
            const isClassType = filePathClassNameObject.classObject.type === ObjectTypeEnum.CLASS

            if (isTypeReferenceNode) {
                if (isClassType) {
                    entityDecoratorPostTask(fileObjects, targetFileObjectKey, maxDepth, depth)
                }
                return classProperty.referenceNode = filePathClassNameObject.classObject
            }
        })

    });
}

// const resJson = {}
// default depth 0
export function commonDecoratorPostTask(fileObjects: TaskBeansType, joinKey: string | undefined, maxDepth: number = 5, depth: number = 0): any {
    console.log(`depth : ${depth} / limit : ${maxDepth} / className : ${joinKey}`)

    depth++

    recursiveUpdate(fileObjects, joinKey, maxDepth, depth)


    const importStatements = ``
        + `\n`
        + Object.entries(fileObjects).map(([filePath, fileType]) => {
            return Object.entries(fileType.objects).map(([objectName, objectMap]) => {
                filePath = filePath.replace(/\\/g, '/')
                return `import { ${objectName} } from "${removeExtension(filePath)}";`
            }).join('\n')
        }).join('\n')
        + `\n`

    const importMap = ``
    + `export const importMap: { [key: string]: any } = {`
    + `\n`
    + Object.entries(fileObjects).map(([filePath, fileType]) => {
        return Object.entries(fileType.objects).map(([objectName, objectMap]) => {
            filePath = filePath.replace(/\\/g, '/')
            return `\t"${filePath}${KEY_DELIMITER}${objectName}" : ${objectName}`
        }).join(',\n')
    }).join(',\n')
    + `\n`
    + `}`


    const fileContent =``
        + `import { FileObjectsType } from "../interface/EntityBeanInterface";`
        + `\n\n`
        + importStatements
        + `\n\n`
        + importMap
        + `\n\n`
        + `export const entityBeans: FileObjectsType = `
        + JSON.stringify(fileObjects, null, 2)

    return fileContent;
}