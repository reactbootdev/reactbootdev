import * as ts from "typescript";
import {DecoratorInfoInterface} from "../copy/interface/BeanInterface";
import {
    ClassPropertyType,
    ClassType,
    EnumType,
    EntityBeanType,
    FileType,
    ImportPathType,
    ObjectTypeEnum
} from "../copy/interface/EntityBeanType";
import path from "path";

export function stringifyWithDepth(obj: any, maxDepth: number, currentDepth: number = 0): string {
    if (currentDepth > maxDepth) {
        return JSON.stringify(undefined);
    }

    return JSON.stringify(obj, (key, value) => {
        if (typeof value === 'object' && value !== null) {
            const keys = Object.keys(value);
            if (keys.length > 0 && currentDepth < maxDepth) {
                return value;
            }
        }
        return value;
    }, 1);
}


export function printJsonWithDepth(obj: any, maxDepth: number = 5): void {
    console.log(stringifyWithDepth(obj, maxDepth));
}


export function getSuperClasses(node: ts.ClassDeclaration, sourceFile: ts.SourceFile): string[] {
    const superClasses: string[] = [];

    if (node.heritageClauses) {
        const extendsClause = node.heritageClauses.find(clause => clause.token === ts.SyntaxKind.ExtendsKeyword);
        if (extendsClause) {
            extendsClause.types.forEach(type => {
                const superClass = type.expression.getText(sourceFile);
                superClasses.push(superClass);
            });
        }
    }

    return superClasses;
}

export function getClassFilePath(sourceFile: ts.SourceFile, className: string, preSourcePath: string): string | undefined {
    let classFilePath: string | undefined;

    ts.forEachChild(sourceFile, node => {
        if(!ts.isClassDeclaration(node)) return
        if (!node.name) return

        classFilePath = sourceFile.fileName;
    });

    if (!classFilePath) return undefined;
    return classFilePath
    // TODO :: remove
    // return replaceSrcPath(preSourcePath, classFilePath);
}


export function getTypeOfNode(node: ts.Node, program: ts.Program): string {
    const typeChecker = program.getTypeChecker();
    const type = typeChecker.getTypeAtLocation(node);
    return typeChecker.typeToString(type);
}

export function getDecoratorName(decorator: ts.Decorator): string | undefined {
    if (ts.isCallExpression(decorator.expression) && ts.isIdentifier(decorator.expression.expression)) {
        return decorator.expression.expression.text;
    }
    return undefined;
}

export function getDecoratorArgsTxt(decorator: ts.Decorator, sourceFile: ts.SourceFile): string[] {
    const args: ts.Expression[] = [];

    if (ts.isCallExpression(decorator.expression)) {
        args.push(...decorator.expression.arguments);
    }

    return args.map(el => el.getText(sourceFile));
}



export function getDecoratorInfo(decorator: ts.Decorator, checker: ts.TypeChecker, sourceFile: ts.SourceFile)
    : DecoratorInfoInterface | undefined {

    const decoratorName = getDecoratorName(decorator)
    const definition = getDecoratorDefinition(decorator, checker)
    const argValues = getDecoratorArgsReal(decorator, checker)
    const argTypes = getDecoratorType(decorator)
    const argsTexts = getDecoratorArgsTxt(decorator, sourceFile)

    if(decoratorName === undefined) return undefined
    if(definition === undefined) return undefined
    if(argValues === undefined) return undefined
    if(argTypes === undefined) return undefined
    if(argsTexts === undefined) return undefined

    return {
        decoratorName: decoratorName,
        definition: definition,

        arguments: argValues.map((el, idx) => {
            return {
                type: argTypes[idx],
                value: argValues[idx],
                txt: argsTexts[idx],
            }
        })

    }
}


export function getDecoratorDefinition(decorator: ts.Decorator, checker: ts.TypeChecker): string | undefined {
    if (ts.isCallExpression(decorator.expression)) {
        const decoratorType = checker.getTypeAtLocation(decorator.expression.expression);
        const decoratorTypeString = checker.typeToString(decoratorType);

        const decoratorValue = decorator.expression.arguments.map(arg => {
            // @ts-ignore
            const argValue = checker.getConstantValue(arg);
            return argValue;
        });

        return decoratorTypeString;
    }
    return undefined;
}

function getDecoratorType(decorator: ts.Decorator): string[] {
    if (ts.isCallExpression(decorator.expression)) {
        return decorator.expression.arguments.map(arg => {
            const argType = arg.kind === ts.SyntaxKind.TrueKeyword || arg.kind === ts.SyntaxKind.FalseKeyword
                ? 'boolean'
                : arg.kind === ts.SyntaxKind.StringLiteral
                    ? 'string'
                    : arg.kind === ts.SyntaxKind.NumericLiteral
                        ? 'number'
                        : ts.isArrayLiteralExpression(arg)
                            ? 'any[]'
                            : 'any';
            return argType;
        });
    }
    return [];
}

export function getDecoratorArgsReal(decorator: ts.Decorator, checker: ts.TypeChecker): any[] {
    if (ts.isCallExpression(decorator.expression)) {
        return decorator.expression.arguments.map(arg => {
            const argValue = getArgumentValue(arg, checker);
            return argValue;
        });
    }
    return [];
}

function getArgumentValue(arg: ts.Expression, checker: ts.TypeChecker): any {
    if (arg.kind === ts.SyntaxKind.TrueKeyword) {
        return true;
    } else if (arg.kind === ts.SyntaxKind.FalseKeyword) {
        return false;
    } else if (ts.isStringLiteral(arg)) {
        return arg.text;
    } else if (ts.isNumericLiteral(arg)) {
        return parseFloat(arg.text);
    } else if (ts.isArrayLiteralExpression(arg)) {
        return arg.elements.map(element => getArgumentValue(element, checker));
    } else if (ts.isObjectLiteralExpression(arg)) {
        const obj: any = {};
        arg.properties.forEach(property => {
            if (ts.isPropertyAssignment(property)) {
                obj[property.name.getText()] = getArgumentValue(property.initializer, checker);
            }
        });
        return obj;
    }
    return undefined;
}

export function replaceSrcPath(preSourcePath: string, path: string): string {
    if (!path.startsWith(preSourcePath)) return path;
    return path.replace(preSourcePath, '@src')
}

// remove extension support undefined
export function removeExtension(path: string | undefined): string | undefined {
    if(path === undefined) return path
    return path.replace(/\.[^/.]+$/, "");
}


export function isArrayElementTypeReferenceNode(node: ts.TypeNode): boolean {
    if (ts.isTypeReferenceNode(node)) return true
    if (ts.isArrayTypeNode(node)) {
        const elementType = node.elementType;
        return ts.isTypeReferenceNode(elementType);
    }
    return false;
}


export function hasRecursiveFormDecorator(node: ts.ClassDeclaration, sourceFile: ts.SourceFile, targetDecoratorName: string): boolean {
    const nodeDecorators = ts.canHaveDecorators(node) ? ts.getDecorators(node) ?? [] : [];

    return nodeDecorators.some(decorator => {
        return decorator.getText(sourceFile).includes(targetDecoratorName);
    });
}



export function hasCircularReference(obj: any) {
    const visitedObjects = new Set();

    function detectCircularReference(obj: any) {
        if (typeof obj === 'object' && obj !== null) {
            if (visitedObjects.has(obj)) {
                return true; // 순환 참조 발견
            }

            visitedObjects.add(obj);

            for (const key in obj) {
                if (detectCircularReference(obj[key])) {
                    return true; // 순환 참조 발견
                }
            }

            visitedObjects.delete(obj);
        }

        return false; // 순환 참조 없음
    }

    return detectCircularReference(obj);
}



export function resolveFilePath(orgFilePath: string, importFilePath: string, delimeter: string = '/'): string {

    if (importFilePath.startsWith('./')) {
        const calcFilePath = orgFilePath.split(delimeter).slice(0, -1).join(delimeter);
        const result = importFilePath.replace('./', calcFilePath + delimeter);
        return result;
    }

    const cntUpperDir = importFilePath.split('../').length - 1;
    const calcFilePath = orgFilePath.split(delimeter).slice(0, -cntUpperDir).join(delimeter);
    const result = calcFilePath + delimeter + importFilePath.split('../').slice(-1)[0];

    return result;
}


export function convertToAbsolutePath(filePath: string, baseDir: string = path.resolve(__dirname)): string {
    // console.log param
    filePath = path.normalize(filePath);

    if (path.isAbsolute(filePath)) {
        const result = path.normalize(filePath);
        // console.log(`1 filePath : ${filePath} || baseDir : ${baseDir} || result : ${result}`)
        return result;
    }

    filePath = removeFirstDirectoryFromRelativePath(filePath);
    filePath = path.resolve(baseDir, filePath);
    const result = path.normalize(filePath);
    // console.log(`2 filePath : ${filePath} || baseDir : ${baseDir} || result : ${result}`)
    return result;
}

export function getDirectoryPath(filePath: string): string {
    const directoryPath = filePath.substring(0, filePath.lastIndexOf('\\'));
    return directoryPath;
}

export function getDirectoryPathByDelimiter(filePath: string, delimiter: string = '\\'): string {
    const directoryPath = filePath.substring(0, filePath.lastIndexOf(delimiter));
    return directoryPath;
}

export function removeFirstDirectoryFromRelativePath(filePath: string): string {
    filePath = path.normalize(filePath);
    const parts = filePath.split('\\');
    if (parts.length > 1) {
        parts.shift();
    }
    return parts.join('\\');
}

export function findTypeLocation(sourceFile: ts.SourceFile, typeNode: ts.TypeNode, program: ts.Program): string {
    const defaultResult = sourceFile.fileName;
    const typeChecker = program.getTypeChecker();

    // console.log(`findTypeLocation > ${typeNode.getText(sourceFile)}`)
    if (!ts.isIdentifier(typeNode)) {
        return defaultResult;
    }

    const symbol = typeChecker.getSymbolAtLocation(typeNode);
    if (!symbol) {
        return defaultResult;
    }

    const declarations = symbol.getDeclarations();
    if (!declarations || declarations.length === 0) {
        return defaultResult;
    }

    const declaration = declarations[0];
    const declarationSourceFile = declaration.getSourceFile();
    return declarationSourceFile.fileName;
}

// TODO :: class name 충돌 시 > entity 내부 값으로 변경 가능? 우선순위 설정.
export function resolvePropertyType(member: ts.PropertyDeclaration, sourceFile: ts.SourceFile, program: ts.Program): ClassPropertyType | undefined {
    const node = member.type
    if (!node) return undefined

    const typeName = node.getText(sourceFile);
    const BASIC_TYPES = ['string', 'number', 'boolean', 'any',]
    if (BASIC_TYPES.includes(typeName)) {
        return {
            type: typeName,
            isArray: false,
            isTypeReferenceNode: false,
            // isEnum: false,
            // isLiteral: ts.isLiteralTypeNode(node),
            // isStringLiteral: ts.isStringLiteral(node),
        };
    }

    // console.log(typeName)
    const isReferenceNode = isArrayElementTypeReferenceNode(node);
    const isArray = ts.isArrayTypeNode(node);
    const reTypeName = isArray ? typeName.replace('[]', '') : typeName;
    // const isEnum = isPropertyOfTypeEnum(member);
    const filePath = findTypeLocation(sourceFile, node, program);
    if (!isReferenceNode) return undefined

    return {
        type: reTypeName,
        isArray: isArray,
        isTypeReferenceNode: isReferenceNode,
        // isEnum: isEnum,
        // isLiteral: ts.isLiteralTypeNode(node),
        // isStringLiteral: ts.isStringLiteral(node),
    };
}

function isPropertyOfTypeEnum(node: ts.Node): boolean {
    // if (ts.isTypeNode(node))

    // TODO :: 작동 불가
    return false
}