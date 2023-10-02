import * as ts from "typescript";
import {DecoratorInfoInterface} from "../copy/interface/BeanInterface";
import {ClassPropertyType} from "../copy/interface/TaskBeansType";
import path from "path";

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
        name: decoratorName,
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

export function resolveFilePath(orgFilePath: string, importFilePath: string, delimeter: string = '/'): string {
    if (importFilePath.startsWith('src/')) {
        return importFilePath;
    }

    if (importFilePath.startsWith('./')) {
        const calcFilePath = orgFilePath.split(delimeter).slice(0, -1).join(delimeter);
        const result = importFilePath.replace('./', calcFilePath + delimeter);
        return result;
    }

    const cntUpperDir = importFilePath.split('../').length;
    const calcFilePath = orgFilePath.split(delimeter).slice(0, -cntUpperDir).join(delimeter);

    let result = calcFilePath + delimeter + importFilePath.split('../').slice(-1)[0];
    if (result.startsWith('@')) {
        result = result.replace('@', '');
    }
    if (result.startsWith('/')) {
        result = result.replace('/', '');
    }

    return result;
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

export function resolvePropertyType(member: ts.PropertyDeclaration, sourceFile: ts.SourceFile, program: ts.Program): ClassPropertyType | undefined {
    const node = member.type
    if (!node) return undefined

    const typeName = node.getText(sourceFile);
    console.debug(`resolvePropertyType > ${typeName}`)
    const BASIC_TYPES = ['string', 'number', 'boolean', 'any',]
    if (BASIC_TYPES.includes(typeName)) {
        return {
            type: typeName,
            isArray: false,
            isTypeReferenceNode: false,
        };
    }

    const isReferenceNode = isArrayElementTypeReferenceNode(node);
    const isArray = typeName.includes('[]');
    const reTypeName = isArray ? typeName.replace('[]', '') : typeName;

    return {
        type: reTypeName,
        isArray: isArray,
        isTypeReferenceNode: isReferenceNode,
    };
}

