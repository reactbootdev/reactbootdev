import path from 'path';
import * as ts from 'typescript';
import {
    ClassDataType,
    ClassPropertyType,
    ClassType,
    EnumType,
    FileType,
    ImportPathType,
    ObjectsType,
    ObjectTypeEnum,
    TaskBeansType,
} from "../copy/interface/TaskBeansType";
import {
    getDecoratorInfo,
    hasRecursiveFormDecorator,
    removeExtension,
    resolveFilePath,
    resolvePropertyType,
} from "../util/NodeUtil";
import {KEY_DELIMITER} from "../config/config";


export interface TaskArgsInterface {
    decoratorNames: string[],
    resultFileName: string,
    isRecursiveConnection: boolean,
    maxDepthRecursiveConnection: number,
    taskBeans: TaskBeansType,
}


export function commonDecoratorPreTask(sourceFile: ts.SourceFile, program: ts.Program, checker: ts.TypeChecker, taskArgs: TaskArgsInterface): TaskBeansType {
    const taskBeans = taskArgs.taskBeans;

    const objects: ObjectsType = {};
    const importPaths: ImportPathType = {};
    // console.debug(111 + `sourceFile.fileName: ${sourceFile.fileName} || path.resolve(__dirname): ${path.resolve(__dirname)}`)

    // Check if any decorator has the target name
    const TARGET_DECORATOR_NAME = taskArgs.decoratorNames;
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

            // if (!hasRecursiveFormDecorator(node, sourceFile, TARGET_DECORATOR_NAME)) {
            //     return;
            // }
            let isHaveTargetDecorator = false
            taskArgs.decoratorNames.forEach(decoratorName => {
                if (hasRecursiveFormDecorator(node, sourceFile, decoratorName)) {
                    isHaveTargetDecorator = true
                }
            })
            if (!isHaveTargetDecorator) return


            const decorators = ts.canHaveDecorators(node) ? ts.getDecorators(node) : [];
            if (!decorators) return
            const tobeDecorators: any[] = []
            decorators.forEach(d => {
                let decoratorInfo = getDecoratorInfo(d, checker, sourceFile)
                if (decoratorInfo == null) return
                tobeDecorators.push(decoratorInfo);
            });


            const targetName = node.name.text;
            const properties: ClassDataType = {};

            node.members.forEach((member: ts.ClassElement) => {

                const propertyNameTmp = member?.name?.getText(sourceFile);

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

            // importPath = convertToAbsolutePath(importPath, getDirectoryPath(currFileAbsolutePath));
            // importPath = convertToAbsolutePath(importPath, getDirectoryPathByDelimiter(currFileAbsolutePath, '/'))

            importPath = resolveFilePath(currFileAbsolutePath, importPath)

            // ext with ts if not exist ext
            if (!path.extname(importPath)) {
                // TODO :: json, ts, tsx ?
                importPath += '.ts';
            }
            // remove before `@` string in importPath
            importPath = importPath.replace(/.*@/, '');
            console.debug(`importPath: ${importPath}`)

            let importName = node.importClause?.getText(sourceFile);

            if (importName) {
                const importNameArr = importName.split(',');
                importNameArr.forEach((name) => {
                    let importName = name.trim().replace(/[{}]/g, '');
                    importName = importName.replace(/\r\n/g, '').trim();
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
    console.debug(`currFileAbsolutePath: ${currFileAbsolutePath} || sourceFile.fileName: ${sourceFile.fileName} || baseDir: ${path.resolve(__dirname)}`)
    const srcDir = path.resolve(__dirname, '../src');
    console.debug(`srcDir: ${srcDir}`)

    taskBeans[currFileAbsolutePath] = fileType;
    return taskBeans;
}


export function recursiveUpdate(fileObjects: TaskBeansType, joinKey: string | undefined, maxDepth: number = 2, depth: number = 0, taskArgs: TaskArgsInterface): any {
    console.debug(`depth : ${depth} / maxDepth : ${maxDepth} / joinKey : ${joinKey}`)
    const resultFileName = taskArgs.resultFileName

    depth++

    // TODO :: function 분리 예정
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
    ) {
        console.debug((`depth exceeded : depth > maxDepth : ${depth} > ${maxDepth} `))
        // throw new Error
        return
    }

    let joinKeys
    if (!!joinKey) {
        joinKeys = [joinKey]
    } else {
        joinKeys = Object.values(filePathClassNameObjects).map(el => el.joinKey)
    }

    if (!joinKeys || joinKeys.length === 0) return

    console.debug(`joinKeys : ${joinKeys}`)

    joinKeys.forEach(joinKey => {
        const classInfoObject = filePathClassNameObjects[joinKey];
        const importPaths = classInfoObject?.importPaths;
        if (!importPaths) return
        console.debug(`classInfoObject : ${JSON.stringify(classInfoObject)}`)

        Object.keys(classInfoObject.classObject.data).forEach(propertyName => {
            console.debug(`propertyName : ${propertyName}`)
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

            console.debug(`targetFileObjectKey : ${targetFileObjectKey}`)
            console.debug(`filePathClassNameObject : ${filePathClassNameObject}`)

            classProperty.realType = classProperty.type

            if (!filePathClassNameObject) return
            const isClassType = filePathClassNameObject.classObject.type === ObjectTypeEnum.CLASS

            if (isTypeReferenceNode) {
                classProperty.realType = `%%%%${resultFileName}${importMapName}['${targetFilePath}${KEY_DELIMITER}${typeName}']%%%%`
                if (isClassType) {
                    recursiveUpdate(fileObjects, targetFileObjectKey, maxDepth, depth, taskArgs)
                }
                return classProperty.referenceNode = filePathClassNameObject.classObject
            }
        })

    });
}

export function getRefinedObjectName(filePath: string, objectName: string) {
    filePath = filePath.replace(/\\/g, '/')
    const removedExtensionFilePath = removeExtension(filePath) ?? ``
    // remove first `@`
    let refinedObjectName = removedExtensionFilePath.replace(/.*@/, '')
    refinedObjectName = refinedObjectName.replace(/\//g, '_')
    refinedObjectName += `____${objectName}`
    return refinedObjectName
}

export function updateRefSelfImportPath(taskArgs: TaskArgsInterface) {
    const fileObjects = taskArgs.taskBeans
    const resultFileName = taskArgs.resultFileName

    Object.entries(fileObjects).forEach(([filePath, fileType]) => {
        const importPaths = fileType.importPaths

        const objects = fileType.objects

        Object.entries(objects).forEach(([objectName, objectMap]) => {
            importPaths[objectName] = filePath
        })
    })
}


// const resJson = {}
// default depth 0
export function commonDecoratorPostTask(taskArgs: TaskArgsInterface, joinKey: string | undefined, maxDepth: number = 5, depth: number = 0): any {

    const fileObjects = taskArgs.taskBeans
    const resultFileName = taskArgs.resultFileName
    updateRefSelfImportPath(taskArgs)
    recursiveUpdate(fileObjects, undefined, maxDepth, depth, taskArgs)

    const importStatements = ``
        + `\n`
        + Object.entries(fileObjects).map(([filePath, fileType]) => {
            return Object.entries(fileType.objects).map(([objectName, objectMap]) => {
                filePath = filePath.replace(/\\/g, '/')
                const removedExtensionFilePath = removeExtension(filePath) ?? ``
                const refinedObjectName = getRefinedObjectName(filePath, objectName)

                return `import { ${objectName} as ${refinedObjectName} } from "@${removedExtensionFilePath}";`
            }).join('\n')
        }).join('\n')
        + `\n`


    const importMap = ``
        + `export const ${resultFileName}${importMapName}: { [key: string]: any } = {`
        + `\n`
        + Object.entries(fileObjects).map(([filePath, fileType]) => {
            return Object.entries(fileType.objects).map(([objectName, objectMap]) => {
                filePath = filePath.replace(/\\/g, '/')
                const refinedObjectName = getRefinedObjectName(filePath, objectName)

                return `\t"${filePath}${KEY_DELIMITER}${objectName}" : ${refinedObjectName}`
            }).join(',\n')
        }).join(',\n')
        + `\n`
        + `}`

    const importType = [`${beanTypeName}`, `${objectTypeEnumName}`]
    const importFrom = `"../interface/${beanTypeName}"`

    const fileContent = ``
        + `import { ${importType.join(`,`)} } from ${importFrom};`
        + `\n\n`
        + importStatements
        + `\n\n`
        + importMap
        + `\n\n`
        + `export const ${resultFileName}${beansName}: ${beanTypeName} = `
        + JSON.stringify(fileObjects, null, 2)

    return replaceStringTypeToEnum(fileContent);
}

const importMapName = `ImportMap`
const beansName = `Beans`
const beanTypeName = `TaskBeansType`
const objectTypeEnumName = `ObjectTypeEnum`

function replaceStringTypeToEnum(text: string) {
    text = text.replace(/"type": "class"/g, `"type": ${objectTypeEnumName}.CLASS`)
    text = text.replace(/"type": "enum"/g, `"type": ${objectTypeEnumName}.ENUM`)
    text = text.replace(/"\%\%\%\%/g, '')
    text = text.replace(/\%\%\%\%"/g, '')

    // text = text.replace(/"realType": "string"/g, `"realType": String`)
    // text = text.replace(/"realType": "number"/g, `"realType": Number`)
    // text = text.replace(/"realType": "boolean"/g, `"realType": Boolean`)

    return text
}